import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useLogin } from '../../context/LoginProvider';
import { useAuth } from '../../context/AuthProvider';

const VerifyOTPStep = () => {
    const { goToPreviousStep, LoginData } = useLogin();
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);
    const navigate = useNavigate(); // Initialize useNavigate
    const URL = "http://localhost:4444";
    const { login } = useAuth();

    useEffect(() => {
        console.log("LoginData VerifyOTPStep:");
        console.dir(LoginData);
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, [LoginData]);

    const handleVerification = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${URL}/users/verify/code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: LoginData.user?._id,
                    verificationCode: verificationCode,
                    contactMethodId: LoginData.contactMethodId,
                    contactMethodType: LoginData.contactMethodType
                }),
            });
    
            const data = await response.json();
    
            if (isMounted.current) {
                if (data.ok) {
                    login(data.token);
                    navigate('/');
                } else {
                    setError(data.message);
                }
            }
        } catch (error) {
            console.error('Verification failed', error);
            if (isMounted.current) {
                setError('An error occurred. Please try again.');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };
    

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
            />
            <button onClick={handleVerification} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button onClick={goToPreviousStep} disabled={loading}>
                Back
            </button>
        </div>
    );
};

export default VerifyOTPStep;
