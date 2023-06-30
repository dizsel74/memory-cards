import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FirstScreen from './components/FirstScreen';
import SecondScreen from  './components/SecondScreen';
import { Typography } from '@mui/material';

function App() {
  return (
    <div >
    <FirstScreen />
    
  </div>
  );
};

export default App
