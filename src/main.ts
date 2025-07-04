import './style.css'

interface SignatureResult {
  id: number;
  created_at: string;
  text_signature: string;
  hex_signature: string;
  bytes_signature: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SignatureResult[];
}

class SignatureLookup {
  private app: HTMLElement;
  private input!: HTMLInputElement;
  private modal!: HTMLElement;
  private modalContent!: HTMLElement;
  private helpModal!: HTMLElement;
  private loadingElement!: HTMLElement;

  constructor() {
    this.app = document.querySelector<HTMLDivElement>('#app')!;
    this.setupUI();
    this.setupEventListeners();
  }

  private setupUI(): void {
    this.app.innerHTML = `
      <div class="container">
        <h1 class="title">Selectors</h1>
        
        <div class="search-section">
          <div class="input-group">
            <input 
              type="text" 
              id="signature-input" 
              placeholder="0xa9059cbb"
              class="signature-input"
            />
            <button id="search-btn" class="search-btn">Decode</button>
          </div>
          <p class="helper-text">
            <a href="#" id="help-link">What is this?</a>
          </p>
        </div>

        <div id="loading" class="loading hidden">
          <div class="spinner"></div>
          <p>Decoding...</p>
        </div>
      </div>

      <div id="modal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-title">Results</h3>
            <button id="close-modal" class="close-btn">&times;</button>
          </div>
          <div id="modal-body" class="modal-body"></div>
        </div>
      </div>

      <div id="help-modal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Help</h3>
            <button id="close-help-modal" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="accordion">
              <div class="accordion-item">
                <button class="accordion-header">
                  What is a function signature?
                  <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-content">
                  <p>A function signature is a unique identifier for a function in Ethereum smart contracts. It's created by taking the first 4 bytes of the Keccak-256 hash of the function name and its parameter types.</p>
                </div>
              </div>
              
              <div class="accordion-item">
                <button class="accordion-header">
                  When do I need to decode signatures?
                  <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-content">
                  <p>You need to decode signatures when analyzing blockchain transactions, debugging smart contracts, or understanding what function was called in a transaction. It's especially useful for security audits and transaction analysis.</p>
                </div>
              </div>
              
              <div class="accordion-item">
                <button class="accordion-header">
                  Why are some signatures not found?
                  <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-content">
                  <p>Signatures might not be found if they're from private or custom functions, if they haven't been submitted to the database yet, or if they're from newer contracts that haven't been indexed. The database relies on community submissions.</p>
                </div>
              </div>
              
              <div class="accordion-item">
                <button class="accordion-header">
                  How do I find a function signature?
                  <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-content">
                  <p>You can find function signatures in transaction data, contract ABIs, or by hashing the function name and parameters. For example, the signature for "transfer(address,uint256)" is 0xa9059cbb. You can also use tools like web3.js or ethers.js to generate them.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.input = document.querySelector<HTMLInputElement>('#signature-input')!;
    this.modal = document.querySelector<HTMLDivElement>('#modal')!;
    this.modalContent = document.querySelector<HTMLDivElement>('#modal-body')!;
    this.helpModal = document.querySelector<HTMLDivElement>('#help-modal')!;
    this.loadingElement = document.querySelector<HTMLDivElement>('#loading')!;
  }

  private setupEventListeners(): void {
    const searchBtn = document.querySelector<HTMLButtonElement>('#search-btn')!;
    const closeBtn = document.querySelector<HTMLButtonElement>('#close-modal')!;
    const helpLink = document.querySelector<HTMLAnchorElement>('#help-link')!;
    const closeHelpBtn = document.querySelector<HTMLButtonElement>('#close-help-modal')!;
    
    searchBtn.addEventListener('click', () => this.searchSignatures());
    
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchSignatures();
      }
    });

    closeBtn.addEventListener('click', () => this.closeModal());
    helpLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showHelpModal();
    });
    closeHelpBtn.addEventListener('click', () => this.closeHelpModal());

    // Close modals when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    this.helpModal.addEventListener('click', (e) => {
      if (e.target === this.helpModal) {
        this.closeHelpModal();
      }
    });

    // Setup accordion functionality
    this.setupAccordion();

    // Focus on input when page loads
    this.input.focus();
  }

  private setupAccordion(): void {
    const accordionHeaders = document.querySelectorAll<HTMLButtonElement>('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement as HTMLElement;
        const content = item.querySelector<HTMLElement>('.accordion-content')!;
        const icon = header.querySelector<HTMLElement>('.accordion-icon')!;
        
        // Close other items
        accordionHeaders.forEach(otherHeader => {
          if (otherHeader !== header) {
            const otherItem = otherHeader.parentElement as HTMLElement;
            const otherContent = otherItem.querySelector<HTMLElement>('.accordion-content')!;
            const otherIcon = otherHeader.querySelector<HTMLElement>('.accordion-icon')!;
            
            otherContent.style.maxHeight = '0';
            otherIcon.textContent = '+';
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        if (item.classList.contains('active')) {
          content.style.maxHeight = '0';
          icon.textContent = '+';
          item.classList.remove('active');
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.textContent = '−';
          item.classList.add('active');
        }
      });
    });
  }

  private async searchSignatures(): Promise<void> {
    const signature = this.input.value.trim();
    
    if (!signature) {
      this.showError('Please enter a hex signature');
      return;
    }

    // Validate hex format
    if (!/^0x[a-fA-F0-9]{8}$/.test(signature)) {
      this.showError('Invalid 4-byte hex signature (try: 0xa9059cbb)');
      return;
    }

    this.showLoading();
    
    try {
      const response = await fetch(`https://www.4byte.directory/api/v1/signatures/?hex_signature=${signature}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      this.displayResults(data);
    } catch (error) {
      console.error('Error fetching signatures:', error);
      this.showError('Network error. Please try again.');
    } finally {
      this.hideLoading();
    }
  }

  private displayResults(data: ApiResponse): void {
    const modalTitle = document.querySelector<HTMLHeadingElement>('#modal-title')!;
    
    if (data.count === 0) {
      modalTitle.textContent = 'No Results';
      this.modalContent.innerHTML = `
        <div class="no-results">
          <p>No signatures found for this hex signature.</p>
        </div>
      `;
    } else {
      modalTitle.textContent = `Found ${data.count} signature${data.count !== 1 ? 's' : ''}`;
      
      const tableRows = data.results.map((result, index) => `
        <tr>
          <td class="signature-date">${index + 1}</td>
          <td class="signature-date">${result.text_signature}</td>
          <td class="signature-date">${new Date(result.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('');

      this.modalContent.innerHTML = `
        <table class="signatures-table">
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      `;
    }
    
    this.showModal();
  }

  private showError(message: string): void {
    const modalTitle = document.querySelector<HTMLHeadingElement>('#modal-title')!;
    modalTitle.textContent = 'Error';
    this.modalContent.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
    this.showModal();
  }

  private showModal(): void {
    this.modal.classList.remove('hidden');
  }

  private closeModal(): void {
    this.modal.classList.add('hidden');
  }

  private showHelpModal(): void {
    this.helpModal.classList.remove('hidden');
  }

  private closeHelpModal(): void {
    this.helpModal.classList.add('hidden');
  }

  private showLoading(): void {
    this.loadingElement.classList.remove('hidden');
  }

  private hideLoading(): void {
    this.loadingElement.classList.add('hidden');
  }
}

// Initialize the app
new SignatureLookup(); 