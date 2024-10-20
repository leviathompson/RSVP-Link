import React, { createContext, useState, useContext } from 'react';

const defaultContextValue = {
    currentStep: 0,
    LoginData: {},
    goToNextStep: (newData) => {},
    goToPreviousStep: (newData) => {},
};

const LoginContext = createContext(defaultContextValue);

export const LoginProvider = ({ children }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [LoginData, setLoginData] = useState({}); // Shared state for data between steps

    const goToNextStep = (newData) => {
        setLoginData((prev) => ({ ...prev, ...newData }));
        setCurrentStep((prev) => prev + 1);
    };

    const goToPreviousStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <LoginContext.Provider value={{ currentStep, LoginData, goToNextStep, goToPreviousStep }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => useContext(LoginContext);
