import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import axios from 'axios';

const BASE_URL = 'https://sealed-soonest-rio-battle.trycloudflare.com/';
const OG_IMAGE = `${BASE_URL}/sbt-bg.jpeg`;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET!;
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ABI = [
  // Only the mintOrUpdate and addressToTokenId functions needed
  "function mintOrUpdate(string tokenURI) public",
  "function addressToTokenId(address) public view returns (uint256)",
  "function tokenURI(uint256) public view returns (string)"
];

function renderHTML(meta: string) {
  return new NextResponse(
    `<!DOCTYPE html><html lang="en"><head>${meta}</head><body></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}

export async function GET() {
  // Step 1: Landing screen
  return renderHTML(`
    <meta property="og:title" content="SoulLink" />
    <meta property="og:description" content="Mint an NFT for your socials." />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${OG_IMAGE}" />
    <meta property="fc:frame:button:1" content="Get Started" />
    <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
  `);
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const { untrustedData } = body || {};
  const step = untrustedData?.step;

  // If no step or not 'input', show socials input step
  if (!step || step !== 'input') {
    return renderHTML(`
      <meta property="og:title" content="Enter Your Socials" />
      <meta property="og:description" content="Mint your Soulbound Token with your social links" />
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:input:text" content="Twitter" />
      <meta property="fc:frame:input:text:2" content="LinkedIn" />
      <meta property="fc:frame:input:text:3" content="GitHub" />
      <meta property="fc:frame:button:1" content="Create NFT" />
      <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
      <meta property="fc:frame:state" content='{"step":"input"}' />
    `);
  }

  // Step 3: Minting
  if (step === 'input') {
    // Extract user address from Farcaster payload
    const userAddress = untrustedData?.address;
    const twitter = untrustedData?.inputText;
    const linkedin = untrustedData?.inputText2;
    const github = untrustedData?.inputText3;
    if (!userAddress || !twitter || !linkedin || !github) {
      return renderHTML(`
        <meta property="og:title" content="Missing Info" />
        <meta property="og:description" content="Please enter all socials." />
        <meta property="og:image" content="${OG_IMAGE}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${OG_IMAGE}" />
        <meta property="fc:frame:button:1" content="Back" />
        <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
        <meta property="fc:frame:state" content='{"step":"landing"}' />
      `);
    }
    // Upload metadata to IPFS
    const metadata = {
      name: 'SocialFi SBT',
      description: 'Soulbound Token for social links',
      socials: { twitter, linkedin, github },
      image: OG_IMAGE,
    };
    let ipfsCid = '';
    try {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const res = await axios.post(url, metadata, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      });
      ipfsCid = res.data.IpfsHash;
    } catch (err) {
      return renderHTML(`
        <meta property="og:title" content="IPFS Upload Failed" />
        <meta property="og:description" content="Could not upload metadata." />
        <meta property="og:image" content="${OG_IMAGE}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${OG_IMAGE}" />
        <meta property="fc:frame:button:1" content="Back" />
        <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
        <meta property="fc:frame:state" content='{"step":"landing"}' />
      `);
    }
    // Mint NFT to user
    let txHash = '';
    let tokenId = '';
    try {
      const provider = new JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
      const tokenURI = `ipfs://${ipfsCid}`;
      const tx = await contract.mintOrUpdate(tokenURI);
      await tx.wait();
      // Get tokenId for user
      tokenId = (await contract.addressToTokenId(userAddress)).toString();
      txHash = tx.hash;
    } catch (err) {
      return renderHTML(`
        <meta property="og:title" content="Mint Failed" />
        <meta property="og:description" content="Could not mint NFT." />
        <meta property="og:image" content="${OG_IMAGE}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${OG_IMAGE}" />
        <meta property="fc:frame:button:1" content="Back" />
        <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
        <meta property="fc:frame:state" content='{"step":"landing"}' />
      `);
    }
    // Show confirmation
    const nftUrl = `https://sfi-ten.vercel.app/token/${tokenId}`;
    return renderHTML(`
      <meta property="og:title" content="NFT Minted!" />
      <meta property="og:description" content="Your SoulLink NFT is minted. View it here." />
      <meta property="og:image" content="${OG_IMAGE}" />
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${OG_IMAGE}" />
      <meta property="fc:frame:button:1" content="View NFT" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="${nftUrl}" />
    `);
  }

  // Default: go back to landing
  return renderHTML(`
    <meta property="og:title" content="SoulLink" />
    <meta property="og:description" content="Mint an NFT for your socials." />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${OG_IMAGE}" />
    <meta property="fc:frame:button:1" content="Get Started" />
    <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
  `);
} 