import React, { useState, useEffect, useRef } from 'react';
import { useLogin } from '../../context/LoginProvider';

const SendOTPStep = () => {
    const { goToNextStep, goToPreviousStep, LoginData } = useLogin();
    const [selectedContact, setSelectedContact] = useState({ id: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);
    const URL = "http://localhost:4444";

    useEffect(() => {
        console.log("LoginData SendOTPStep:");
        console.dir(LoginData);
        isMounted.current = true;

        // Auto-select the first available contact method (email or phone)
        const firstEmail = LoginData.user?.contactMethods.emails[0];
        const firstPhone = LoginData.user?.contactMethods.phones[0];

        if (firstEmail) {
            setSelectedContact({ id: firstEmail.id, type: 'email' });
        } else if (firstPhone) {
            setSelectedContact({ id: firstPhone.id, type: 'sms' });
        }

        return () => {
            isMounted.current = false;
        };
    }, [LoginData]);

    const handleSendOTP = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/users/otp/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId: LoginData.user?._id, 
                    contactMethodId: selectedContact.id, 
                    contactMethodType: selectedContact.type 
                }),
            });
            const data = await response.json();

            if (isMounted.current) {
                if (data.ok) {
                    goToNextStep({ user: LoginData.user, contactMethodId: data.contactMethodId, contactMethodType: data.contactMethodType });
                } else {
                    setError(data.message);
                }
            }
        } catch (error) {
            console.error('Verification failed', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    const handleChange = (event, type) => {
        setSelectedContact({ id: event.target.value, type });
    };

    return (
        <div>
            <h3>Select a contact method for verification:</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        
            {LoginData.user?.contactMethods.emails.map((email) => (
                <label key={email.id}>
                    <input
                        type="radio"
                        name="contactMethod"
                        value={email.id}
                        onChange={(e) => handleChange(e, 'email')}
                        checked={selectedContact.id === email.id}
                    />
                    {email.address}
                </label>
            ))}
            
            {LoginData.user?.contactMethods.phones.map((phone) => (
                <label key={phone.id}>
                    <input
                        type="radio"
                        name="contactMethod"
                        value={phone.id}
                        onChange={(e) => handleChange(e, 'sms')}
                        checked={selectedContact.id === phone.id}
                    />
                    {phone.number} ({phone.carrier})
                </label>
            ))}

            <button onClick={handleSendOTP} disabled={loading || !selectedContact.id}>
                {loading ? 'Sending...' : 'Continue'}
            </button>
            <button onClick={goToPreviousStep}>Back</button>
        </div>
    );
};

export default SendOTPStep;
