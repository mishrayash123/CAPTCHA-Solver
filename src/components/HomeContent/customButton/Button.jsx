import React from "react";

const customButton = ({ text,width="auto",onClick }) => {
  return (
    <button className="bg-blue-950 text-white font-bold py-2 px-4 shadow-md rounded-3xl" onClick={onClick} style={{width:width}}>
      {text}
    </button>
  );
};

export default customButton;
