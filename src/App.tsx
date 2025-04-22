// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import WaitingRoom from './components/WaitingRoom';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';
function App() {
  return (
  <ThemeProvider>
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <div className="container mx-auto p-4">
        <Router>
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/waiting-room/:roomId" element={<WaitingRoom />} />
            <Route path="/game/:roomId" element={<Game />} />
          </Routes>
        </Router>
      </div>
    </div>
  </ThemeProvider>

  );
}

export default App;
