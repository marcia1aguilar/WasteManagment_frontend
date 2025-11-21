import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Feedback from './pages/Feedback.jsx';
import MonthlySchedule from './pages/MonthlySchedule.jsx';
import Profile from './pages/Profile.jsx';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/monthly-schedule" element={<MonthlySchedule />} />
      </Routes>
    </Router>
  );
}

export default App
