// Player.js
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import "./Player.css"

function Duration({ className, seconds }) {
  function format(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  function pad(string) {
    return ('0' + string).slice(-2);
  }

  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  );
}

function Player({ urls }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case ' ':
          handlePlayPause();
          break;
        case 'ArrowUp':
          setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1));
          break;
        case 'ArrowDown':
          setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0));
          break;
        case 'ArrowRight':
          handleForward();
          break;
        case 'ArrowLeft':
          handleBackward();
          break;
        case 'm':
        case 'M':
          setVolume(0);
          break;
        case 'n':
        case 'N':
          playNext();
          break;
        case 'p':
        case 'P':
          playPrevious();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleBackward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleProgress = (progress) => {
    setPlayed(progress.played);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeek = (e) => {
    const clickedTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
    playerRef.current.seekTo(clickedTime);
  };

  const playPrevious = () => {
    setCurrentVideoIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setIsPlaying(true);
  };

  const playNext = () => {
    setCurrentVideoIndex((prevIndex) => Math.min(prevIndex + 1, urls.length - 1));
    setIsPlaying(true);
  };

  return (
    <div className="player-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <ReactPlayer
        ref={playerRef}
        url={urls[currentVideoIndex]}
        playing={isPlaying}
        controls={false}
        volume={volume}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={handleDuration}
        onPause={handlePause}
        onPlay={handlePlay}
      />
      {isHovered && (
        <div className="player-controls">
          <div className="control-buttons">
            <button onClick={playPrevious} disabled={currentVideoIndex === 0}>⏮️</button>
            <button onClick={handlePlayPause}>{isPlaying ? '❚❚' : '▶'}</button>
            <button onClick={playNext} disabled={currentVideoIndex === urls.length - 1}>⏭️</button>
            <button onClick={handleForward}>⏩</button>
            <button onClick={handleBackward}>⏪</button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <div className="speed-control">
            <input
              type="range"
              min={0.5}
              max={4}
              step={0.25}
              value={playbackRate}
              onChange={handlePlaybackRateChange}
            />
            <span>{playbackRate.toFixed(2)}x</span>
          </div>
          <div className="progress-container">
            <progress value={played} max={1} onClick={handleSeek} />
            <div className="elapsed-time">
              <strong>Elapsed:</strong> <Duration seconds={duration * played} />
            </div>
            <div className="total-duration">
              <strong>Total:</strong> <Duration seconds={duration} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Player;
