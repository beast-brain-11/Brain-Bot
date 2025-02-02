import { connectWallet, exchangeETH } from './web3.js';

document.addEventListener('DOMContentLoaded', function() {
    // Wallet button event listener
    const walletButton = document.getElementById('wallet-button');
    if (walletButton) {
        walletButton.addEventListener('click', connectWallet);
    }

    // Exchange modal elements
    const exchangeModal = document.getElementById('exchange-modal');
    const exchangeButton = document.getElementById('exchange-button');
    const closeButton = document.querySelector('.close');
    const ethAmountInput = document.getElementById('eth-amount');
    const exchangePreview = document.getElementById('exchange-preview');
    const confirmExchangeButton = document.getElementById('confirm-exchange');

    // Exchange rate constant
    const EXCHANGE_RATE = 30000; // 1 ETH = 30,000 Braincells

    // Show exchange modal
    exchangeButton.addEventListener('click', () => {
        exchangeModal.style.display = 'block';
        ethAmountInput.value = '';
        updatePreview('0');
    });

    // Close modal when clicking (×) button
    closeButton.addEventListener('click', () => {
        exchangeModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === exchangeModal) {
            exchangeModal.style.display = 'none';
        }
    });

    // Update preview as user types
    ethAmountInput.addEventListener('input', () => {
        const ethAmount = parseFloat(ethAmountInput.value) || 0;
        const braincells = ethAmount * EXCHANGE_RATE;
        updatePreview(braincells.toLocaleString());
    });

    // Handle exchange confirmation
    confirmExchangeButton.addEventListener('click', async () => {
        const ethAmount = parseFloat(ethAmountInput.value);
        
        // Validate input
        if (!ethAmount || ethAmount <= 0) {
            alert('Please enter a valid ETH amount');
            return;
        }

        const braincells = ethAmount * EXCHANGE_RATE;
        
        // Confirm with user
        const confirmed = confirm(
            `Do you want to exchange ${ethAmount} ETH for ${braincells.toLocaleString()} Braincells?`
        );

        if (!confirmed) return;

        try {
            confirmExchangeButton.disabled = true;
            confirmExchangeButton.textContent = 'Processing...';

            const result = await exchangeETH(ethAmount);
            
            if (result && result.success) {
                alert(`Success! You received ${result.data.braincells_awarded.toLocaleString()} Braincells`);
                exchangeModal.style.display = 'none';
            } else {
                throw new Error(result?.error || 'Exchange failed');
            }
        } catch (error) {
            console.error('Exchange error:', error);
            //alert(`Exchange failed: ${error.message}`);
        } finally {
            confirmExchangeButton.disabled = false;
            confirmExchangeButton.textContent = 'Confirm Exchange';
        }
    });

    // Helper function to update preview text
    function updatePreview(amount) {
        exchangePreview.textContent = `You will receive: ${amount} Braincells`;
    }
});
