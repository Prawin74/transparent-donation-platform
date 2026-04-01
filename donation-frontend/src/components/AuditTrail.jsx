import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Context } from '../App';
import {
  CONTRACT_ADDRESSES,
  STABLECOIN_DECIMALS,
  donationCampaignABI,
} from '../utils/contractABI';
import { ipfsToHttp } from '../utils/ipfs';

const AuditTrail = () => {
  const { provider, signer } = useContext(Web3Context);
  const [campaignAddress, setCampaignAddress] = useState(CONTRACT_ADDRESSES.DonationCampaign);
  const [donations, setDonations] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [status, setStatus] = useState('');

  const load = async () => {
    const runner = signer || provider;
    if (!runner || !campaignAddress) {
      setStatus('Please connect wallet and set campaign address');
      return;
    }
    try {
      setStatus('Loading audit trail...');
      
      // Validate address format
      if (!ethers.isAddress(campaignAddress)) {
        setStatus('Invalid contract address');
        return;
      }
      
      // Check if contract has code
      const code = await runner.getCode(campaignAddress);
      if (code === '0x') {
        setStatus('No contract found at this address');
        return;
      }
      
      const campaign = new ethers.Contract(campaignAddress, donationCampaignABI, runner);
      
      // Try to verify contract by calling a simple view function first
      try {
        await campaign.campaignTitle();
      } catch (e) {
        setStatus('Contract ABI mismatch or contract not compatible');
        return;
      }
      
      // Fetch donations and withdrawals with error handling
      let donationList = [];
      let withdrawalList = [];
      
      try {
        donationList = await campaign.getDonations();
      } catch (e) {
        console.warn('Error fetching donations:', e);
        setStatus(`Error loading donations: ${e.message}`);
      }
      
      try {
        withdrawalList = await campaign.getWithdrawals();
      } catch (e) {
        console.warn('Error fetching withdrawals:', e);
        setStatus(`Error loading withdrawals: ${e.message}`);
      }
      
      setDonations(
        donationList.map((d) => ({
          donor: d.donor,
          amount: ethers.formatUnits(d.amount, STABLECOIN_DECIMALS),
          timestamp: Number(d.timestamp) * 1000,
        }))
      );
      setWithdrawals(
        withdrawalList.map((w) => ({
          amount: ethers.formatUnits(w.amount, STABLECOIN_DECIMALS),
          purpose: w.purpose,
          proof: w.proofIpfsHash,
          timestamp: Number(w.timestamp) * 1000,
        }))
      );
      setStatus(donationList.length === 0 && withdrawalList.length === 0 ? 'No donations or withdrawals yet' : '');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignAddress, signer, provider]);

  return (
    <section className="card">
      <h2>Audit Trail</h2>
      <label className="label">Campaign Address</label>
      <input className="input" value={campaignAddress} onChange={(e) => setCampaignAddress(e.target.value)} placeholder="0x..." />
      {!campaignAddress && (
        <p className="label" style={{ color: '#fbbf24', marginTop: '8px' }}>
          ⚠️ Enter a deployed DonationCampaign contract address, or deploy one using the "Create" page.
        </p>
      )}
      <div className="actions">
        <button className="primary-btn" onClick={load}>
          Refresh
        </button>
      </div>
      {status && <p className="label" style={{ color: status.includes('Error') || status.includes('Invalid') ? '#ef4444' : '#60a5fa' }}>Status: {status}</p>}

      <div className="grid">
        <div className="card">
          <h3>Donations</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.donor.slice(0, 8)}...</td>
                  <td>{d.amount}</td>
                  <td>{new Date(d.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Withdrawals</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Proof</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, idx) => (
                <tr key={idx}>
                  <td>{w.amount}</td>
                  <td>{w.purpose}</td>
                  <td>
                    {w.proof ? (
                      <a className="link" href={ipfsToHttp(w.proof)} target="_blank" rel="noreferrer">
                        IPFS
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{new Date(w.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AuditTrail;

