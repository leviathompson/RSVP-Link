import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Enter from './components/Enter.js';
import Home from './views/Home.js';
import UserNameForm from './components/UserNameForm.js';
import SelectCarrierForm from './components/SelectCarrierForm.js';

const URL = 'http://localhost:4444';

function App() {
  let [loggedIn, setLoggedIn] = useState(false);
  let [userName, setUserName] = useState('');
  let [showCarrierSelect, setShowCarrierSelect] = useState(false);
  let [carrierList, setCarrierList] = useState([]);
  let [defaultCarrier, setDefaultCarrier] = useState(null);

  // Dealing with the token
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const get_carriers = async () => {
      try {
        const response = await axios.post(`${URL}/carriers/all`);
        if (response.data.ok) {
          setCarrierList(response.data.carriers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    get_carriers();

    const verify_token = async () => {
      if (token === null) return setLoggedIn(false);
      try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(`${URL}/users/verify`);
        return response.data.ok ? 
          login(token) : logout();
      } catch (error) {
        console.log(error);
      }
    };
    verify_token();
  }, []);

  // ---

  // Sign in, log in, log out
  const login = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    setLoggedIn(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  const signIn = async (name, carrier, magicLink) => {
    try {
      let res = await axios.post(`${URL}/users/enter`, { name, carrier, magicLink });
      if (res.data.token) {
        alert(res.data.message);
        login(res.data.token);
      } else {
        alert(res.data.message);
      }
    } catch (e) {
      alert(e);
    }
  };

  const getCarrierByUserName = async (name) => {
    try {
      let res = await axios.post(`${URL}/users/carrier`, { name });
      if (res.data.carrierId) {
        let carrierId = res.data.carrierId;
        let carrierRes = await axios.post(`${URL}/carriers/id`, { id: carrierId });
        if (carrierRes.data.carrier) {
          setDefaultCarrier(carrierRes.data.carrier);
          setShowCarrierSelect(true);
        } else {
        }
      } else {
        setShowCarrierSelect(false);
        signIn(name);
        setUserName('');
      }
    } catch (e) {
      alert(e);
    }
  };
  
  // ---

  // Event listeners 
  const enterName = (e) => {
    setUserName(e.target.value);
  };

  const nameSubmit = (e) => {
    e.preventDefault();
    getCarrierByUserName(userName);
  };

  const carrierSubmit = (e, selectedCarrier) => {
    e.preventDefault();
    if (selectedCarrier) {
      signIn(userName, selectedCarrier); // Pass the full carrier object instead of just `smsGatewayDomain`
      setUserName('');
      setShowCarrierSelect(false);
    } else {
      alert("Please select a carrier");
    }
  };  

  const selectCarrier = (e) => {
    const selectedCarrier = JSON.parse(e.target.value);
    setDefaultCarrier(selectedCarrier);
  };
  

  // ---

  return (
    <div className="App">
      <p>You are logged {loggedIn ? 'in' : 'out'}</p>
      {!loggedIn ? (
        <UserNameForm 
          enterName={enterName} 
          nameSubmit={nameSubmit} 
          userName={userName} 
        />
      ) : (
        <button onClick={logout}>Logout</button>
      )}
      {!loggedIn && showCarrierSelect &&
      <SelectCarrierForm
        carrierSubmit={carrierSubmit}
        selectCarrier={selectCarrier}
        defaultCarrier={defaultCarrier}
        carrierList={carrierList}
      />
      }
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="enter/:name/:link"
            element={<Enter signIn={signIn} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
