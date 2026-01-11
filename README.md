# GloballyHub Client

A modern, full-featured cryptocurrency wallet application built with Next.js, React, and TypeScript. This application provides a user-friendly interface for managing blockchain transactions, viewing wallet balances, exploring the blockchain, and mining new blocks.

## Features

- 🔐 **Authentication System**
  - User registration and login
  - Secure session management
  - Protected routes

- 💰 **Wallet Management**
  - View wallet balance and address
  - Send transactions to other addresses
  - Track pending and confirmed transactions
  - Transaction history with pagination

- ⛓️ **Blockchain Explorer**
  - View the entire blockchain
  - Explore block details and transactions
  - Mine new blocks

- 📊 **Dashboard**
  - Wallet summary overview
  - Recent transactions display
  - Quick access to all features

## Tech Stack

- **Framework**: Next.js 16.1.1
- **Runtime**: React 19.3.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Backend API server running (default: `http://localhost:8080/api/v0`)

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GloballyHubClient
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory (optional):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v0
```

If not provided, the application will default to `http://localhost:8080/api/v0`.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/     # Main dashboard page
│   │   ├── transactions/  # Transaction management
│   │   ├── blockchain/    # Blockchain explorer
│   │   └── layout.tsx     # Dashboard layout with sidebar
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects based on auth)
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── blockchain/        # Blockchain-related components
│   ├── layout/            # Layout components (Header, Sidebar)
│   ├── transactions/      # Transaction components
│   └── ui/                # Reusable UI components (shadcn/ui)
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useBlockchain.ts   # Blockchain operations hook
│   └── useWallet.ts       # Wallet operations hook
├── lib/                   # Utility libraries
│   ├── api/               # API client and endpoints
│   │   ├── auth.ts        # Authentication API
│   │   ├── blockchain.ts  # Blockchain API
│   │   ├── client.ts      # Axios client configuration
│   │   └── transactions.ts # Transactions API
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── providers/             # React providers
    ├── QueryProvider.tsx  # React Query provider
    └── ToasterProvider.tsx # Toast notifications provider
```

## API Configuration

The application connects to a backend API server. The default API base URL is `http://localhost:8080/api/v0`, but this can be configured via the `NEXT_PUBLIC_API_BASE_URL` environment variable.

The API client uses cookie-based authentication with credentials included in all requests.

## Features in Detail

### Authentication

- Users can register with a username and password
- Upon registration/login, users receive a wallet address
- Session is maintained via cookies
- Protected routes automatically redirect unauthenticated users

### Wallet Operations

- **View Balance**: See available and pending balances
- **Send Transactions**: Create transactions to other wallet addresses
- **Transaction History**: View paginated list of all transactions
- **Transaction Status**: Track pending and confirmed transactions

### Blockchain Explorer

- View all blocks in the blockchain
- See block details including hash, nonce, and transactions
- Mine new blocks to add pending transactions to the chain

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api/v0` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository or contact the development team.
