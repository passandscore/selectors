# Selectors

A high-contrast web application that helps users identify Ethereum function signatures, error messages, and events by querying the 4byte directory API.

## Features

- 🔍 Search for function signatures using hex values
- 🎨 High-contrast dark theme for better visibility
- 📱 Responsive design for mobile and desktop
- ⚡ Real-time API calls to 4byte.directory
- 🎯 Input validation for proper hex format
- 📊 Display of function names, creation dates, and hex signatures

## Usage

1. Enter a 4-byte hex signature (e.g., `0xa9059cbb`)
2. Click "Search" or press Enter
3. View the list of matching function signatures
4. Each result shows the function name, creation date, and hex value

## Development

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API

This app uses the [4byte.directory API](https://www.4byte.directory/api/v1/signatures/) to fetch function signatures.

Example API call:
```
GET https://www.4byte.directory/api/v1/signatures/?hex_signature=0xa9059cbb
```

## Purpose

This tool helps developers and users identify:
- Function names from transaction data
- Error messages from failed transactions
- Event signatures from blockchain logs

## Technologies Used

- TypeScript
- Vite
- CSS3 with high-contrast design
- Fetch API for HTTP requests 