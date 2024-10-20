import React from 'react'
import { useAuth } from '../context/AuthProvider';

const Home = () => {
	const { logout } = useAuth();
	const handleLogout = () => {
	  logout();
	};

	return (
		<div>
			<p>You are home now 🏡🛏🚽🛋📚🪴</p>
			<a href="/test">test page</a>
			<button onClick={handleLogout}>Logout</button>
		</div>
	)
}

export default Home