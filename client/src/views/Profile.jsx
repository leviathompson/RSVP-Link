import React, { useState, useEffect } from "react";
import axios from "axios";
import Page from "../components/Page";
import Card from "../components/Card";
import { useAuth } from "../context/AuthProvider";
import FadeMessage from "../components/FadeMessage";

const Profile = () => {
  const { partyData } = useAuth();
  const statuses = ["Awaiting response", "Attending", "Not attending"];
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const URL = "http://192.168.86.52:4444";

  useEffect(() => {
    if (partyData) {
      // Initialize the members state based on partyData
      setMembers(partyData.users.map(user => ({
        ...user,
        contactMethods: {
          emails: [...user.contactMethods.emails],
          phones: [...user.contactMethods.phones]
        }
      })));
    }
  }, [partyData]);

  const handleSave = async (member) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in again.");
        return;
      }

      setLoading(true);
      setError(null);

      const updatedMember = {
        id: member._id,
        status: member.status,
        emails: member.contactMethods.emails,
        phones: member.contactMethods.phones,
      };

      const response = await axios.patch(`${URL}/protected/users`, updatedMember, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.ok) {
        setError(null); // Clear any previous errors
      } else {
        setError(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleEmailChange = (memberIndex, emailIndex, value) => {
    const updatedMembers = [...members];
    updatedMembers[memberIndex].contactMethods.emails[emailIndex].address = value;
    setMembers(updatedMembers);
  };

  const handlePhoneChange = (memberIndex, phoneIndex, value) => {
    const updatedMembers = [...members];
    updatedMembers[memberIndex].contactMethods.phones[phoneIndex].number = value;
    setMembers(updatedMembers);
  };

  const handleRemoveEmail = (memberIndex, emailIndex) => {
    const updatedMembers = [...members];
    updatedMembers[memberIndex].contactMethods.emails.splice(emailIndex, 1);
    setMembers(updatedMembers);
  };

  const handleRemovePhone = (memberIndex, phoneIndex) => {
    const updatedMembers = [...members];
    updatedMembers[memberIndex].contactMethods.phones.splice(phoneIndex, 1);
    setMembers(updatedMembers);
  };

  const handleAddEmail = (memberIndex) => {
    const updatedMembers = [...members];
    updatedMembers[memberIndex].contactMethods.emails.push({ address: "" });
    setMembers(updatedMembers);
  };

  const handleAddPhone = (memberIndex) => {
    const updatedMembers = [...members];
    updatedMembers[memberIndex].contactMethods.phones.push({ number: "" });
    setMembers(updatedMembers);
  };

  return (
    <Page title="Profile">
      <Card title={partyData ? partyData.name : "No party"}>
        <div className="flex flex-col gap-4">
          {members.length ? (
            members.map((member, index) => (
              <div
                key={index}
                className="bg-cream-100 px-4 pt-6 rounded-3xl border border-cream-400"
              >
                <form
                  role="form"
                  aria-label={`Update details for ${member.name}`}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave(member);
                  }}
                >
                  <div className="text-left">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-row gap-2 text-nougat-700 text-xl">
                        <i className="fi fi-br-portrait pt-0.5"></i>{" "}
                        <div>{member.name}</div>
                      </div>
                      <div>
                        <label htmlFor={`rsvp-status-${index}`}>RSVP Status:</label>
                        <select
                          id={`rsvp-status-${index}`}
                          name="rsvpStatus"
                          className="content-center bg-white px-3 pt-2 pb-1.5 text-nougat-500 text-lg w-full rounded-xl border-nougat-500 focus:border-nougat-500 focus:outline-none focus:ring-2 focus:ring-cream-500 placeholder:text-cream-500"
                          value={member.status}
                          onChange={(e) => handleInputChange(index, "status", e.target.value)}
                          aria-required="true"
                        >
                          {statuses.map((status, idx) => (
                            <option key={idx} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="flex flex-col gap-2">
                          {member.contactMethods.emails && (
                            <div className="flex flex-col gap-2">
                              <label>Email:</label>
                              {member.contactMethods.emails.map((email, emailIndex) => (
                                <div className="flex flex-row gap-2" key={emailIndex}>
                                  <input
                                    id={`email-${index}-${emailIndex}`}
                                    className="px-3 pt-2 pb-1.5 text-nougat-500 text-lg w-full rounded-xl border-nougat-500 focus:border-nougat-500 focus:outline-none focus:ring-2 focus:ring-cream-500 placeholder:text-cream-500"
                                    value={email.address}
                                    onChange={(e) => handleEmailChange(index, emailIndex, e.target.value)}
                                    aria-label={`Email address for ${member.name}`}
                                  />
                                  <i
                                    className="fi fi-rr-cross-circle content-center pt-2.5 text-nougat-500 cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Remove email ${email.address}`}
                                    onClick={() => handleRemoveEmail(index, emailIndex)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        handleRemoveEmail(index, emailIndex);
                                      }
                                    }}
                                  ></i>
                                </div>
                              ))}
                            </div>
                          )}
                          <button
                            className="btn-tertiary-sm"
                            type="button"
                            onClick={() => handleAddEmail(index)}
                          >
                            <i className="fi fi-rs-add text-xs"></i> Add email
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col gap-2">
                          {member.contactMethods.phones && (
                            <div className="flex flex-col gap-2">
                              <label>Phone:</label>
                              <div className="flex flex-col gap-1">
                                {member.contactMethods.phones.map((phone, phoneIndex) => (
                                  <div className="flex flex-row gap-2" key={phoneIndex}>
                                    <input
                                      id={`phone-${index}-${phoneIndex}`}
                                      className="px-3 pt-2 pb-1.5 text-nougat-500 text-lg w-full rounded-xl border-nougat-500 focus:border-nougat-500 focus:outline-none focus:ring-2 focus:ring-cream-500 placeholder:text-cream-500"
                                      value={phone.number}
                                      onChange={(e) => handlePhoneChange(index, phoneIndex, e.target.value)}
                                      aria-label={`Phone number for ${member.name}`}
                                    />
                                    <i
                                      className="fi fi-rr-cross-circle content-center pt-2.5 text-nougat-500 cursor-pointer"
                                      role="button"
                                      tabIndex={0}
                                      aria-label={`Remove phone ${phone.number}`}
                                      onClick={() => handleRemovePhone(index, phoneIndex)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          handleRemovePhone(index, phoneIndex);
                                        }
                                      }}
                                    ></i>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <button
                            className="btn-tertiary-sm"
                            type="button"
                            onClick={() => handleAddPhone(index)}
                          >
                            <i className="fi fi-rs-add text-xs"></i> Add phone
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn-secondary"
                        disabled={loading}
                        aria-busy={loading}
                        aria-live="polite"
                      >
                        {loading ? "Submitting..." : "Save"}
                      </button>
                      <FadeMessage message={error} duration={300} />
                    </div>
                  </div>
                </form>
              </div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </Card>
    </Page>
  );
};

export default Profile;
