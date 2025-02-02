const API_BASE_URL = 'https://outskill-cline.onrender.com';
const AGENT_API_URL = 'https://priaansh-flowise.hf.space/api/v1/prediction/59901554-9505-4e0d-a7cb-93deda5e7783';

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
        const response = await fetch(`${API_BASE_URL}/balance/${walletAddress}`);
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

// Save chat message to Supabase
export async function saveChatMessage(walletAddress, message, isUser) {
    try {
        const { data, error } = await supabase
            .from('chat_history')
            .insert([
                {
                    wallet_address: walletAddress,
                    message,
                    is_user: isUser,
                    timestamp: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving chat message:', error);
        throw error;
    }
}

// Get chat history from Supabase
export async function getChatHistory(walletAddress) {
    try {
        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('wallet_address', walletAddress)
            .order('timestamp', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw new Error('Failed to fetch chat history: ' + error.message);
    }
}

// Query the AI agent
export async function queryAgent(question) {
    try {
        const response = await fetch(AGENT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error querying agent:', error);
        throw new Error('Failed to get response from agent: ' + error.message);
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

// Exchange ETH for Braincells
export async function exchangeETH(walletAddress, ethAmount, transactionHash) {
    try {
        const response = await fetch(`${API_BASE_URL}/exchange`, {
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
