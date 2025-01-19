import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "./Components/Header.js";
import Home from "./Pages/Home.js";
import SkillRequestForm from "./Components/SkillRequestForm.js";
import AddResume from './Pages/AddResume.js';
import Profile from './Pages/Profile.js';
import MyDashboard from './Pages/MyDashboard.js'; // Import the MyDashboard component

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request-skill" element={<SkillRequestForm />} />
          <Route path="/uploadResume" element={<AddResume />} />
          <Route path="/profile" element={<Profile />} /> {/* Profile route */}
          <Route path="/dashboard" element={<MyDashboard />} /> {/* MyDashboard route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
