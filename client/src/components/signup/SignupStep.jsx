import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../context/SignupProvider";
import FadeMessage from "../FadeMessage";
import Page from "../Page";
import Card from "../Card";

const SignupStep = () => {
  const { goToNextStep } = useSignup();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const URL = "http://192.168.86.52:4444";
  const navigate = useNavigate();

  const pullNameFromHat = () => {
    const randomNames = [
      "Peter Parker",
      "Kevin Malone",
      "Otto Octavius",
      "Donatello",
      "Zezima",
      "Ryan Reynolds",
      "Cloris Leachman",
      "Sorcerer Supreme",
      "Charlie Clark",
      "The Swedish Chef",
      "NileRed",
      "William Osman",
      "Voldemort",
      "Sachimo",
      "Nathan Fillion",
      "Hoban Washburne",
      "Bob Saget",
      "Vincent Adultman",
      "Bucky Barnes",
      "Felicity Jones",
      "Adam Savage",
      "Joseph Gordon-Levitt",
      "Salad Fingers",
      "Nathan Fielder",
      "Zendaya",
      "Robbie Rotten",
      "Albus Dumbledore",
      "Doc Hudson",
      "Marty McFly",
      "Olafur Eliasson",
      "Matt Murdock",
      "Jessie Pinkman",
      "Ben Stiller",
      "Mark Scout",
      "Scooby Doo",
    ];
    if (randomNames.length > 0) {
      return (
        "eg. " + randomNames[Math.floor(Math.random() * randomNames.length)]
      );
    } else {
      return "David Spade";
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleNameSubmit = async () => {
    if (name.trim() === "") {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${URL}/users/?name=${encodeURIComponent(name)}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      if (isMounted.current) {
        if (data.ok) {
          goToNextStep({ user: data.user });
        } else {
          setError(data.message);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Page title="Create Account">
      <Card
        title={
          <>
            Enter your name
          </>
        }
        back={() => navigate("/welcome")}
        loading={loading}
      >
        <form
          className="flex gap-8 flex-col"
          role="form"
          aria-label="Log in to RSVP"
          onSubmit={(e) => {
            e.preventDefault();
            handleNameSubmit();
          }}
        >
          <div className="max-w-prose">
            Please provide your first and last name to get your one-time access
            code.
          </div>
          <div className="text-left">
            <label className="font-bold" htmlFor="name">
              First and last name
            </label>
            <input
              className={`px-4 py-3 text-nougat-500 text-lg min-w-full rounded-xl border-nougat-500 focus:border-nougat-500 focus:outline-none focus:ring-2 focus:ring-cream-500 placeholder:text-cream-500 ${
                error
                  ? "border-rose-600 focus:border-rose-600 focus:ring-rose-500"
                  : ""
              }`}
              id="name"
              name="name"
              placeholder={pullNameFromHat()}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error && e.target.value.trim() !== "") {
                  setError(null);
                }
              }}
              aria-required="true"
              aria-describedby="name-desc"
            />
            <div id="name-desc" className="sr-only">
              Enter your full name as it appears on your invitation.
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !name}
            aria-busy={loading}
            aria-live="polite"
          >
            Continue
          </button>
          <FadeMessage message={error} duration={300} />
        </form>
      </Card>
    </Page>
  );
};

export default SignupStep;
