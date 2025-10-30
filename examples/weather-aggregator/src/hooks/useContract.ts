import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export const useContract = () => {
  const { signer, account } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (signer) {
      const weatherContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(weatherContract);
    } else {
      setContract(null);
    }
  }, [signer]);

  const refreshAll = useCallback(async () => {
    // This function can be used to refresh all contract data
    // Individual components handle their own data fetching
  }, []);

  return {
    contract,
    account,
    refreshAll,
  };
};
