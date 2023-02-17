import React, { useEffect, useState } from "react";
import "./styles.css";

const MiniProgressBar = ({ goal, raised }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.round((raised / goal) * 100, 0));
  }, []);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
        <div className="progress-circle" style={{ left: `${progress}%` }}>
          <div className="progress-percentage">{`${progress}%`}</div>
        </div>
      </div>
      <div className="progress-bar-infos">
        <div className="progress-bar-info">
          <span>OUR GOAL</span>
          <p>${goal.toLocaleString()}</p>
        </div>
        <div className="progress-bar-info">
          <span>RAISED</span>
          <p>${raised.toLocaleString()}</p>
        </div>
        <div className="progress-bar-info">
          <span>TO GO</span>
          <p>${(goal - raised).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniProgressBar;
