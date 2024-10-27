import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="fixed left-0 right-0 bottom-0 w-full h-16 bg-cream-200 z-20">
      <div className="text-sm font-bold flex flex-row justify-around max-w-lg my-0 mx-auto h-full px-2">
        <NavLink
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive
                ? "flex items-center h-full text-cream-700"
                : "flex items-center h-full",
              isTransitioning ? "transitioning" : "",
            ].join(" ")
          }
          to="/"
        >
          <div className="flex-col text-center">
            <i className="fi fi-bs-home text-xl"></i>
            <div>Home</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive
                ? "flex items-center h-full text-cream-700"
                : "flex items-center h-full",
              isTransitioning ? "transitioning" : "",
            ].join(" ")
          }
          to="/registry"
        >
          <div className="flex-col text-center">
            <i className="fi fi-br-gift-box-benefits text-xl"></i>
            <div>Registry</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive
                ? "flex items-center h-full"
                : "flex items-center h-full",
              isTransitioning ? "transitioning" : "",
            ].join(" ")
          }
          to="/profile"
        >
          <div className="flex-col text-center">
            <button className="btn-primary-sm">RSVP</button>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive
                ? "flex items-center h-full text-cream-700"
                : "flex items-center h-full",
              isTransitioning ? "transitioning" : "",
            ].join(" ")
          }
          to="/faq"
        >
          <div className="flex-col text-center">
            <i className="fi fi-br-info text-xl"></i>
            <div>Q&A</div>
          </div>
        </NavLink>
        <NavLink
          className={({ isActive, isPending, isTransitioning }) =>
            [
              isPending ? "pending" : "",
              isActive
                ? "flex items-center h-full text-cream-700"
                : "flex items-center h-full",
              isTransitioning ? "transitioning" : "",
            ].join(" ")
          }
          to="/activities"
        >
          <div className="flex-col text-center">
            <i className="fi fi-br-glass-cheers text-xl"></i>
            <div>Activities</div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
