import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../context/SignupProvider";
import { useAuth } from "../../context/AuthProvider";
import FadeMessage from "../FadeMessage";
import Page from "../Page";
import Card from "../Card";

const sanitizeEmail = (input) => {
  // Remove leading/trailing whitespace and any potentially unsafe characters for email
  return input.trim().replace(/[^a-zA-Z0-9@._-]/g, "");
};

const LoginStep = () => {
  const { goToNextStep } = useSignup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

  console.log(URL);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handlePasswordVisibilityToggle = () => {
    if (passwordVisibility) {
      setPasswordVisibility(false);
    } else {
      setPasswordVisibility(true);
    }
  }

  const handleCredentialsSubmit = async () => {
    const sanitizedEmail = sanitizeEmail(email);

    if (sanitizedEmail === "") {
      setError("Email is required");
      return;
    }
    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sanitizedEmail, password }),
      });
      const data = await response.json();

      if (isMounted.current) {
        if (data.ok) {
          login(data.token);
          navigate("/");
        } else {
          setError(data.message);
          console.log(data.message);
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
    <Page title="Log in">
      <Card
        title={
          <>
            Enter your email and password
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
            handleCredentialsSubmit();
          }}
        >
          <div className="text-left">
            <label className="font-bold" htmlFor="email">
              Email
            </label>
            <input
              className={`px-4 py-3 text-nougat-500 text-lg min-w-full rounded-xl border-nougat-500 focus:border-nougat-500 focus:outline-none focus:ring-2 focus:ring-cream-500 placeholder:text-cream-500 ${
                error ? "border-rose-600 focus:border-rose-600 focus:ring-rose-500" : ""
              }`}
              id="email"
              name="email"
              placeholder="you@email.com"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(sanitizeEmail(e.target.value));
                if (error && e.target.value.trim() !== "") {
                  setError(null);
                }
              }}
              aria-required="true"
              aria-describedby="email-desc"
            />
            <div id="email-desc" className="sr-only">
              Enter the primary email address for your account.
            </div>
          </div>
          <div className="text-left">
            <label className="font-bold" htmlFor="password">
              Password
            </label>
            <div className="flex">
            <input
              className={`px-4 py-3 text-nougat-500 text-lg min-w-full rounded-xl border-nougat-500 focus:border-nougat-500 focus:outline-none focus:ring-2 focus:ring-cream-500 placeholder:text-cream-500 ${
                error ? "border-rose-600 focus:border-rose-600 focus:ring-rose-500" : ""
              }`}
              id="password"
              name="password"
              placeholder="Enter your password"
              type={passwordVisibility ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error && e.target.value.trim() !== "") {
                  setError(null);
                }
              }}
              aria-required="true"
              aria-describedby="password-desc"
            />
            <span className="flex justify-end items-center cursor-pointer" onClick={handlePasswordVisibilityToggle}>
              {passwordVisibility ? <i className="fi fi-sr-eye-crossed flex absolute p-3 pr-5"></i> : <i className="fi fi-sr-eye flex absolute p-3 pr-5"></i>}
            </span>
            </div>
            <div id="password-desc" className="sr-only">
              Your password must be at least 8 characters long.
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !email || !password}
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? "Submitting..." : "Continue"}
          </button>
            <FadeMessage message={error} duration={300} />
        </form>
      </Card>
    </Page>
  );
};

export default LoginStep;
