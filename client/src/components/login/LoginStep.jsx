import React, { useState, useEffect, useRef } from 'react';
import { useLogin } from '../../context/LoginProvider';

const LoginStep = () => {
    const { goToNextStep } = useLogin();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true);
    const URL = "http://localhost:4444";

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleNameSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/users/?name=${encodeURIComponent(name)}`, {
                method: 'GET',
            });
            const data = await response.json();

            if (isMounted.current) {
                goToNextStep({ user: data.user });
            }
        } catch (error) {
            console.error('Login failed', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex gap-5 flex-col">
            <h1>Party Access</h1>
            <div className="flex gap-4 flex-col pt-6 pb-5 px-6 bg-cream-200 rounded-3xl shadow-md">
                <h2>log in to rsvp</h2>
                <div className="max-w-prose">
                    Please provide your first and last name to get your one-time access code.
                </div>
                <div>
                    <label className="font-bold" htmlFor="name">First and last name</label>
                    <input className="min-w-full rounded-xl border-nougat-500 focus:border-nougat-500 focus:outline-none focus:ring-4 focus:ring-cream-500" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <button className="btn-primary" onClick={handleNameSubmit} disabled={loading}>Continue</button>
            </div>
        </div>
    );
};

export default LoginStep;
