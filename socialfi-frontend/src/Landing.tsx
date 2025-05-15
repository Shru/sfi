import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import sbtBg from './assets/sbt-bg.jpeg';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import baseLogo from './assets/Base logo.png';

function Landing() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      navigate('/mint');
    }
  }, [isConnected, navigate]);

  return (
    <div className="soul-bg">
      <div className="soul-content">
        <h1 className="soul-title-blue">SoulLink</h1>
        <p className="soul-tagline-quote">Create your socials NFT and share it!</p>
        <div className="soul-powered-row">
          <span>Powered by</span>
          <img src={baseLogo} alt="Base logo" className="soul-powered-logo" />
          <span>@Base</span>
        </div>
        <img src={sbtBg} alt="Soulbound illustration" className="soul-illustration" />
        <div className="soul-connect-btn">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}

export default Landing;
 