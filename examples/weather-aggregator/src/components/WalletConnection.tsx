import React from 'react';

interface WalletConnectionProps {
  isConnected: boolean;
  account: string | null;
  onConnect: () => void;
  networkName?: string;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  isConnected,
  account,
  onConnect,
  networkName,
}) => {
  return (
    <div className="card">
      <h2>Connection Status</h2>
      <div id="walletInfo">
        {!isConnected ? (
          <button className="btn" id="connectBtn" onClick={onConnect}>
            Connect Wallet
          </button>
        ) : (
          <div className="status info" id="networkInfo">
            <strong>Network:</strong> <span id="networkName">{networkName || 'Unknown'}</span>
            <br />
            <strong>Account:</strong>{' '}
            <span id="accountAddress">
              {account ? `${account.substring(0, 6)}...${account.substring(38)}` : '-'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
