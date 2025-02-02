const API_BASE_URL = 'https://outskill-cline.onrender.com';
const AGENT_API_URL = 'https://priaansh-flowise.hf.space/api/v1/prediction/59901554-9505-4e0d-a7cb-93deda5e7783';

// Custom fetch with CORS headers
export const fetchWithCORS = async (url, options = {}) => {
    const corsOptions = {
        ...options,
        mode: 'cors',
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    };
    return fetch(url, corsOptions);
};

// Supabase configuration
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://hegjfpfvzprxlgsgxyyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZ2pmcGZ2enByeGxnc2d4eXlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQ2OTcwNiwiZXhwIjoyMDU0MDQ1NzA2fQ.vLCMfTQufrfttxDkEr5ofjpeSZr2q2lfSVaTfDygTKg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cost per message in Braincells
const MESSAGE_COST = 100;

// Check wallet balance
export async function getBalance(walletAddress) {
    try {
        const response = await fetchWithCORS(`${API_BASE_URL}/balance/${walletAddress}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.success ? data.balance : 0;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw new Error('Failed to fetch balance: ' + error.message);
    }
}


// Deduct Braincells for message
export async function deductBraincells(walletAddress) {
    try {
        const balance = await getBalance(walletAddress);
        if (balance < MESSAGE_COST) {
            throw new Error('Insufficient Braincells balance');
        }
        // Note: The actual deduction happens on the backend when processing messages
        return true;
    } catch (error) {
        console.error('Error checking balance:', error);
        throw new Error('Failed to check balance: ' + error.message);
    }
}

// Give welcome bonus to new users
export async function giveWelcomeBonus(walletAddress) {
    try {
        const response = await fetchWithCORS(`${API_BASE_URL}/welcome-bonus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletAddress,
                amount: 10000 // 10k Braincells welcome bonus
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Failed to give welcome bonus');
        }

        return result;
    } catch (error) {
        console.error('Error giving welcome bonus:', error);
        throw new Error('Failed to give welcome bonus: ' + error.message);
    }
}

// Exchange ETH for Braincells
export async function exchangeETH(walletAddress, ethAmount, transactionHash) {
    try {
        const response = await fetchWithCORS(`${API_BASE_URL}/exchange`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletAddress,
                ethAmount,
                transactionHash
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Exchange failed');
        }

        return result;
    } catch (error) {
        console.error('Error during exchange:', error);
        throw new Error('Exchange failed: ' + error.message);
    }
}
