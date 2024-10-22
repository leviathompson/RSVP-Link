import React from "react";

const Card = (props) => {
  return (
    <div
      className={`flex gap-8 pb-4 flex-col bg-cream-200 rounded-4xl shadow-md max-w-lg ${
        !(props.back && props.loading) && !props.title ? "pt-8" : ""
      }`}
    >
      {(props.back && props.loading) ||
        (props.title && (
          <div className="flex flex-row gap-4 justify-between align-middle pt-8 pb-4 px-9 bg-cream-100 rounded-t-4xl">
            {props.back && props.loading !== undefined && (
              <button
                className="pt-1"
                onClick={props.back}
                disabled={props.loading}
              >
                <i className="fi fi-sr-angle-left"></i>
              </button>
            )}
            <h2 className="w-full">{props.title}</h2>
          </div>
        ))}

      <div className="flex gap-8 flex-col px-9">{props.children}</div>
    </div>
  );
};

export default Card;
