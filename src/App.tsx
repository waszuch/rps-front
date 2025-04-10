// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import WaitingRoom from './components/WaitingRoom';

function App() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<StartScreen />} />
    <Route path="/waiting-room/:roomId" element={<WaitingRoom />} />
    <Route path="/game/:roomId" element={<Game />} />
  </Routes>
</Router>

  );
}

export default App;
