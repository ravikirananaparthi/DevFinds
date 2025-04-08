import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { TextPlugin } from "gsap/TextPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Import existing assets
import ss from "../assets/ss.jpg"
import jh from "../assets/Jn.jpg"
import fl from "../assets/flutter.jpg"
import dv from "../assets/finaldev.jpg"
import dvp from "../assets/m1.png"
import dsvp from "../assets/kk.png"
import dsvpk from "../assets/ggm1.png"
import f from "../assets/fed.png"
import r from "../assets/rt.png"
import d from "../assets/dm.png"
import mc from "../assets/ml.jpg"
import s from "../assets/sn.jpg"

// Register GSAP plugins
gsap.registerPlugin(TextPlugin, ScrollTrigger)

export default function Landing() {
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(1)
  const [isVisible, setIsVisible] = useState(false)

  // Refs for logo animation elements
  const containerRef = useRef(null)
  const leftBracketRef = useRef(null)
  const rightBracketRef = useRef(null)
  const slashRef = useRef(null)
  const devRef = useRef(null)
  const findsRef = useRef(null)

  // Refs for page sections
  const headerRef = useRef(null)
  const sectionRef = useRef(null)
  const typingRef = useRef(null)

  // Logo animation sequence
  useEffect(() => {
    // Create a timeline for the logo animation
    const tl = gsap.timeline({
      onComplete: () => {
        setLogoAnimationComplete(true)
        setIsVisible(true)
      },
    })

    // Initial setup - all elements hidden
    tl.set([leftBracketRef.current, rightBracketRef.current, slashRef.current, devRef.current, findsRef.current], {
      opacity: 0,
    })

    // Start animation sequence - step by step as requested
    tl
      // Step 1: Show </> (brackets and slash together)
      .to([leftBracketRef.current, slashRef.current, rightBracketRef.current], {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        textShadow: "0 0 5px #00BFFF, 0 0 10px #00BFFF",
      })

      // Step 2: Show <v / F>
      .to(devRef.current, {
        opacity: 0.3,
        text: "v",
        duration: 0.3,
        ease: "power2.out",
        textShadow: "0 0 5px #00BFFF, 0 0 10px #00BFFF",
      })
      .to(
        findsRef.current,
        {
          opacity: 0.3,
          text: "F",
          duration: 0.3,
          ease: "power2.out",
          textShadow: "0 0 5px #FFFFFF, 0 0 10px #FFFFFF",
        },
        "-=0.1",
      )

      // Step 3: Show <ev / Fin>
      .to(devRef.current, {
        text: "ev",
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(
        findsRef.current,
        {
          text: "Fin",
          opacity: 0.6,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.1",
      )

      // Step 4: Show <Dev / Finds>
      .to(devRef.current, {
        text: "Dev",
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(
        findsRef.current,
        {
          text: "Finds",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.1",
      )

      // Step 5: Expand to < Dev / Finds > with more spacing
      .to([leftBracketRef.current, rightBracketRef.current], {
        x: (i) => (i === 0 ? -25 : 25),
        duration: 0.5,
        ease: "power2.inOut",
      })

      // Hold the complete logo
      .to(containerRef.current, {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(containerRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut",
      })

      // Fade out the logo
      .to(containerRef.current, {
        opacity: 0,
        scale: 1.2,
        duration: 1.5,
        delay: 0.8,
        ease: "power2.inOut",
      })

    return () => {
      tl.kill()
    }
  }, [])

  // Initialize scroll animations after logo animation completes
  useEffect(() => {
    if (logoAnimationComplete) {
      // Header animations
      gsap.from(headerRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })

      // Typing animation
      gsap.to(typingRef.current, {
        duration: 3,
        text: "Where Programming Experiences Connect!",
        ease: "none",
        delay: 0.5,
      })

      // Scroll-triggered animations
      gsap.utils.toArray(".animate-on-scroll").forEach((element, i) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          y: 100,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
        })
      })

      // Feature cards animation
      gsap.utils.toArray(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          x: i % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
        })
      })

      // Animate glowing borders
      gsap.utils.toArray(".glow-border").forEach((border) => {
        gsap.to(border, {
          backgroundPosition: "200% 0",
          duration: 3,
          repeat: -1,
          ease: "linear",
        })
      })
    }
  }, [logoAnimationComplete])

  const features = [
    {
      id: 1,
      name: "Curated Learning Feed",
      description:
        "Discover and follow fellow programmers to see their latest coding projects, challenges, and learning experiences. Stay inspired and learn from the community.",
      image: f,
      color: "#00FFFF",
      benefits: [
        "Personalized content based on your interests",
        "Discover trending projects and technologies",
        "Filter by programming language or technology stack",
      ],
    },
    {
      id: 2,
      name: "Realtime Collaboration",
      description:
        "Interact with your peers! Give and receive instant feedback on projects through likes, comments, and mentions. Discuss code snippets and problem-solve together in real-time.",
      image: r,
      color: "#FF00FF",
      benefits: [
        "Live code reviews and feedback",
        "Collaborative problem-solving sessions",
        "Instant notifications for mentions and replies",
      ],
    },
    {
      id: 3,
      name: "Direct Messaging",
      description:
        "Connect with classmates or coding buddies privately. Share ideas, ask questions, and collaborate on projects seamlessly within the platform.",
      image: d,
      color: "#00FF00",
      benefits: [
        "Private and group messaging capabilities",
        "Share code snippets, files, and media",
        "Searchable message history",
      ],
    },
    {
      id: 4,
      name: "Smart Notifications",
      description:
        "Stay up-to-date on what matters! Get notified about replies to your posts, comments on your projects, and messages from friends. Never miss a beat in your programming journey.",
      image: s,
      color: "#FFFF00",
      benefits: [
        "Customizable notification preferences",
        "Activity digests for busy periods",
        "Priority alerts for important interactions",
      ],
    },
    {
      id: 5,
      name: "Rich Text & Multimedia",
      description:
        "Showcase your work in style! Create detailed posts combining text, code snippets, images, and even videos to document your programming experiences and learning progress.",
      image: mc,
      color: "#FF5500",
      benefits: [
        "Syntax highlighting for code blocks",
        "Embed videos, images, and interactive demos",
        "Markdown support for easy formatting",
      ],
    },
  ]

  const testimonials = [
    {
      name: "Jaya Vardhan",
      role: "Frontend Developer",
      text: "DevFinds has transformed how I document my coding journey. The community feedback has helped me grow exponentially as a developer.",
    },
    {
      name: "Chakradhar",
      role: "Full Stack Engineer",
      text: "The collaborative features are incredible. I've connected with developers worldwide and built projects I never thought possible.",
    },
    {
      name: "Karthik",
      role: "Mobile App Developer",
      text: "As a self-taught developer, DevFinds has been invaluable. The supportive community and resource sharing make learning so much easier.",
    },
  ]

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "120K+", label: "Projects Shared" },
    { value: "85K+", label: "Problems Solved" },
    { value: "200+", label: "Countries" },
  ]

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* Logo Animation */}
      {!logoAnimationComplete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div ref={containerRef} className="relative flex items-center justify-center space-x-2">
            <span ref={leftBracketRef} className="text-5xl md:text-7xl font-mono text-[#00BFFF] font-logo mx-1">
              &lt;
            </span>
            <span ref={devRef} className="text-5xl md:text-7xl font-medium text-[#00BFFF] font-logo mx-1"></span>
            <span ref={slashRef} className="text-5xl md:text-7xl font-medium text-white font-logo mx-1">
              /
            </span>
            <span ref={findsRef} className="text-5xl md:text-7xl font-medium text-white font-logo mx-1"></span>
            <span ref={rightBracketRef} className="text-5xl md:text-7xl font-mono text-[#00BFFF] font-logo mx-1">
              &gt;
            </span>
          </div>
        </div>
      )}

      {/* Main Content - Only visible after animation */}
      <AnimatePresence>
        {isVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            {/* Hero Section */}
            <header ref={headerRef} className="relative py-20 lg:py-32 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-purple-900/40"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxYTFhMWEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              </div>

              <div className="container relative z-10 flex flex-col items-center justify-center gap-6 px-4 text-center md:gap-8 md:px-6 mx-auto">
                <div className="max-w-screen-lg">
                  <div className="flex flex-col items-center justify-center mb-6">
                    <h1 className="text-4xl font-medium tracking-tighter text-white sm:text-5xl md:text-6xl mb-2">
                      <span className="text-[#00BFFF] glow-text-soft font-logo mx-1">&lt;</span>
                      <span className="text-[#00BFFF] glow-text-soft font-logo mx-1">Dev</span>
                      <span className="text-white glow-text-white-soft font-logo mx-1">/</span>
                      <span className="text-white glow-text-white-soft font-logo mx-1">Finds</span>
                      <span className="text-[#00BFFF] glow-text-soft font-logo mx-1">&gt;</span>
                    </h1>
                    <h2
                      ref={typingRef}
                      className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 h-10"
                    ></h2>
                  </div>

                  <motion.p
                    className="mt-4 text-lg text-gray-300 md:text-xl max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Welcome to DevFinds – where programmers document their journey in the realm of code! Share your
                    coding escapades through text, images, and videos, inspiring and learning from fellow enthusiasts.
                    Join us in weaving a tapestry of experiences that enrich our collective programming odyssey!
                  </motion.p>
                </div>

                <motion.div
                  className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <Link
                    to="/app/register"
                    className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 group glow-border"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      Sign Up
                    </span>
                  </Link>

                  <Link
                    to="/app/login"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-purple-500 bg-transparent px-8 py-1 text-sm font-medium text-white transition-colors hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    Log In
                  </Link>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-6xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  {/* First Image */}
                  <motion.div
                    className="overflow-hidden rounded-xl border-4 border-[#00BFFF] glow-border-cyan relative"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={dsvp || "/placeholder.svg"}
                      alt="DevFinds showcase"
                      className="object-cover w-full h-[250px] md:h-[300px] rounded-lg p-3"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-center font-semibold text-lg">Code Collaboration</p>
                    </div>
                  </motion.div>

                  {/* Second Image */}
                  <motion.div
                    className="overflow-hidden rounded-xl border-4 border-[#FF00FF] glow-border-magenta relative"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={dvp || "/placeholder.svg"}
                      alt="DevFinds showcase"
                      className="object-cover w-full h-[250px] md:h-[300px] rounded-lg p-3"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-center font-semibold text-lg">Developer Community</p>
                    </div>
                  </motion.div>

                  {/* Third Image */}
                  <motion.div
                    className="overflow-hidden rounded-xl border-4 border-[#00FFFF] glow-border-blue relative"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={dsvpk || "/placeholder.svg"}
                      alt="DevFinds showcase"
                      className="object-cover w-full h-[250px] md:h-[300px] rounded-lg p-3"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-center font-semibold text-lg">Knowledge Sharing</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob animation-delay-4000"></div>
              </div>
            </header>

            {/* Stats Section */}
            <section className="py-12 relative bg-gradient-to-b from-black to-blue-950/20">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="text-4xl md:text-5xl font-bold text-[#00BFFF] mb-2 glow-text-soft">
                        {stat.value}
                      </div>
                      <div className="text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section ref={sectionRef} className="py-20 relative animate-on-scroll">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-blue-950/30 pointer-events-none"></div>

              <div className="container mx-auto grid items-center gap-8 px-4 md:px-6 lg:gap-12 lg:grid-cols-2 relative z-10">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-block rounded-lg bg-blue-500/10 px-3 py-1 text-sm text-blue-400 mb-2 border border-blue-500/20">
                    Capture Your Journey
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                    Document your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                      coding experiences
                    </span>
                  </h2>
                  <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Share your journey with the world. Let others learn from your experiences and grow together as a
                    community of developers.
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <span className="mr-2 text-green-400">✓</span>
                      Create detailed posts with code snippets, images, and videos
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-400">✓</span>
                      Document your learning process and breakthroughs
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-green-400">✓</span>
                      Build a portfolio of your programming achievements
                    </li>
                  </ul>
                  <div className="flex flex-col gap-2 min-[400px] md:flex-row pt-4">
                    <Link
                      to="/app/login"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1"
                    >
                      Get Started
                    </Link>
                    <ScrollLink
                      to="connect"
                      spy={true}
                      smooth={true}
                      duration={500}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-gray-700 bg-black/50 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900 hover:text-gray-50 focus-visible:outline-none focus-visible:ring-1"
                    >
                      Learn more
                    </ScrollLink>
                  </div>
                </motion.div>

                <motion.div
                  className="mx-auto overflow-hidden rounded-xl border-4 border-blue-500 glow-border-blue"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={dv || "/placeholder.svg"}
                    alt="DevFinds experience"
                    className="object-cover w-full sm:h-[350px] md:h-[450px] rounded-lg"
                  />
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 relative bg-gradient-to-b from-blue-950/30 to-purple-950/30">
              <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 animate-on-scroll">
                  <motion.h2
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Powerful{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      Features
                    </span>
                  </motion.h2>
                  <motion.p
                    className="max-w-[700px] mx-auto text-gray-400 md:text-xl/relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Everything you need to connect, share, and grow with fellow developers
                  </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 animate-on-scroll">
                  {/* Feature Navigation */}
                  <motion.nav
                    className="bg-gray-900/80 backdrop-blur-sm w-full lg:w-1/4 rounded-2xl py-6 px-4 border border-gray-800"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">
                      Explore Features
                    </h3>
                    <ul className="space-y-1">
                      {features.map((feature) => (
                        <motion.li
                          key={feature.id}
                          className={`py-2 px-4 rounded-md hover:bg-gray-800 text-gray-300 cursor-pointer transition-colors ${
                            selectedFeature === feature.id ? "bg-gray-800 border-l-2 border-blue-500" : ""
                          }`}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setSelectedFeature(feature.id)}
                        >
                          {feature.name}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.nav>

                  {/* Feature Display */}
                  <motion.div
                    className="lg:w-3/4 bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border-4 border-gray-800 glow-border-purple"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {selectedFeature ? (
                      <motion.div
                        className="p-8 flex flex-col md:flex-row items-center gap-8"
                        key={selectedFeature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `radial-gradient(circle, ${features.find((f) => f.id === selectedFeature).color}33 0%, transparent 70%)`,
                              animation: "pulse 2s infinite",
                            }}
                          ></div>
                          <img
                            src={features.find((f) => f.id === selectedFeature).image || "/placeholder.svg"}
                            alt={features.find((f) => f.id === selectedFeature).name}
                            className="w-full h-full object-cover rounded-full border-4 p-1"
                            style={{ borderColor: features.find((f) => f.id === selectedFeature).color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="text-2xl font-bold mb-4"
                            style={{ color: features.find((f) => f.id === selectedFeature).color }}
                          >
                            {features.find((f) => f.id === selectedFeature).name}
                          </h3>
                          <p className="text-gray-300 text-lg mb-4">
                            {features.find((f) => f.id === selectedFeature).description}
                          </p>
                          <div className="mt-4">
                            <h4 className="text-white text-lg mb-2">Key Benefits:</h4>
                            <ul className="space-y-2">
                              {features
                                .find((f) => f.id === selectedFeature)
                                .benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-[#00BFFF] mr-2">✦</span>
                                    <span className="text-gray-300">{benefit}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="p-8 flex items-center justify-center h-full">
                        <h3 className="text-2xl font-semibold text-gray-400">Select a feature to learn more</h3>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Code-like background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-5">
                  <pre className="text-xs md:text-sm text-blue-500 whitespace-pre-wrap">
                    {`
function DevFinds() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data
    fetchUserProfile();
    
    // Fetch posts
    fetchPosts();
  }, []);
  
  const shareExperience = (post) => {
    // Share your coding experience
    createPost(post);
  };
  
  return (
    <div className="app">
      <Header user={user} />
      <Feed posts={posts} />
      <CreatePost onSubmit={shareExperience} />
      <Footer />
    </div>
  );
}
                    `}
                  </pre>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 relative bg-gradient-to-b from-purple-950/30 to-blue-950/20">
              <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
                    What Developers Are{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                      Saying
                    </span>
                  </h2>
                  <p className="max-w-[700px] mx-auto text-gray-400 md:text-xl/relaxed">
                    Join thousands of developers who are already sharing their journey
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border-4 border-gray-800 glow-border-gold"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -10 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-white font-semibold">{testimonial.name}</h3>
                          <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 italic">"{testimonial.text}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Connect Section */}
            <section
              id="connect"
              className="py-20 relative bg-gradient-to-b from-blue-950/20 to-black animate-on-scroll"
            >
              <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
                    Connect with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
                      others
                    </span>
                  </h2>
                  <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl/relaxed">
                    Join the community. Share your work-based experiences and learn from others. Grow together in your
                    programming journey.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* First Image */}
                  <motion.div
                    className="feature-card overflow-hidden rounded-xl border-4 border-green-500 glow-border-green relative group"
                    whileHover={{
                      scale: 1.03,
                    }}
                  >
                    <img
                      src={ss || "/placeholder.svg"}
                      alt="Community showcase"
                      className="object-cover w-full h-[350px] md:h-[450px] rounded-lg transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Share Your Code</h3>
                        <p className="text-gray-300">Showcase your projects and get feedback from peers</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Second Image */}
                  <motion.div
                    className="feature-card overflow-hidden rounded-xl border-4 border-blue-500 glow-border-blue relative group"
                    whileHover={{
                      scale: 1.03,
                    }}
                  >
                    <img
                      src={jh || "/placeholder.svg"}
                      alt="Community showcase"
                      className="object-cover w-full h-[350px] md:h-[450px] rounded-lg transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Learn Together</h3>
                        <p className="text-gray-300">Collaborate on challenges and grow your skills</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Third Image */}
                  <motion.div
                    className="feature-card overflow-hidden rounded-xl border-4 border-purple-500 glow-border-purple relative group"
                    whileHover={{
                      scale: 1.03,
                    }}
                  >
                    <img
                      src={fl || "/placeholder.svg"}
                      alt="Community showcase"
                      className="object-cover w-full h-[350px] md:h-[450px] rounded-lg transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Build Your Network</h3>
                        <p className="text-gray-300">Connect with like-minded developers worldwide</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="particles-container">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 5 + 1}px`,
                        height: `${Math.random() * 5 + 1}px`,
                        backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative animate-on-scroll">
              <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                  className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 md:p-12 rounded-2xl border-4 border-blue-500/20 backdrop-blur-sm glow-border-blue"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-4">
                      Ready to{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        join
                      </span>{" "}
                      the community?
                    </h2>
                    <p className="text-gray-300 md:text-xl max-w-2xl mx-auto">
                      Start sharing your programming journey today and connect with developers from around the world.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      to="/app/register"
                      className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/app/login"
                      className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-md border border-gray-700 bg-black/50 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900 hover:text-gray-50 focus-visible:outline-none focus-visible:ring-1"
                    >
                      Sign In
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Animated background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob animation-delay-4000"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob"></div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-gray-800">
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-xl font-medium">
                      <span className="text-[#00BFFF] glow-text-soft font-logo mx-1">&lt;</span>
                      <span className="text-[#00BFFF] glow-text-soft font-logo mx-1">Dev</span>
                      <span className="text-white glow-text-white-soft font-logo mx-1">/</span>
                      <span className="text-white glow-text-white-soft font-logo mx-1">Finds</span>
                      <span className="text-[#00BFFF] glow-text-soft font-logo mx-1">&gt;</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">© {new Date().getFullYear()} DevFinds. All rights reserved.</p>
                  <div className="flex items-center justify-center space-x-4">
                    <a
                      href="#"
                      className="rounded-full border border-gray-800 bg-gray-950 w-8 h-8 flex items-center justify-center shadow-sm transition-colors hover:bg-gray-900 hover:border-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </a>
                    <a
                      href="#"
                      className="rounded-full border border-gray-800 bg-gray-950 w-8 h-8 flex items-center justify-center shadow-sm transition-colors hover:bg-gray-900 hover:border-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a
                      href="#"
                      className="rounded-full border border-gray-800 bg-gray-950 w-8 h-8 flex items-center justify-center shadow-sm transition-colors hover:bg-gray-900 hover:border-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }
          
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }
          
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.6;
          animation: float linear infinite;
        }
        
        .glow-text-soft {
          text-shadow: 0 0 5px #00BFFF, 0 0 10px #00BFFF;
        }
        
        .glow-text-white-soft {
          text-shadow: 0 0 5px #FFFFFF, 0 0 10px #FFFFFF;
        }
        
        .glow-border-blue {
          box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
          animation: borderGlowBlue 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.7), transparent);
          background-size: 200% 100%;
        }
        
        .glow-border-cyan {
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
          animation: borderGlowCyan 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.7), transparent);
          background-size: 200% 100%;
        }
        
        .glow-border-magenta {
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
          animation: borderGlowMagenta 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(255, 0, 255, 0.7), transparent);
          background-size: 200% 100%;
        }
        
        .glow-border-green {
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
          animation: borderGlowGreen 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.7), transparent);
          background-size: 200% 100%;
        }
        
        .glow-border-purple {
          box-shadow: 0 0 15px rgba(128, 0, 255, 0.5);
          animation: borderGlowPurple 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(128, 0, 255, 0.7), transparent);
          background-size: 200% 100%;
        }
        
        .glow-border-gold {
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
          animation: borderGlowGold 3s infinite linear;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.7), transparent);
          background-size: 200% 100%;
        }
        
        @keyframes borderGlowBlue {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes borderGlowCyan {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes borderGlowMagenta {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes borderGlowGreen {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes borderGlowPurple {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes borderGlowGold {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
