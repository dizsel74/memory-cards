import React, { useEffect, useState } from 'react';
import { Button, Slide } from '@mui/material';
import Logo from '../assets/logo.svg';
import SecondScreen from './SecondScreen';

import '../styles/FirstScreen.css';

const FirstScreen = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [navigateToSecondScreen, setNavigateToSecondScreen] = useState(false); 

  const handleButtonClick = () => {
    console.log('Navigating to the second screen...');
    setNavigateToSecondScreen(true); // Set the state to trigger navigation
  };

  useEffect(() => {
    setTimeout(() => {
      setShowLogo(true);
    }, 500);

    setTimeout(() => {
      setShowButton(true);
    }, 800);
  }, []);

  const handleButtonMouseEnter = () => {
    setButtonVisible(true);
  };

  const handleButtonMouseLeave = () => {
    setButtonVisible(false);
  };

  if (navigateToSecondScreen) {
    return <SecondScreen />; 
  }


  return (
    <div className="first-screen">
      {showLogo && (
        <Slide direction="down" in={showLogo} mountOnEnter unmountOnExit>
          <img src={Logo} alt="logo app" className="logo-style" />
        </Slide>
      )}

      {showButton && (
        <Slide direction="up" in={showButton} mountOnEnter unmountOnExit>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 4 }}
            className={`start-button ${buttonVisible ? 'bounce-button' : ''}`}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            onClick={handleButtonClick}
          >
            Start
          </Button>
        </Slide>
      )}
    </div>
  );
};

export default FirstScreen;
