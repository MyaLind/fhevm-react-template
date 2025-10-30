import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('Unknown');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');

  const updateConnectionStatus = useCallback((status: 'connected' | 'disconnected') => {
    setIsConnected(status === 'connected');
    setConnectionStatus(status === 'connected' ? 'Connected' : 'Disconnected');
  }, []);

  const connect = useCallback(async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this application');
        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const web3Signer = web3Provider.getSigner();
      const userAccount = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(userAccount);
      setNetworkName(network.name || 'Unknown');
      updateConnectionStatus('connected');
    } catch (error) {
      console.error('Connection error:', error);
      updateConnectionStatus('disconnected');
    }
  }, [updateConnectionStatus]);

  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
        updateConnectionStatus('disconnected');
      } else {
        connect();
      }
    },
    [connect, updateConnectionStatus]
  );

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          await connect();
        }
      }
    };

    initialize();
  }, [connect]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  return {
    provider,
    signer,
    account,
    networkName,
    isConnected,
    connectionStatus,
    connect,
  };
};
