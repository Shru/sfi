import './App.css';
import { useState, useEffect } from 'react';
import { useDisconnect, useAccount } from 'wagmi';
import { useChainId, useSwitchChain } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SoulboundTokenABI from './abi/SoulboundToken.json';
import { writeContract } from 'wagmi/actions';
import { wagmiConfig } from './wallet';
import { JsonRpcProvider, Contract } from 'ethers';
import BoyNFT from './assets/Boy-NFT.png';
import GirlNFT from './assets/Girl-NFT.png';
import SoulLinkNFT from './assets/Soul-link.png';

// TODO: For production, store this in an .env file and do not commit it!
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Helper to upload image to IPFS via Pinata
async function uploadImageToIPFS(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append('file', blob, 'nft-image.png');
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    } as any,
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image to IPFS');
  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
}

function Mint() {

  const [form, setForm] = useState({
    twitter: '',
    linkedin: '',
    github: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { disconnect } = useDisconnect();
  const { address, connector, isConnected } = useAccount();
  const navigate = useNavigate();
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [selectedToken, setSelectedToken] = useState<'boy' | 'girl' | 'soul' | null>(null);

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  // Auto-populate socials if user has already minted
  useEffect(() => {
    async function fetchAndPopulateSocials() {
      if (!isConnected || !address) return;
      try {
        const provider = new JsonRpcProvider('https://sepolia.base.org');
        const contract = new Contract(CONTRACT_ADDRESS, SoulboundTokenABI.abi, provider);
        const tokenId = await contract.addressToTokenId(address);
        if (tokenId.toString() === '0') return; // No SBT minted
        const tokenURI = await contract.tokenURI(tokenId);
        const ipfsUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
        const metadata = await fetch(ipfsUrl).then(res => res.json());
        if (metadata.socials) {
          setForm({
            twitter: metadata.socials.twitter || '',
            linkedin: metadata.socials.linkedin || '',
            github: metadata.socials.github || '',
          });
        }
        setMintedTokenId(tokenId.toString()); // Show the shareable link if already minted
      } catch (err) {
        // Silently fail if fetch fails
      }
    }
    fetchAndPopulateSocials();
  }, [isConnected, address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!isConnected) {
      setError('Wallet is not connected. Please reconnect and try again.');
      setLoading(false);
      return;
    }
    if (!selectedToken) {
      setError('Please select a token image.');
      setLoading(false);
      return;
    }
    let imageUrl = '';
    if (selectedToken === 'boy') imageUrl = BoyNFT;
    if (selectedToken === 'girl') imageUrl = GirlNFT;
    if (selectedToken === 'soul') imageUrl = SoulLinkNFT;
    try {
      // Upload image to IPFS and get the IPFS URL
      const ipfsImageUrl = await uploadImageToIPFS(imageUrl);
      const httpImageUrl = ipfsImageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const metadata = {
        name: 'SoulLink',
        description: 'Your SoulLink token for your socials',
        socials: { ...form },
        image: httpImageUrl,
        updatedAt: Date.now(), // Ensures a new CID every update
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
      const tokenURI = `ipfs://${cid}`;

      // Use viem's writeContract to call mintOrUpdate
      const txHash = await writeContract(
        wagmiConfig,
        {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: SoulboundTokenABI.abi,
          functionName: 'mintOrUpdate',
          args: [tokenURI],
        }
      );

      // Wait for transaction confirmation
      const provider = new JsonRpcProvider('https://sepolia.base.org');
      if (txHash) {
        await provider.waitForTransaction(txHash, 1, 60000); // Wait for 1 confirmation, up to 60s
      } else {
        // fallback: wait a bit if txHash is not available
        await new Promise(res => setTimeout(res, 3000));
      }

      // Poll for the tokenId until it's set (max 5 seconds)
      const contract = new Contract(CONTRACT_ADDRESS, SoulboundTokenABI.abi, provider);
      let tokenId = 0, tries = 0;
      while (tokenId === 0 && tries < 10) {
        await new Promise(res => setTimeout(res, 500));
        tokenId = await contract.addressToTokenId(address);
        tries++;
      }
      if (tokenId !== 0) setMintedTokenId(tokenId.toString());
      else setError("Token minting failed to confirm. Please refresh and check again.");
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

  // Add network check before rendering the form
  if (chainId !== 84532) {
    return (
      <div className="soul-bg">
        <div className="soul-content mint-card mint-app-card">
          <h2 style={{color: 'red'}}>Wrong Network</h2>
          <p>Please switch your wallet to <b>Base Sepolia</b> to use this app.</p>
          {switchChain && (
            <button className="mint-btn" onClick={() => switchChain({ chainId: 84532 })}>
              Switch to Base Sepolia
            </button>
          )}
          <div style={{marginTop: '1rem', fontSize: '0.95rem', color: '#333', textAlign: 'left'}}>
            <b>Network Name:</b> Base Sepolia<br />
            <b>RPC URL:</b> https://sepolia.base.org<br />
            <b>Chain ID:</b> 84532<br />
            <b>Currency Symbol:</b> ETH<br />
            <b>Block Explorer:</b> <a href="https://sepolia-explorer.base.org" target="_blank" rel="noopener noreferrer">Base Sepolia Explorer</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="soul-bg">
      <div className="soul-content mint-card mint-app-card">
        <div className="mint-header-row" style={{ marginBottom: '2.2rem' }}>
          <span className="wallet-address">{shortAddress}</span>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
        <h1 className="soul-title-black" style={{ marginTop: 0 }}>Enter Your Socials</h1>
        <form className="mint-form" onSubmit={handleSubmit}>
          <div className="mint-input-group">
            <label htmlFor="twitter" className="mint-label">Twitter handle</label>
            <input
              id="twitter"
              type="text"
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              className="mint-input"
              autoComplete="off"
            />
          </div>
          <div className="mint-input-group">
            <label htmlFor="linkedin" className="mint-label">LinkedIn profile</label>
            <input
              id="linkedin"
              type="text"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              className="mint-input"
              autoComplete="off"
            />
          </div>
          <div className="mint-input-group">
            <label htmlFor="github" className="mint-label">GitHub username</label>
            <input
              id="github"
              type="text"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="e.g. mygithub"
              className="mint-input"
            />
          </div>
          <div style={{ margin: '1.2rem 0 0.7rem 0', width: '100%' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.7rem 0', textAlign: 'left' }}>Pick your token</h2>
            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <img src={BoyNFT} alt="Boy NFT" onClick={() => setSelectedToken('boy')} style={{ border: selectedToken === 'boy' ? '3px solid #2257f6' : '2px solid #ccc', borderRadius: '1rem', width: 72, height: 72, objectFit: 'cover', cursor: 'pointer', transition: 'border 0.2s' }} />
              <img src={GirlNFT} alt="Girl NFT" onClick={() => setSelectedToken('girl')} style={{ border: selectedToken === 'girl' ? '3px solid #2257f6' : '2px solid #ccc', borderRadius: '1rem', width: 72, height: 72, objectFit: 'cover', cursor: 'pointer', transition: 'border 0.2s' }} />
              <img src={SoulLinkNFT} alt="Soul Link NFT" onClick={() => setSelectedToken('soul')} style={{ border: selectedToken === 'soul' ? '3px solid #2257f6' : '2px solid #ccc', borderRadius: '1rem', width: 72, height: 72, objectFit: 'cover', cursor: 'pointer', transition: 'border 0.2s' }} />
            </div>
          </div>
          <button type="submit" className="mint-btn" style={{marginTop: '0.5rem'}} disabled={loading || !isConnected}>
            {loading ? 'Minting...' : 'Create'}
          </button>
        </form>
        {/*
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
        */}
        {mintedTokenId && (
          <div style={{ marginTop: '1rem', color: 'blue' }}>
            View your token: <a href={`/token/${mintedTokenId}`} target="_blank" rel="noopener noreferrer">{window.location.origin}/token/{mintedTokenId}</a>
          </div>
        )}
        {error && <div style={{ marginTop: '1rem', color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
}

export default Mint; 