import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

// Initialize Viem client with Alchemy provider
const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://base-sepolia.g.alchemy.com/v2/wpBKoGLpbEtHOghOYa38YooE9A4zuANh', {
        batch: true
    })
});

let walletClient = null;
let userAddress = null;

// Event Handlers
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
    } else if (accounts[0] !== userAddress) {
        // User switched accounts
        userAddress = accounts[0];
        updateWalletDisplay();
        updateBraincellsBalance();
    }
}

function handleDisconnect() {
    disconnectWallet();
}

function setupWalletEvents() {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('disconnect', handleDisconnect);
    }
}

// Update wallet button display
function updateWalletDisplay() {
    const walletButton = document.getElementById('wallet-button');
    if (!walletButton) return;

    if (userAddress) {
        const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        walletButton.innerHTML = `Connected (${shortAddress})`;
        walletButton.setAttribute('data-address', shortAddress);
        walletButton.classList.add('connected');
    } else {
        walletButton.innerHTML = 'Connect Wallet';
        walletButton.classList.remove('connected');
    }
}

// Check if MetaMask is already connected
async function checkExistingConnection() {
    if (!window.ethereum) return;

    try {
        const accounts = await window.ethereum.request({
            method: 'eth_accounts'
        });

        if (accounts.length > 0) {
            userAddress = accounts[0];
            walletClient = createWalletClient({
                chain: baseSepolia,
                transport: custom(window.ethereum)
            });
            updateWalletDisplay();
            await updateBraincellsBalance();
        }
    } catch (error) {
        console.error('Error checking wallet connection:', error);
    }
}

// Wallet connection handler
export async function connectWallet() {
    if (!window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return null;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        userAddress = accounts[0];
        
        // Initialize wallet client
        walletClient = createWalletClient({
            chain: baseSepolia,
            transport: custom(window.ethereum)
        });

        setupWalletEvents();
        updateWalletDisplay();
        await updateBraincellsBalance();
        
        return userAddress;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
        return null;
    }
}

// Disconnect wallet
export async function disconnectWallet() {
    userAddress = null;
    walletClient = null;
    updateWalletDisplay();
    const balanceElement = document.getElementById('braincells-balance');
    if (balanceElement) {
        balanceElement.textContent = '';
    }
}

// Check if wallet is connected
export function isWalletConnected() {
    return userAddress !== null;
}

// Get connected wallet address
export function getWalletAddress() {
    return userAddress;
}

// Update Braincells balance
export async function updateBraincellsBalance() {
    if (!userAddress) return 0;
    
    try {
        const response = await fetch(`/api/balance/${userAddress}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            const balanceElement = document.getElementById('braincells-balance');
            if (balanceElement) {
                balanceElement.textContent = `${data.balance} Braincells`;
            }
            return data.balance;
        }
        throw new Error('Failed to get balance: ' + (data.error || 'Unknown error'));
    } catch (error) {
        console.error('Error fetching balance:', error);
        const balanceElement = document.getElementById('braincells-balance');
        if (balanceElement) {
            balanceElement.textContent = 'Error loading balance';
        }
        return 0;
    }
}

// Exchange ETH for Braincells
export async function exchangeETH(ethAmount) {
    if (!userAddress || !walletClient) {
        alert('Please connect your wallet first');
        return null;
    }

    // Validate amount
    if (!ethAmount || ethAmount <= 0) {
        alert('Please enter a valid ETH amount');
        return null;
    }

    try {
        // Check ETH balance before proceeding
        const balance = await publicClient.getBalance({
            address: userAddress
        });
        const requiredWei = BigInt(ethAmount * 1e18);

        if (balance < requiredWei) {
            throw new Error('Insufficient ETH balance');
        }

        // Send ETH transaction
        const hash = await walletClient.sendTransaction({
            account: userAddress,
            to: '0xae2786Fb3A7457E01ed29B4F4c845c2ABc463111',
            value: requiredWei
        });

        // Wait for transaction confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ 
            hash,
            confirmations: 1 // Wait for at least 1 confirmation
        });

        if (!receipt || receipt.status === 'reverted') {
            throw new Error('Transaction was reverted');
        }

        // Call exchange API from api.js
        const { exchangeETH: apiExchangeETH } = await import('./api.js');
        const result = await apiExchangeETH(userAddress, ethAmount, hash);
        
        if (result.success) {
            await updateBraincellsBalance();
            return result;
        }
        
        throw new Error(result.error || 'Exchange failed');
    } catch (error) {
        console.error('Error during exchange:', error);
        
        // Provide more user-friendly error messages
        let errorMessage = 'Failed to exchange ETH for Braincells: ';
        if (error.message.includes('insufficient funds')) {
            errorMessage += 'Insufficient ETH balance';
        } else if (error.message.includes('user rejected')) {
            errorMessage += 'Transaction was rejected';
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
        return null;
    }
}

// Initialize wallet connection check
document.addEventListener('DOMContentLoaded', checkExistingConnection);
