import React from 'react';
import { useSignup } from '../context/SignupProvider';
import SignupStep from '../components/signup/SignupStep';
import SendOTPStep from '../components/signup/SendOTPStep';
import VerifyOTPStep from '../components/signup/VerifyOTPStep';

const steps = [SignupStep, SendOTPStep, VerifyOTPStep];

const Signup = () => {
    const { currentStep } = useSignup();
    const CurrentStepComponent = steps[currentStep];
    
    return <CurrentStepComponent />;
};

export default Signup;
