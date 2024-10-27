import React from "react";

const Card = (props) => {
  return (
    <div
      className={`flex gap-8 pb-8 flex-col bg-cream-200 rounded-4xl shadow-md max-w-2xl min-w-[300px] w-full  ${
        !(props.back && props.loading) && !props.title ? "pt-8" : ""
      }`}
    >
      {((props.back || props.title) && (
          <div className="flex flex-row gap-4 justify-between align-middle pt-8 pb-5 px-4 bg-cream-100 rounded-t-4xl border-b-2 border-cream-300">
            {props.back !== undefined && (
              <button
                className="pt-1"
                onClick={props.back}
              >
                <i className="fi fi-sr-angle-left"></i>
              </button>
            )}
            <h2 className="w-full">{props.title}</h2>
            {props.back !== undefined && (
              <div></div>
            )}
          </div>
        ))}

      <div className="flex gap-8 flex-col px-6">{props.children}</div>
    </div>
  );
};

export default Card;
