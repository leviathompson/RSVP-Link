import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./views/Home";
import Test from "./views/Test";
import Profile from "./views/Profile";
import { AuthProvider } from "./context/AuthProvider";
import { SignupProvider } from "./context/SignupProvider";
import { LoginProvider } from "./context/LoginProvider";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./views/Signup";
import Login from "./views/Login";
import Welcome from "./views/Welcome";
import FAQ from "./views/FAQ";
import Activities from "./views/Activities";
import Registry from "./views/Registry";
import React from "react";
import Navbar from './components/NavBar';

function App() {

  return (
      <AuthProvider>
        <Router>
        <Navbar/>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/signup" element={<SignupProvider><Signup /></SignupProvider>} />
            <Route path="/login" element={<LoginProvider><Login /></LoginProvider>} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/registry" element={<Registry />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/test" element={<Test />} />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
            
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
