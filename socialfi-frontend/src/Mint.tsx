import './App.css';
import { useState, useEffect } from 'react';
import { useDisconnect, useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SoulboundTokenABI from '../../artifacts/contracts/SoulboundToken.sol/SoulboundToken.json';
import { writeContract } from 'wagmi/actions';
import { wagmiConfig } from './wallet';

// TODO: For production, store this in an .env file and do not commit it!
const PINATA_API_KEY = '78753aeeaa58553fa2bf';
const PINATA_API_SECRET = '19de304e1b414a33e839d37b221b893f1b549523568d200e561858bccfb917a6';

const CONTRACT_ADDRESS = '0x026a85733caac36A773aC3725241012faBbf9800';

function Mint() {

  const [form, setForm] = useState({
    twitter: '',
    linkedin: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(false);
  const [ipfsCid, setIpfsCid] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const { disconnect } = useDisconnect();
  const { address, connector, isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTxHash('');
    setIpfsCid('');
    if (!isConnected) {
      setError('Wallet is not connected. Please reconnect and try again.');
      setLoading(false);
      return;
    }
    try {
      const metadata = {
        name: 'SocialFi SBT',
        description: 'Soulbound Token for social links',
        socials: { ...form },
        image: undefined, // Optionally add an image
      };

      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const res = await axios.post(url, metadata, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      });

      const cid = res.data.IpfsHash;
      setIpfsCid(cid);
      const tokenURI = `ipfs://${cid}`;

      // Use viem's writeContract to call mintOrUpdate
      const tx = await writeContract(
        wagmiConfig,
        {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: SoulboundTokenABI.abi,
          functionName: 'mintOrUpdate',
          args: [tokenURI],
        }
      );
      setTxHash(tx);
    } catch (err: any) {
      console.error("Minting error:", err);
      setError(err.message || "Minting failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper to shorten address
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleDisconnect = async () => {
    disconnect({ connector });
    // Clear all possible wallet connection keys
    localStorage.removeItem('walletconnect');
    localStorage.removeItem('wagmi.recentConnectorId');
    localStorage.removeItem('wagmi.connected');
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.store');
    sessionStorage.removeItem('wagmi.recentConnectorId');
    sessionStorage.removeItem('walletconnect');
    sessionStorage.removeItem('wagmi.connected');
    sessionStorage.removeItem('wagmi.wallet');
    sessionStorage.removeItem('wagmi.store');
    // Remove RainbowKit keys if present
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('rk.') || key.startsWith('rainbowkit')) {
        localStorage.removeItem(key);
      }
    });
    navigate('/');
  };

  return (
    <div className="soul-bg">
      <div className="soul-content mint-card mint-app-card">
        <div className="mint-header-row">
          <span className="wallet-address">{shortAddress}</span>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
        <h1 className="soul-title-black">Enter Your Socials</h1>
        <p className="mint-subtitle">Mint your Soulbound Token with your social links</p>
        <form className="mint-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="twitter"
            placeholder="Twitter handle"
            value={form.twitter}
            onChange={handleChange}
            className="mint-input"
            autoComplete="off"
          />
          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn profile"
            value={form.linkedin}
            onChange={handleChange}
            className="mint-input"
            autoComplete="off"
          />
          <input
            type="text"
            name="instagram"
            placeholder="Instagram handle"
            value={form.instagram}
            onChange={handleChange}
            className="mint-input"
            autoComplete="off"
          />
          <button type="submit" className="mint-btn" style={{marginTop: '0.5rem'}} disabled={loading || !isConnected}>
            {loading ? 'Minting...' : 'Mint SBT'}
          </button>
        </form>
        {ipfsCid && (
          <div style={{ marginTop: '1rem', color: 'green' }}>
            Uploaded! IPFS: <a href={`https://ipfs.io/ipfs/${ipfsCid}`} target="_blank" rel="noopener noreferrer">{ipfsCid}</a>
          </div>
        )}
        {txHash && (
          <div style={{ marginTop: '1rem', color: 'green' }}>
            Minted! Tx: <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash.slice(0, 10)}...</a>
          </div>
        )}
        {error && <div style={{ marginTop: '1rem', color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
}

export default Mint; 