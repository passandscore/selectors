# Selectors

A clean, high-contrast web application for decoding Ethereum function signatures using the 4byte.directory API. This tool helps developers and blockchain analysts identify function names from hex signatures found in transaction data.

## Features

- 🔍 **Signature Decoding**: Convert 4-byte hex signatures to human-readable function names
- 🎨 **High-Contrast Design**: Dark theme optimized for readability and reduced eye strain
- 📱 **Responsive Interface**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-Time API**: Instant results from the 4byte.directory database
- ✅ **Input Validation**: Ensures proper 4-byte hex format (e.g., `0xa9059cbb`)
- 📊 **Results Display**: Clean table showing function names and creation dates
- 💡 **Built-in Help**: Comprehensive FAQ about function signatures and usage
- 🎯 **User-Friendly**: Simple, focused interface with keyboard shortcuts

## Usage

1. **Enter a 4-byte hex signature** (e.g., `0xa9059cbb`)
2. **Click "Decode" or press Enter**
3. **View results** in a modal window showing:
   - Function name and parameters
   - Creation date in the database
   - Number of matching signatures found

## What are Function Signatures?

Function signatures are unique 4-byte identifiers for Ethereum smart contract functions. They're created by taking the first 4 bytes of the Keccak-256 hash of the function name and its parameter types.

**Example**: `transfer(address,uint256)` → `0xa9059cbb`

## When to Use This Tool

- **Transaction Analysis**: Decode function calls in blockchain transactions
- **Smart Contract Debugging**: Identify which functions were called
- **Security Audits**: Understand contract interactions
- **Blockchain Research**: Analyze DeFi protocols and smart contracts

## Development

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## API Integration

This application uses the [4byte.directory API](https://www.4byte.directory/api/v1/signatures/) to fetch function signatures.

**API Endpoint**: `GET https://www.4byte.directory/api/v1/signatures/?hex_signature={signature}`

**Example**: `GET https://www.4byte.directory/api/v1/signatures/?hex_signature=0xa9059cbb`

## Technology Stack

- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Vanilla CSS** - Custom high-contrast styling
- **Fetch API** - Modern HTTP requests
- **4byte.directory** - Ethereum signature database

## Project Structure

```
selectors/
├── src/
│   ├── main.ts          # Main application logic
│   └── style.css        # High-contrast styling
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Contributing

This is a simple, focused tool designed for Ethereum developers and blockchain analysts. The codebase is intentionally minimal and easy to understand.

## License

This project is open source and available under the MIT License. 