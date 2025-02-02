import { isWalletConnected, connectWallet, updateBraincellsBalance } from './web3.js';
import { queryAgent, deductBraincells, saveChatMessage, getChatHistory } from './api.js';

let isProcessing = false;

// Initialize chat interface
async function initChat() {
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    if (!isWalletConnected()) {
        try {
            await connectWallet();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            window.location.href = 'index.html';
            return;
        }
    }

    // Load chat history
    try {
        const history = await getChatHistory();
        history.forEach(chat => {
            appendMessage('user', chat.user_message);
            appendMessage('assistant', chat.ai_response);
        });
    } catch (error) {
        console.error('Error loading chat history:', error);
    }

    // Update balance
    await updateBraincellsBalance();

    // Set up event listeners
    sendButton.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
}

// Handle sending messages
async function handleSendMessage() {
    if (isProcessing) return;

    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (!message) return;

    try {
        isProcessing = true;
        
        // Check and deduct Braincells
        await deductBraincells();

        // Add user message to chat
        appendMessage('user', message);
        messageInput.value = '';

        // Get AI response
        const response = await queryAgent(message);
        
        if (response) {
            appendMessage('assistant', response);
            await saveChatHistory(message, response);
        }

        // Update balance after message
        await updateBraincellsBalance();
    } catch (error) {
        console.error('Error sending message:', error);
        appendMessage('system', 'Error: ' + error.message);
    } finally {
        isProcessing = false;
    }
}

// Append message to chat
function appendMessage(type, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'message-icon';
    iconDiv.innerHTML = getMessageIcon(type);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(iconDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get icon for message type
function getMessageIcon(type) {
    switch (type) {
        case 'user':
            return '👤';
        case 'assistant':
            return '🤖';
        case 'system':
            return '⚠️';
        default:
            return '';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initChat);
