import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./views/Home";
import Test from "./views/Test";
import Profile from "./views/Profile";
import { AuthProvider } from "./context/AuthProvider";
import { LoginProvider } from "./context/LoginProvider";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./views/Login";
import React from "react";

function App() {

  return (
    <div className="flex justify-center min-h-screen overflow-hidden bg-cream-300 py-6 px-4">
      <div className="flex flex-col">
      <AuthProvider>
        <Router>
          <Routes>
            
            <Route path="/login" element={<LoginProvider><Login /></LoginProvider>} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/test" element={<Test />} />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
            
          </Routes>
        </Router>
      </AuthProvider>
      </div>
    </div>
  );
}

export default App;
