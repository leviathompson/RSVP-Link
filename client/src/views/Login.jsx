import React from 'react';
import { useLogin } from '../context/LoginProvider';
import LoginStep from '../components/login/LoginStep';
import SendOTPStep from '../components/login/SendOTPStep';
import VerifyOTPStep from '../components/login/VerifyOTPStep';

const steps = [LoginStep, SendOTPStep, VerifyOTPStep];

const Login = () => {
    const { currentStep } = useLogin();
    const CurrentStepComponent = steps[currentStep];
    
    return <CurrentStepComponent />;
};

export default Login;
