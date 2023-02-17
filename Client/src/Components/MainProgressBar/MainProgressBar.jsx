import React, { useEffect, useState } from "react";
import "./styles.css";

const MainProgressBar = () => {
  const [progress, setProgress] = useState(20); // state variable to track progress
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (progress < 100) {
  //       setProgress(progress + 10); // increment progress by 10 every second until it reaches 100
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [progress]);
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
      <div className="progress-info">
        <div className="progress-info-container">
          <h4>$1,242</h4>
          <span>Raised</span>
        </div>
        <div className="progress-info-container">
          <h4>78%</h4>
          <span>From goal</span>
        </div>
        <div className="progress-info-container">
          <h4>$231,232</h4>
          <span>Total goal</span>
        </div>
      </div>
    </div>
  );
};

export default MainProgressBar;
