import React from 'react';
import { useLogin } from '../context/LoginProvider';
import LoginStep from '../components/login/LoginStep'

const steps = [LoginStep];

const Login = () => {
    const { currentStep } = useLogin();
    const CurrentStepComponent = steps[currentStep];
    
    return <CurrentStepComponent />;
};

export default Login;
