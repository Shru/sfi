import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Mint from './Mint';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mint" element={<Mint />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
