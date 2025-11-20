import { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard.jsx';
import Header from './components/Header.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <Header />
      <Dashboard />
    </div>
  )
}

export default App
