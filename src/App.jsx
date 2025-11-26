import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Feedback from './pages/Feedback.jsx';
//import LoginPage from './pages/LoginPage.jsx';
import Login from './pages/Login.jsx';
import MonthlySchedule from './pages/MonthlySchedule.jsx';
import Profile from './pages/Profile.jsx';

function App() {


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/:operatorId" element={<Dashboard />} />
        <Route path="/profile/:operatorId" element={<Profile />} />
        <Route path="/feedback/:operatorId" element={<Feedback />} />
        <Route path="/schedule/:operatorId" element={<MonthlySchedule />} />
      </Routes>
    </Router>
  );
}

export default App
