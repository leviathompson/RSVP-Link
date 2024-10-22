import React from "react";

const Page = (props) => {
  return (
    <div className="flex gap-5 flex-col text-center">
      <h1>{props.title}</h1>
      {props.children}
    </div>
  );
};

export default Page;
