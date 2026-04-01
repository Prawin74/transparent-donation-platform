import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const POLYGON_AMOY_CHAIN_ID_HEX = '0x13882'; // 80002
const POLYGON_AMOY_RPC = 'https://rpc-amoy.polygon.technology';

export const useWallet = () => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState('0'); // String in Eth/Matic
    const [chainId, setChainId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    const updateProviderAndSigner = useCallback(async () => {
        if (window.ethereum) {
            const providerInstance = new ethers.BrowserProvider(window.ethereum);

            // Fix: Explicitly disable ENS for Polygon Amoy to verify network support
            try {
                const network = await providerInstance.getNetwork();
                if (network.chainId === 80002n) { // Amoy Chain ID
                    network.ensAddress = null;
                }
            } catch (err) {
                console.warn("Could not fetch network for ENS check", err);
            }

            setProvider(providerInstance);
            try {
                const signerInstance = await providerInstance.getSigner();
                setSigner(signerInstance);
            } catch (e) {
                // Signer might fail if not connected
                setSigner(null);
            }
        }
    }, []);

    const fetchBalance = useCallback(async (addr) => {
        if (window.ethereum && addr) {
            try {
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                const bal = await providerInstance.getBalance(addr);
                setBalance(ethers.formatEther(bal));
            } catch (err) {
                console.error("Failed to fetch balance", err);
            }
        } else {
            setBalance('0');
        }
    }, []);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setError("MetaMask is not installed");
            return;
        }
        setIsConnecting(true);
        setError(null);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const currentAccount = accounts[0];
            setAccount(currentAccount);

            const chain = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(chain);

            await fetchBalance(currentAccount);
            await updateProviderAndSigner();
        } catch (err) {
            setError(err.message || "Failed to connect");
        } finally {
            setIsConnecting(false);
        }
    }, [fetchBalance, updateProviderAndSigner]);

    const switchNetwork = useCallback(async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: POLYGON_AMOY_CHAIN_ID_HEX }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: POLYGON_AMOY_CHAIN_ID_HEX,
                                chainName: 'Polygon Amoy Testnet',
                                nativeCurrency: {
                                    name: 'MATIC',
                                    symbol: 'MATIC',
                                    decimals: 18
                                },
                                rpcUrls: [POLYGON_AMOY_RPC],
                                blockExplorerUrls: ['https://amoy.polygonscan.com/']
                            }
                        ],
                    });
                } catch (addError) {
                    setError("Failed to add Amoy network");
                }
            } else {
                setError("Failed to switch network");
            }
        }
    }, []);

    useEffect(() => {
        const ethereum = window.ethereum;
        if (ethereum) {
            // Initial check
            ethereum.request({ method: 'eth_accounts' }).then(accounts => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    fetchBalance(accounts[0]);
                    updateProviderAndSigner();
                }
            });
            ethereum.request({ method: 'eth_chainId' }).then(chain => {
                setChainId(chain);
            });

            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    fetchBalance(accounts[0]);
                    updateProviderAndSigner();
                } else {
                    setAccount(null);
                    setBalance('0');
                    setSigner(null);
                }
            };

            const handleChainChanged = (chain) => {
                setChainId(chain);
                if (account) fetchBalance(account);
                // window.location.reload(); 
            };

            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                }
            };
        }
    }, [account, fetchBalance, updateProviderAndSigner]);

    // Validation logic
    const validateAddress = (addr) => {
        const hexRegex = /^0x[0-9a-fA-F]{40}$/;
        return hexRegex.test(addr);
    };

    const validateDonation = (amountStr, gasBuffer = 0.01) => {
        if (!amountStr) return "Enter an amount";
        const amount = parseFloat(amountStr);
        const bal = parseFloat(balance);
        if (isNaN(amount) || amount <= 0) return "Invalid amount";

        if (amount + gasBuffer > bal) {
            return "Insufficient funds (including gas buffer)";
        }
        return null;
    };

    const isPolygonAmoy = chainId === POLYGON_AMOY_CHAIN_ID_HEX;

    return {
        account,
        balance,
        chainId,
        isConnecting,
        error,
        connectWallet,
        switchNetwork,
        isPolygonAmoy,
        validateDonation,
        validateAddress,
        isConnected: !!account,
        provider,
        signer
    };
};
