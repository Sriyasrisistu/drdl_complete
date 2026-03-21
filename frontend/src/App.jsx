import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SafetyFireRequestForm from './components/SafetyFireRequestForm';
import EditRequestPage from './components/EditRequestPage';
import SupervisorPortal from './components/SupervisorPortal';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SafetyFireRequestForm />} />
          <Route path="/edit/:requestId" element={<EditRequestPage />} />
          <Route path="/sfeed" element={<SupervisorPortal roleCode="SFEED" />} />
          <Route path="/gdts" element={<SupervisorPortal roleCode="GDTS" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
