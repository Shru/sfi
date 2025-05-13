import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Mint from './Mint';
import TokenPage from './TokenPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/token/:tokenId" element={<TokenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
