import React from "react";

const SugorokuCell = ({ children }) => {
  return (
    <div className="w-16 h-16 border border-gray-400 rounded flex items-center justify-center bg-white shadow-sm">
      {children}
    </div>
  );
};

export default SugorokuCell;
