import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IncidentList from './components/IncidentList';
import CreateIncident from './components/CreateIncident';
import IncidentDetail from './components/IncidentDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/create" element={<CreateIncident />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;