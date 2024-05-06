import React from 'react';
import vid from '../assets/vidd.mp4'; 

function  Preload({ onVideoEnd }) {
  return (
    <div className="preloader flex justify-center items-center">
      <video autoPlay muted onEnded={onVideoEnd}>
        <source src={vid} type="video/mp4" />
      </video>
    </div>
  );
}

export default Preload;