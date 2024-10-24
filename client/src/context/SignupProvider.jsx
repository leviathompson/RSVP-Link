import React, { createContext, useState, useContext } from 'react';

const defaultContextValue = {
    currentStep: 0,
    SignupData: {},
    goToNextStep: (newData) => {},
    goToPreviousStep: (newData) => {},
};

const SignupContext = createContext(defaultContextValue);

export const SignupProvider = ({ children }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [SignupData, setSignupData] = useState({}); // Shared state for data between steps

    const goToNextStep = (newData) => {
        setSignupData((prev) => ({ ...prev, ...newData }));
        setCurrentStep((prev) => prev + 1);
    };

    const goToPreviousStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <SignupContext.Provider value={{ currentStep, SignupData, goToNextStep, goToPreviousStep }}>
            {children}
        </SignupContext.Provider>
    );
};

export const useSignup = () => useContext(SignupContext);
