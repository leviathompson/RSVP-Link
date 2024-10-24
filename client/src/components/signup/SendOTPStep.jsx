import React, { useState, useEffect, useRef } from "react";
import { useSignup } from "../../context/SignupProvider";
import FadeMessage from "../FadeMessage";
import Page from "../Page";
import Card from "../Card";

const SendOTPStep = () => {
  const { goToNextStep, goToPreviousStep, SignupData: LoginData } = useSignup();
  const [selectedContact, setSelectedContact] = useState({
    id: "",
    contact: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const URL = "http://192.168.86.52:4444";

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, [LoginData]);

  const handleSendOTP = async () => {
    if (!selectedContact.id) {
      setError("Please select a contact method.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${URL}/users/otp/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: LoginData.user?._id,
          contactMethodId: selectedContact.id,
          contactMethodType: selectedContact.type,
        }),
      });
      const data = await response.json();

      if (isMounted.current) {
        if (data.ok) {
          goToNextStep({
            user: LoginData.user,
            contactMethodId: data.contactMethodId,
            contactMethodType: data.contactMethodType,
            contactMethodObfuscated: selectedContact.contact,
          });
        } else {
          setError(data.message);
        }
      }
    } catch (error) {
      console.error("Verification failed", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleChange = (event, type) => {
    const { id, contact } = event.target.dataset;
    setSelectedContact({ id, contact, type });
  };

  return (
    <Page title="Create Account">
      <Card
        title={
          <>
            Choose a <span className="gold">verification method</span>
          </>
        }
        back={() => goToPreviousStep()}
        loading={loading}
      >
        <form
          className="flex gap-8 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendOTP();
          }}
          aria-labelledby="Choose a verification method"
        >
          <div className="flex flex-col gap-4">
            {LoginData.user?.contactMethods.emails.length !== 0 ||
            LoginData.user?.contactMethods.phones.length !== 0 ? (
              <div className="max-w-prose">
                We'll send a login code directly to your device.
              </div>
            ) : (
              <div>
                It looks like we don't have your contact information on file.
                The head of your party will need to add a phone number or email
                address to your profile before you can log in.
              </div>
            )}
          </div>
          <fieldset>
            <legend className="sr-only">Contact Methods</legend>
            <div
              role="group"
              aria-label="Verification methods"
              className="flex gap-4 flex-col"
            >
              {LoginData.user?.contactMethods.emails.map((email) => (
                <label
                  key={email.id}
                  htmlFor={`contact-${email.id}`}
                  className={`flex items-center gap-2 text-lg px-7 py-4 font-medium text-cream-700 focus:outline-none bg-cream-100 rounded-full border hover:bg-white hover:text-cream-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors duration-200 ${
                    selectedContact.id === email.id
                      ? "border-3 border-cream-700 bg-white"
                      : "border-cream-700 m-0.2"
                  }`}
                >
                  <input
                    id={`contact-${email.id}`}
                    type="radio"
                    name="contactMethod"
                    data-id={email.id}
                    data-contact={email.address}
                    onChange={(e) => handleChange(e, "email")}
                    checked={selectedContact.id === email.id}
                    aria-describedby={`email-${email.id}-desc`}
                    className="text-cream-700 focus:outline-none focus:ring-2 focus:ring-cream-500"
                  />
                  <span className="w-full flex flex-row gap-3 justify-center">
                    <span className="mt-1 text-xl">Email {email.address}</span>
                    <i className="fi fi-br-envelope text-md mt-2 gold"></i>
                  </span>
                  <span id={`email-${email.id}-desc`} className="sr-only">
                    Email Address
                  </span>
                </label>
              ))}

              {LoginData.user?.contactMethods.phones.map((phone) => (
                <label
                  key={phone.id}
                  htmlFor={`contact-${phone.id}`}
                  className={`flex items-center gap-2 text-lg px-7 py-4 font-medium text-cream-700 focus:outline-none bg-cream-100 rounded-full border hover:bg-white hover:text-cream-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors duration-200 ${
                    selectedContact.id === phone.id
                      ? "border-3 border-cream-700 bg-white"
                      : "border-cream-700 m-0.2"
                  }`}
                >
                  <input
                    id={`contact-${phone.id}`}
                    type="radio"
                    name="contactMethod"
                    data-id={phone.id}
                    data-contact={phone.number}
                    onChange={(e) => handleChange(e, "sms")}
                    checked={selectedContact.id === phone.id}
                    aria-describedby={`phone-${phone.id}-desc`}
                    className="text-cream-700 focus:outline-none focus:ring-2 focus:ring-cream-500"
                  />
                  <span className="w-full flex flex-row gap-3 justify-center">
                    <span className="mt-1 text-xl">SMS {phone.number}</span>
                    <i className="fi fi-br-mobile-notch text-md mt-2 gold"></i>
                  </span>
                  <span id={`phone-${phone.id}-desc`} className="sr-only">
                    Phone Number
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !selectedContact.id}
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? "Sending..." : "Continue"}
          </button>
        </form>
        <FadeMessage message={error} duration={300} />
      </Card>
    </Page>
  );
};

export default SendOTPStep;
