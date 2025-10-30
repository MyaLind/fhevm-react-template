import React from 'react';
import ReactDOM from 'react-dom/client';
import { FHEVMProvider } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';
import App from './App';
import { getRandomTheme, applyTheme } from './utils/theme';

// Apply random theme on load
const selectedTheme = getRandomTheme();
applyTheme(selectedTheme);

// Initialize provider for FHEVM SDK
let provider: BrowserProvider | null = null;
if (typeof window !== 'undefined' && window.ethereum) {
  provider = new BrowserProvider(window.ethereum);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <FHEVMProvider config={{ provider: provider as any }}>
      <App />
    </FHEVMProvider>
  </React.StrictMode>
);
