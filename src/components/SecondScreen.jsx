import React, { useEffect, useState } from 'react';
import { IconButton, Button, Slide, Modal, Grid } from '@mui/material';
import { VolumeOff, VolumeUp } from '@mui/icons-material';
import star from '../assets/star.svg';
import moon from '../assets/moon.svg';
import sun from '../assets/sun.svg';
import comet from '../assets/comet.svg';
import correctSound from '../assets/correct.mp3';
import incorrectSound from '../assets/incorrect.mp3';
import tickingSound from '../assets/ticking.mp3';
import sound from '../assets/background.mp3';
import '../styles/SecondScreen.css';

const SecondScreen = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [backgroundAudio, setBackgroundAudio] = useState(null);
  const tickingAudio = new Audio(tickingSound);

  const pairs = ['star', 'star', 'moon', 'moon', 'sun', 'sun', 'comet', 'comet'];

  const flipCard = (index) => {
    if (flippedCards.length === 1) {
      const card1 = flippedCards[0];
      const card2 = index;
  
      if (pairs[card1] === pairs[card2]) {
        setMatchedCards([...matchedCards, card1, card2]);
        playSound(correctSound);
      } else {
        setFlippedCards([...flippedCards, card2]);
        playSound(incorrectSound);
  
        setTimeout(() => {
          setFlippedCards([]);
          setShowModal(true);
          setModalMessage('Sorry, but this is not a match');
           setTimeout(() => {
            setShowModal(false);
          }, 700); // Adjust the delay here (in milliseconds)
        }, 700); // Adjust the delay here (in milliseconds)
      }
    } else {
      setFlippedCards([index]);
    }
  };
  


  const handleCardClick = (index) => {
    if (flippedCards.includes(index) || matchedCards.includes(index) || gameOver) {
      return;
    }

    flipCard(index);
  };

  const handleModalClose = () => {
    if (gameOver) {
      resetGame();
    }

    setShowModal(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      if (backgroundAudio) {
        backgroundAudio.pause();
      }
    } else {
      if (backgroundAudio) {
        backgroundAudio.play();
      }
    }
  };

  const playSound = (sound) => {
    if (!isMuted) {
      const audio = new Audio(sound);
      audio.play();
    }
  };

  const playTickingSound = () => {
    if (!isMuted) {
      tickingAudio.play();
    }else{
      tickingAudio.play();
    }
  };

  const stopTickingSound = () => {
    tickingAudio.pause();
    tickingAudio.currentTime = 0;
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return interval;
  };

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setShowModal(false);
    setModalMessage('');
    setIsMuted(true);
    setTimer(30);
    setGameOver(false);
  };

  useEffect(() => {
    const shuffledPairs = pairs.sort(() => 0.5 - Math.random());
    const cardData = shuffledPairs.map((pair) => ({ pair, flipped: false }));

    setCards(cardData);

    setTimeout(() => {
      // setShowModal(true);
      // setModalMessage('Game starts now!');
    }, 1000);
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const interval = setTimeout(() => {
        flipCard(-1);
      }, 800);

      return () => clearTimeout(interval);
    }

    if (matchedCards.length === pairs.length) {
      setGameOver(true);

      setTimeout(() => {
        setShowModal(true);
        setModalMessage('You did it!');
      }, 800);
    }

  }, [flippedCards, matchedCards]);

  useEffect(() => {
    if (timer === 10 && !gameOver) {
      playTickingSound();
    }

    if (timer === 0 && !gameOver) {
      setGameOver(true);
      setTimeout(() => {
        setShowModal(true);
        setModalMessage("Oops! You didn't find them all.");
        // if (backgroundAudio){
        //   backgroundAudio.pause();
        // }
      }, 1000);
    }
  }, [timer, gameOver]);

  useEffect(() => {
    const interval = startTimer();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMuted) {
      if (!backgroundAudio) {
        const audio = new Audio(sound);
        setBackgroundAudio(audio);
        audio.loop = true;
        audio.play();
      } else {
        backgroundAudio.play();
      }
    } else if (backgroundAudio) {
      backgroundAudio.pause();
    }
  }, [isMuted, backgroundAudio]);

  useEffect(() => {
    if (isMuted) {
      stopTickingSound();
    } else {
      if (timer <= 10 && !gameOver) {
        playTickingSound();
      } else {
        stopTickingSound();
      }
    }
  }, [timer, gameOver, isMuted]);

  return (
    <div>
       {/* <Modal open={showModal} onClose={handleModalClose}>
        <div className="modal-content">
          <h2>{modalMessage}</h2>
          {gameOver ? (
            <Button variant="contained" onClick={handleModalClose}>
              Play Again
            </Button>
          ) : (
            <Button variant="contained" disabled>
              Play Again
            </Button>
          )}
        </div>
      </Modal>  */}

<Modal open={showModal} onClose={handleModalClose}>
  <div className="modal-content">
    <h2>{modalMessage}</h2>
    {gameOver && timer === 0 ? 
    ( <Button variant="contained" onClick={handleModalClose}>Play Again</Button>) 
      : 
    ( <Button variant="contained" disabled>apagado</Button>)
    }
  </div>
</Modal>

      <Grid container spacing={2} className="game-grid">
        {cards.map((card, index) => (
          <Grid item xs={3} key={index}>
            <div
              className={`card ${flippedCards.includes(index) ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-front">
                <span className="question-mark">?</span>
              </div>
              <div className="card-back">
                {card.pair === 'star' && <img src={star} alt="star" />}
                {card.pair === 'moon' && <img src={moon} alt="moon" />}
                {card.pair === 'sun' && <img src={sun} alt="sun" />}
                {card.pair === 'comet' && <img src={comet} alt="comet" />}
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
      <div>
        <IconButton
          aria-label="mute or unmute button"
          className="mute-button"
          onClick={handleMuteToggle}
        >
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>

        <div className="timer">{timer}</div>
      </div>
    </div>
  );
};

export default SecondScreen;
