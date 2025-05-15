import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SoulboundTokenABI from './abi/SoulboundToken.json';
import { JsonRpcProvider, Contract } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

function TokenPage() {
  const { tokenId } = useParams();
  const [metadata, setMetadata] = useState<any>(null);
  const [owner, setOwner] = useState('');
  const [ipfsCid, setIpfsCid] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTokenData() {
      setLoading(true);
      setError('');
      try {
        const provider = new JsonRpcProvider('https://sepolia.base.org');
        const contract = new Contract(CONTRACT_ADDRESS, SoulboundTokenABI.abi, provider);
        const tokenURI = await contract.tokenURI(tokenId);
        const ipfsUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
        setIpfsCid(ipfsUrl.split('/').pop());
        const meta = await fetch(ipfsUrl).then(res => res.json());
        setMetadata(meta);
        const ownerAddr = await contract.ownerOf(tokenId);
        setOwner(ownerAddr);
        // Try to get the transaction hash (not directly available, so skip for now)
      } catch (err: any) {
        setError('Failed to fetch token data.');
      } finally {
        setLoading(false);
      }
    }
    if (tokenId) fetchTokenData();
  }, [tokenId]);

  if (loading) return <div className="soul-bg"><div className="soul-content">Loading...</div></div>;
  if (error) return <div className="soul-bg"><div className="soul-content" style={{color:'red'}}>{error}</div></div>;
  if (!metadata) return <div className="soul-bg"><div className="soul-content">No metadata found.</div></div>;

  const { socials } = metadata;
  return (
    <div className="soul-bg">
      <div className="soul-content mint-card mint-app-card">
        {/* <h1 className="soul-title-black">Soulbound Token #{tokenId}</h1> */}
        {/* <div style={{marginBottom:'1rem'}}>
          <b>Owner:</b> <a href={`https://sepolia.basescan.org/address/${owner}`} target="_blank" rel="noopener noreferrer">{owner}</a>
        </div> */}
        {/* <div style={{marginBottom:'1rem'}}>
          <b>IPFS:</b> <a href={`https://ipfs.io/ipfs/${ipfsCid}`} target="_blank" rel="noopener noreferrer">{ipfsCid}</a>
        </div> */}
        <div style={{marginBottom:'1rem'}}>
          <b>Socials:</b>
          <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', marginTop:'0.5rem'}}>
            {socials?.twitter && (
              <a href={`https://twitter.com/${socials.twitter}`} target="_blank" rel="noopener noreferrer">🐦 @{socials.twitter}</a>
            )}
            {socials?.linkedin && (
              <a href={`https://linkedin.com/in/${socials.linkedin}`} target="_blank" rel="noopener noreferrer">💼 {socials.linkedin}</a>
            )}
            {socials?.github && (
              <a href={`https://github.com/${socials.github}`} target="_blank" rel="noopener noreferrer">💻 {socials.github}</a>
            )}
          </div>
        </div>
        <div style={{marginTop:'2rem'}}>
          <b>Share this token:</b>
          <div style={{marginTop:'0.5rem'}}>
            <input style={{width:'100%'}} value={window.location.href} readOnly onClick={e => (e.target as HTMLInputElement).select()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenPage; 