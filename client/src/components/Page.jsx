import React from "react";

const Page = (props) => {
  return (
    <div
      className="flex justify-center min-h-screen overflow-hidden bg-cream-300 py-6 px-4"
      style={{
        backgroundImage: props.background ? `url(${props.background})` : undefined,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="flex flex-col w-full">
        <div className="flex gap-5 pb-14 flex-col text-center items-center">
          <h1>{props.title}</h1>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Page;
