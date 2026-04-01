import { create } from 'ipfs-http-client';

const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;

// Create IPFS client only if credentials are available
let client = null;
if (projectId && projectSecret) {
  try {
    const auth = 'Basic ' + btoa(`${projectId}:${projectSecret}`);
    client = create({
      host: process.env.REACT_APP_IPFS_HOST || 'ipfs.infura.io',
      port: Number(process.env.REACT_APP_IPFS_PORT || 5001),
      protocol: process.env.REACT_APP_IPFS_PROTOCOL || 'https',
      headers: { authorization: auth },
    });
  } catch (err) {
    console.warn('Failed to create IPFS client:', err);
  }
}

export const uploadJSONToIPFS = async (data) => {
  // If no credentials, return empty string (IPFS is optional)
  if (!client) {
    console.warn('IPFS client not available (no Infura credentials). Skipping IPFS upload.');
    return '';
  }
  
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const { cid } = await client.add(jsonString);
    return `ipfs://${cid.toString()}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    // If upload fails (e.g., auth error), return empty string so deployment can continue
    // The contract allows empty IPFS hash
    if (error.message && (error.message.includes('project id') || error.message.includes('401') || error.message.includes('Unauthorized'))) {
      console.warn('IPFS authentication failed. Continuing without IPFS metadata.');
      return '';
    }
    // Re-throw other errors
    throw error;
  }
};

export const uploadFileToIPFS = async (file) => {
  if (!client) {
    console.warn('IPFS client not available. Skipping IPFS upload.');
    return '';
  }
  
  try {
    const { cid } = await client.add(file);
    return `ipfs://${cid.toString()}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    if (error.message && (error.message.includes('project id') || error.message.includes('401') || error.message.includes('Unauthorized'))) {
      console.warn('IPFS authentication failed. Continuing without IPFS.');
      return '';
    }
    throw error;
  }
};

export const ipfsToHttp = (hash) => {
  if (!hash) return '';
  const clean = hash.replace('ipfs://', '');
  const gateway = process.env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  return `${gateway}${clean}`;
};

