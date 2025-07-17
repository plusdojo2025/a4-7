import React, { useState } from "react";

const BackgroundComponents = ({ onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const backgrounds = [
    "/bg1.png",
    "/bg2.png",
    "/bg3.png",
    "/bg4.png",
    "/bg5.png",
  ];

  const handleClick = (index) => {
    setSelectedIndex(index);
    onSelect(backgrounds[index]);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="font-bold mb-2">背景を選んでください</h3>
      <div className="grid grid-cols-3 gap-2">
        {backgrounds.map((bg, index) => (
          <img
            key={index}
            src={bg}
            alt={`背景${index + 1}`}
            className={`w-24 h-24 object-cover cursor-pointer border-4 ${
              selectedIndex === index ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundComponents;
