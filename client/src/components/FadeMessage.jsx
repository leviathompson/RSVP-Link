import React, { useState, useEffect } from 'react';

const FadeMessage = ({ message, duration = 300 }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);

    useEffect(() => {
        if (message) {
            setDisplayMessage(true);
            setTimeout(() => setShowMessage(true), 10); // Small delay to trigger CSS transition
        } else {
            setShowMessage(false);
            setTimeout(() => setDisplayMessage(false), duration); // Delay removal until after transition
        }
    }, [message, duration]);

    return (
        <div
            className={`transition-all duration-${duration} overflow-hidden ${
                showMessage ? 'opacity-100 py-3' : 'max-h-0 opacity-0'
            }`}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {displayMessage && (
                <div className="text-rose-600 px-4 py-3 rounded-2xl border-2 border-rose-600 bg-opacity-10 bg-rose-600">
                    {message}
                </div>
            )}
        </div>
    );
};

export default FadeMessage;
