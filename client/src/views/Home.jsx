import React from 'react';
import { useAuth } from '../context/AuthProvider';
import Page from "../components/Page";
import Card from "../components/Card";

const Home = () => {
	const { logout } = useAuth();
	const handleLogout = () => {
	  logout();
	};

	return (
		<Page title="Home">
			<Card title="Temp Home">
			<button className="btn-primary" onClick={handleLogout}>Logout</button>
			</Card>
		</Page>
	)
}

export default Home