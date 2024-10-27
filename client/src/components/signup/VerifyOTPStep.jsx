import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../context/SignupProvider";
import { useAuth } from "../../context/AuthProvider";
import FadeMessage from "../FadeMessage";
import Page from "../Page";
import Card from "../Card";

const VerifyOTPStep = () => {
  const { goToPreviousStep, SignupData: LoginData } = useSignup();
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const navigate = useNavigate();
  const URL = "http://192.168.86.58:4444";
  const { login } = useAuth();
  const inputRefs = useRef([]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, [LoginData]);

  const handleVerification = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter the full verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/users/verify/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: LoginData.user?._id,
          verificationCode: code,
          contactMethodId: LoginData.contactMethodId,
          contactMethodType: LoginData.contactMethodType,
        }),
      });

      const data = await response.json();

      if (isMounted.current) {
        if (data.ok) {
          login(data.token);
          navigate("/profile");
        } else {
          setError(data.message);
          console.log(data.message);
        }
      }
    } catch (error) {
      console.error("Verification failed", error);
      if (isMounted.current) {
        setError("An error occurred. Please try again.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleChange = (index, value) => {
    if (/[^0-9]/.test(value)) return; // Only allow numeric input

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Move to the next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(paste)) {
      setVerificationCode(paste.split(""));
      inputRefs.current[5].focus();
    }
  };

  return (
    <Page title="Create Account">
      <Card
        title={
          <>
            Enter your <span className="gold">verification code</span>
          </>
        }
        back={() => goToPreviousStep()}
        loading={loading}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerification();
          }}
          aria-label="Enter your verification code"
          className="flex gap-8 flex-col"
        >
          <div>
            <div className="max-w-prose">
              A verification code has been sent to:
            </div>

            <div className="bg-white p-4 rounded-3xl">
              {LoginData.contactMethodObfuscated}
            </div>
          </div>
          <div>
            <label className="font-bold" htmlFor="Verification code digit 1">
              Code:
            </label>
            <div className="flex gap-2 justify-center">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  name={`Verification code digit ${index + 1}`}
                  type="text"
                  autoComplete="off"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`w-12 h-12 text-center text-2xl border border-nougat-500 focus:border-nougat-500 rounded-md focus:outline-none focus:ring-2 focus:ring-cream-500 ${
                    error
                      ? "border-rose-600 focus:border-rose-600 focus:ring-rose-500"
                      : ""
                  }`}
                  aria-label={`Verification code digit ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || verificationCode.some((digit) => digit === "")}
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <FadeMessage message={error} duration={300} />
      </Card>
    </Page>
  );
};

export default VerifyOTPStep;
