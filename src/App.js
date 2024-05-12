import logo from './logo.svg';
import './App.css';
import Player from './Player';
function App() {
  const videoUrls = [
    'https://www.youtube.com/watch?v=xmbxe0Jtxmc&ab_channel=AstaAMVs',
    'https://www.youtube.com/watch?v=0bjicmknkVw&ab_channel=TributerCraft',
    'https://www.youtube.com/watch?v=_ge5lO3DyPU&ab_channel=PROTAGONIST',
    'https://www.youtube.com/watch?v=dkURoyTidq8',
    'https://www.youtube.com/watch?v=YAXTn0E-Zgo',
    './Can You Hear The Music.mp4'
  ];
  return (
    <div className="App">
      <h1>My Video Player</h1>
      <Player urls={videoUrls} />
    </div>
  );
}

export default App;
