import React, { useEffect, useState } from 'react';
import { IconButton, Button, Modal, Grid } from '@mui/material';
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
  const [gameCount, setGameCount] = useState(0);

  const pairs = ['star', 'star', 'moon', 'moon', 'sun', 'sun', 'comet', 'comet'];

  
  const flipCard = (index) => {

    if (flippedCards.length === 1) {
      const card1 = flippedCards[0];
      const card2 = index;
  
        if (cards[card1].pair === cards[card2].pair) {
          // Match found
          setMatchedCards([...matchedCards, card1, card2]);
          playSound(correctSound);
          setShowModal(true);
          setModalMessage("Nice! It's a match.");
          setFlippedCards([]);
  
          setTimeout(() => {
            setShowModal(false);
          }, 800);
        } 
      
        else {
        setFlippedCards([...flippedCards, card2]);
      
        setTimeout(() => {
          setFlippedCards([]);
          setShowModal(true);
          setModalMessage('Sorry, but this is not a match.');
          playSound(incorrectSound);
  
          setTimeout(() => {
            setShowModal(false);
          }, 700);
        }, 700);
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
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(interval); // Stop the interval when timer reaches zero
          setGameOver(true);
         
          if(pairs.length < 8 ){
            setShowModal(true);
            setModalMessage("Oops! You didn't find them all.");
          }

// console.log('tiempo-'+timer);
// console.log('gameOver-'+gameOver);
// console.log('Larog de cartas encontradas-'+matchedCards.length);
// console.log('Cartas encontradas-'+matchedCards);
// console.log('largo de pares-'+pairs.length);
// console.log('pares-'+pairs);

          return 0; // Set the timer to zero
        } else if (prevTimer > 0){
          return prevTimer - 1;
        }else{
          clearInterval(interval); //Stop the interval if timer goes to zero
          return 0; //Set timer to zero
        }
      });
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
    setGameCount(gameCount + 1); // Increment game count
    //stopTickingSound(); // Clear the ticking sound
    // Regenerate the card data
  const shuffledPairs = pairs.sort(() => 0.5 - Math.random());
  const cardData = shuffledPairs.map((pair) => ({ pair, flipped: false }));
  setCards(cardData);
  startTimer();

  };

//ShuffledPairs
  useEffect(() => {
    const shuffledPairs = pairs.sort(() => 0.5 - Math.random());
    const cardData = shuffledPairs.map((pair) => ({ pair, flipped: false }));
    setCards(cardData);
  }, []);
//flippedCards
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
      }, 1200);
    }

  }, [flippedCards, matchedCards]);

  useEffect(() => {
    if (timer === 10 && !gameOver) {
      playTickingSound();
    }

  }, [timer, gameOver]);

  //startTimer
  useEffect(() => {
    const interval = startTimer();

    return () => {
      clearInterval(interval);
      stopTickingSound();
    };
  }, []);
   //mute
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
//timer
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
      <Modal open={showModal} onClose={handleModalClose} >
        <div className="modal-content" >
        <h2
      className={
        modalMessage.includes("Nice! It's a match")
          ? 'green-text'
          : modalMessage.includes("Sorry, but this is not a match")
          ? 'red-text'
          : ''
      }
    >
      {modalMessage}
    </h2>
          {gameOver && (timer <= 0  || modalMessage === "You did it!") && 
          ( 
            <Button 
              className="play-again-button"
              variant="contained" 
              onClick={handleModalClose}>Play Again</Button>
            ) 
            
          }
        </div>
      </Modal>

      <Grid container spacing={1}  className="game-grid">
        {cards.map((card, index) => (
          <Grid item xs={3} key={`${gameCount}-${index}`}> 
            <div
              className={`card ${flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''}`}
            >
              <div className="card-front" onClick={() => handleCardClick(index)}>
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
