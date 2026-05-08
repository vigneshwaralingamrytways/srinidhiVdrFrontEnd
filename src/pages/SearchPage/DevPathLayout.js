import React from "react";
import { FaArrowCircleLeft, FaArrowLeft } from "react-icons/fa";
import classes from "./DevPathLayout.module.css";

const DevPathLayout = ({ children, onBack}) => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.backButton} onClick={onBack}>
          <FaArrowCircleLeft
           style={{color:"#2e7d32"}} title="Back" />
        </div>
        <div className={classes.innerContent}>{children}</div>
      </div>
    </div>
  );
};

export default DevPathLayout;
