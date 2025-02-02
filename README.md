# Brain Bot 🧠

A Web3-powered educational platform where users can exchange ETH for Braincells (platform credits) and interact with an AI agent to learn new concepts.

## Features

- 🎁 10,000 Braincells Welcome Bonus
- 🔄 ETH to Braincells Exchange System
- 🤖 AI-powered Learning Assistant
- 💳 Web3 Wallet Integration (MetaMask)
- 💾 Chat History Storage
- 💫 Modern, Responsive UI

## Tech Stack

### Frontend
- **Framework & Build Tools**
  - Vanilla JavaScript
  - Vite (Build tool & Dev server)
  - HTML5/CSS3
  - ES Modules

- **Web3 Integration**
  - Viem (Ethereum interactions)
  - MetaMask (Wallet connection)
  - Base Sepolia Test Network

- **Storage & Database**
  - Supabase (PostgreSQL, Real-time subscriptions)

### Backend Services

1. **Web3 Backend API**
   - Node.js/Express.js
   - Alchemy SDK (Blockchain interaction)
   - Base Sepolia Test Network integration
   - RESTful API architecture
   - Hosted on Render.com

2. **AI Chatbot Infrastructure**
   - LangChain (Framework)
   - Flowise (Visual programming)
   - Custom Agent implementation
   - Model: GPT-based LLM
   - Hosted on Hugging Face Spaces

3. **Automation & Integration**
   - Zapier
   - Telegram Bot API
   - Custom webhooks
   - LangChain-Telegram bridge

### Development & Testing
- Git (Version control)
- npm (Package management)
- Vite (Development server)
- Chrome DevTools
- MetaMask (Wallet testing)

### External Services
- Alchemy (Blockchain RPC provider)
- Supabase (Database & Authentication)
- Base Sepolia Testnet (Ethereum L2)
- Hugging Face (AI model hosting)
- Render.com (Backend hosting)

### Protocols & Standards
- EVM (Ethereum Virtual Machine)
- JSON-RPC (Blockchain communication)
- RESTful APIs
- WebSocket (Real-time updates)
- CORS (Cross-Origin Resource Sharing)

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
   - Click "Start Solving" to open the Flowise chatbot interface
   - Interact directly with our AI tutor
   - Each message costs 100 Braincells
   - Ask questions to learn new concepts

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
- `api.js`: Manages Web3 backend API interactions
- `index.js`: Main application logic and UI interactions
- Flowise: Hosts our AI chatbot interface

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
- New users receive 10,000 Braincells welcome bonus
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
