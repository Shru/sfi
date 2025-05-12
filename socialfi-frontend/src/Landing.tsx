import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import sbtBg from './assets/sbt-bg.jpeg';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

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
        <h1 className="soul-title-black">SoulLink</h1>
        <p className="soul-tagline-quote">"Mint your Token for your socials and share it"</p>
        <img src={sbtBg} alt="Soulbound illustration" className="soul-illustration" />
        <div className="soul-connect-btn">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}

export default Landing;
 