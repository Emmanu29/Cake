import React, { useEffect, useState, useRef } from 'react';
import { Music, Mic } from 'lucide-react';
export function App() {
  const [isCandieLit, setIsCandleLit] = useState(true);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentCelebrant, setCurrentCelebrant] = useState('');
  const [celebrantIndex, setCelebrantIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const celebrantIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // List of April celebrants
  const celebrants = ['Mama Lilibeth Alfonso'];
  // Function to play the birthday song
  const playBirthdaySong = () => {
    if (audioRef.current && !audioPlayed) {
      audioRef.current.play().catch(error => {
        console.error('Audio playback failed:', error);
      });
      setAudioPlayed(true);
    }
  };
  // Function to request microphone access
  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      setMicPermission(true);
      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyserRef.current = analyser;
      // Start monitoring sound levels
      monitorSoundLevel();
    } catch (error) {
      console.error('Microphone access denied:', error);
      setMicPermission(false);
    }
  };
  // Function to monitor sound levels for blow detection
  const monitorSoundLevel = () => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let blowCounter = 0;
    const blowThreshold = 3;
    const checkSoundLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      // Calculate volume and frequency characteristics
      let sum = 0;
      let lowFreqSum = 0;
      let midFreqSum = 0;
      let highFreqSum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
        if (i < dataArray.length / 4) {
          lowFreqSum += dataArray[i];
        } else if (i < dataArray.length / 2) {
          midFreqSum += dataArray[i];
        } else {
          highFreqSum += dataArray[i];
        }
      }
      const averageVolume = sum / dataArray.length;
      const lowFreqAvg = lowFreqSum / (dataArray.length / 4);
      const midFreqAvg = midFreqSum / (dataArray.length / 4);
      const highFreqAvg = highFreqSum / (dataArray.length / 2);
      // Improved blowing detection criteria
      const isBlowing = averageVolume > 30 && lowFreqAvg > midFreqAvg * 1.2 && lowFreqAvg > highFreqAvg * 1.5;
      if (isBlowing) {
        blowCounter++;
        console.log('Blowing detected! Count:', blowCounter, 'Volume:', averageVolume);
        if (blowCounter >= blowThreshold && isCandieLit) {
          setIsCandleLit(false);
          setShowConfetti(true);
          startCelebrantDisplay();
          // Play music when candle is blown out
          playBirthdaySong();
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          return;
        }
      } else {
        blowCounter = Math.max(0, blowCounter - 1); // Reset counter gradually
      }
      if (isCandieLit) {
        animationFrameRef.current = requestAnimationFrame(checkSoundLevel);
      }
    };
    animationFrameRef.current = requestAnimationFrame(checkSoundLevel);
  };
  // Function to start displaying celebrants one by one
  const startCelebrantDisplay = () => {
    setCurrentCelebrant(celebrants[0]);
    setCelebrantIndex(0);
    celebrantIntervalRef.current = setInterval(() => {
      setCelebrantIndex(prev => {
        const nextIndex = (prev + 1) % celebrants.length;
        setCurrentCelebrant(celebrants[nextIndex]);
        return nextIndex;
      });
    }, 4000);
  };
  // Request microphone access on component mount
  useEffect(() => {
    requestMicAccess();
    // Clean up animation frame and interval on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (celebrantIntervalRef.current) {
        clearInterval(celebrantIntervalRef.current);
      }
    };
  }, []);
  // Handle click on candle for fallback
  const handleCandleClick = () => {
    if (isCandieLit) {
      setIsCandleLit(false);
      setShowConfetti(true);
      startCelebrantDisplay();
      // Play music when candle is blown out
      playBirthdaySong();
    }
  };
  return <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#8d96e9] to-[#f9f871]">
      <audio ref={audioRef} src="src/music/pagbati.mp3" />
      {/* Title */}
      <div className="happy-sabbath">
        <div>Happy Birthday</div>
        <div style={{
        marginTop: '20px'
      }}>
        </div>
      </div>
      {showConfetti && <div className="confetti-container">
          {/* Red hearts - continuous animation */}
          {[...Array(20)].map((_, i) => <div key={`red-${i}`} className="confetti heart red" style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationIterationCount: 'infinite'
      }}></div>)}
          {/* Blue hearts - continuous animation */}
          {[...Array(20)].map((_, i) => <div key={`blue-${i}`} className="confetti heart blue" style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationIterationCount: 'infinite'
      }}></div>)}
          {/* Yellow hearts - continuous animation */}
          {[...Array(20)].map((_, i) => <div key={`yellow-${i}`} className="confetti heart yellow" style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationIterationCount: 'infinite'
      }}></div>)}
          {/* White hearts - continuous animation */}
          {[...Array(20)].map((_, i) => <div key={`white-${i}`} className="confetti heart white" style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationIterationCount: 'infinite'
      }}></div>)}
        </div>}
      {/* Balanced Celebrant name display with birthday-themed design */}
      {!isCandieLit && <div className="celebrant-name-display" style={{
      opacity: showConfetti ? 1 : 0,
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      width: '100%',
      padding: '0 20px',
      animation: 'floatUpDown 3s infinite ease-in-out, fadeIn 1s ease-in-out',
      zIndex: 10
    }}>
          <div style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(31, 156, 179, 0.8), 0 0 20px rgba(46, 15, 119, 0.5)',
          letterSpacing: '3px',
          fontFamily: '"Comic Sans MS", "Brush Script MT", cursive',
          padding: '15px 30px',
          borderRadius: '50px',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          border: '2px dashed #ffffff',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.5)',
          display: 'inline-block',
          position: 'relative'
        }}>
            {currentCelebrant}
            {/* Birthday decorations */}
            <span style={{ position: 'absolute', top: '-20px', left: '10px', fontSize: '1.5rem' }}>🎂</span>
            <span style={{ position: 'absolute', top: '-15px', right: '15px', fontSize: '1.5rem' }}>🎉</span>
            <span style={{ position: 'absolute', bottom: '-15px', left: '15px', fontSize: '1.5rem' }}>🎁</span>
            <span style={{ position: 'absolute', bottom: '-20px', right: '10px', fontSize: '1.5rem' }}>🎈</span>
          </div>
        </div>}
      {/* Cake */}
      <div className="cake">
        <div className="plate"></div>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-middle"></div>
        <div className="layer layer-top"></div>
        <div className="icing"></div>
        <div className="drip drip1"></div>
        <div className="drip drip2"></div>
        <div className="drip drip3"></div>
        <div className="candle">
          {isCandieLit ? <div className="flame" onClick={handleCandleClick}></div> : <div className="w-1 h-10 bg-gray-300 opacity-70 mx-auto animate-smoke"></div>}
        </div>
      </div>
      {/* Message */}
      {isCandieLit && <div className="message">
          {micPermission === true ? 'Blow into your mic' : 'Touch the flame to blow'}
        </div>}
      
      {/* Add keyframe animation for floating effect */}
      <style>
        {`
          @keyframes floatUpDown {
            0% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-15px); }
            100% { transform: translateX(-50%) translateY(0); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}
      </style>
    </div>;
}
export default App;