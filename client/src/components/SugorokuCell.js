import React from "react";
import "./SugorokuCell.css";

const SugorokuCell = ({ direction, isLast, isDone, children }) => {
  const getArrowClass = () => {
    if (isLast || !direction) return "";
    switch (direction) {
      case "right":
        return "arrow arrow-right";
      case "down":
        return "arrow arrow-down";
      case "left":
        return "arrow arrow-left";
      case "up":
        return "arrow arrow-up";
      default:
        return "";
    }
  };

  return (
    <div className={`sugoroku-cell ${isDone ? "done" : ""}`} style={{ position: "relative" }}>
      {children}
      <div className={getArrowClass()} />
    </div>
  );
};

export default SugorokuCell;
