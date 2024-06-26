import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/errorHandling.js";
import { Post } from "../models/post.js";
import { Queue } from "bullmq";
import { createClient } from 'redis';

const redisClient = createClient({
    password: 'HJ4rIn9GaSvNntTYIAa8gGNrg21ameWt',
    socket: {
        host: 'redis-19119.c114.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 19119
    }
});
const emailQueue = new Queue("email-queue", {
  connection: {
      client: redisClient
  }
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid User or Password", 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid User or Password", 400));
    else {
      user.status = "online";
      await user.save();
      sendCookie(user, res, `Welcome back ${user.name}`, 200);
    }
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      image,
      programmingExperience,
      learnedTechnologies,
    } = req.body;

    let img = null;
    if (image != null) {
      img = image;
    }
    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User AllReady Exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: img,
      programmingExperience,
      learnedTechnologies,
    });
    console.log(user);
    await emailQueue.add(`${Date.now()}`, {
      from: "piyushgarg.dev@gmail.com",
      to: "student@gmail.com",
      subject: "Congrats on enrolling in Twitter Course",
      body: "Dear Student, You have been enrolled to Twitter Clone Course.",
    });

    sendCookie(user, res, "Registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyprofile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      user: req.user,
    });
};

export const feed = async (req, res, next) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "name image",
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const friendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const { requestTo } = req.body;
    console.log(userId);
    console.log(requestTo);
    const requestedUser = await User.findById(requestTo);
    if (!requestedUser) {
      return res
        .status(404)
        .json({ message: "Requested user not found", success: false });
    }

    if (userId == requestedUser._id) {
      return res.status(400).json({
        message: "Cannot send friend request to oneself",
        success: false,
      });
    }

    if (requestedUser.inRequest.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Friend request already sent", success: false });
    }

    if (requestedUser.friends.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Users are already friends", success: false });
    }

    if (requestedUser.outRequest.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Friend request already received", success: false });
    }

    requestedUser.inRequest.push(userId);
    await requestedUser.save();

    const currentUser = await User.findById(userId);
    currentUser.outRequest.push(requestTo);
    await currentUser.save();

    res
      .status(200)
      .json({ message: "Friend request sent successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentUser = await User.findById(userId);
    console.log(currentUser);
    if (!currentUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const inRequestDetails = await User.find({
      _id: { $in: currentUser.inRequest },
    })
      .select("name image")
      .exec();
    console.log(inRequestDetails);
    res.status(200).json({ friendRequests: inRequestDetails, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { requestBy, status } = req.body;

    const requestingUser = await User.findById(requestBy);
    if (!requestingUser) {
      return res
        .status(404)
        .json({ message: "Requesting user not found", success: false });
    }

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Status can be "Accepted" or "Rejected"',
        success: false,
      });
    }

    if (!requestingUser.outRequest.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Friend request not found", success: false });
    }

    const currentUser = await User.findById(userId);

    const index = currentUser.inRequest.indexOf(requestBy);
    if (index !== -1) {
      currentUser.inRequest.splice(index, 1);
    }

    const indexOutRequest = requestingUser.outRequest.indexOf(userId);

    if (indexOutRequest !== -1) {
      requestingUser.outRequest.splice(indexOutRequest, 1);
    }

    if (status === "Accepted") {
      currentUser.friends.push(requestBy);
      requestingUser.friends.push(userId);
    }

    await currentUser.save();
    await requestingUser.save();

    res.status(200).json({
      message: `Friend request ${status.toLowerCase()} successfully`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const trend = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $sort: { likesCount: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          image: 1,
          createdAt: 1,
          tof: 1, // Include the 'tof' field
          user: { $arrayElemAt: ["$user", 0] },
          likesCount: 1,
          commentsCount: { $size: "$comments" },
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
