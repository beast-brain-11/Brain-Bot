# Brain Bot 🧠

A Web3-powered educational platform where users can exchange ETH for Braincells (platform credits) and interact with an AI agent to learn new concepts.

## Features

- 🔄 ETH to Braincells Exchange System
- 🤖 AI-powered Learning Assistant
- 💳 Web3 Wallet Integration (MetaMask)
- 💾 Chat History Storage
- 💫 Modern, Responsive UI

## Architecture

### Frontend
- Vanilla JavaScript with Vite
- Web3 Integration using Viem
- Base Sepolia Test Network for transactions
- Supabase for chat history storage

### Backend Services
- Web3 Backend API (https://outskill-cline.onrender.com)
  - Handles ETH to Braincells conversion
  - Manages user balances
  - Verifies blockchain transactions
- AI Agent API
  - Endpoint: https://priaansh-flowise.hf.space
  - Provides educational responses and explanations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
- Ensure you have MetaMask installed with Base Sepolia Test Network configured
- Get some test ETH from Base Sepolia faucet

3. Start development server:
```bash
npm run dev
```

## Usage

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection

2. **Exchange ETH for Braincells**
   - Click "Exchange ETH" button
   - Enter desired ETH amount
   - Confirm transaction in MetaMask
   - Exchange rate: 1 ETH = 30,000 Braincells

3. **Start Learning**
   - Click "Start Solving" to enter chat interface
   - Each message costs 100 Braincells
   - Ask questions to learn new concepts
   - Chat history is saved automatically

## Technical Details

### API Endpoints

#### Web3 Backend (Base URL: https://outskill-cline.onrender.com)

- `GET /health`: Check API status
- `GET /balance/:walletAddress`: Get user's Braincells balance
- `POST /exchange`: Convert ETH to Braincells
  ```json
  {
    "walletAddress": "0x...",
    "ethAmount": 1.0,
    "transactionHash": "0x..."
  }
  ```

### Architecture Components

- `web3.js`: Handles wallet connection and ETH transactions
- `api.js`: Manages API interactions and Supabase integration
- `chat.js`: Implements chat interface and message handling
- `index.js`: Main application logic and UI interactions

### Development

The project uses Vite for development with the following features:
- Hot Module Replacement
- API Proxy configuration
- ES Module support
- Asset optimization

To modify the project:
1. Frontend UI components are in index.html and chat.html
2. Styles are in css/styles.css and css/chat.css
3. JavaScript logic is organized in the js/ directory

## Notes

- Uses Base Sepolia Test Network for transactions
- Exchange rate: 1 ETH = 30,000 Braincells
- Message cost: 100 Braincells per message
- Requires MetaMask wallet
- Chat history stored in Supabase

## Troubleshooting

1. **Wallet Connection Issues**
   - Ensure MetaMask is installed
   - Verify you're on Base Sepolia Test Network
   - Check console for detailed errors

2. **Transaction Failures**
   - Ensure sufficient ETH balance
   - Verify network connection
   - Check transaction parameters

3. **API Issues**
   - Verify API endpoints are accessible
   - Check CORS configuration
   - Ensure valid wallet address format

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
