# 🎮 SixyWin Frontend

A modern React-based virtual gaming platform frontend built with TypeScript, Vite, and Tailwind CSS. Features real-time WebSocket communication, comprehensive SEO optimization, and engaging gaming experiences with virtual rewards.

## 🚀 Features

### 🎯 Games

- **Virtual Lottery**: 6-number lottery system with daily draws and MegaPot jackpots
- **Aviator Crash Game**: Multiplier-based crash game with strategic cash-out mechanics
- **Double Trouble**: Fast-paced 30-second number prediction game with multiple betting options
- **Spin Wheel**: Daily bonus wheel with guaranteed virtual coin rewards

### 🔥 Core Features

- **Real-time WebSocket communication** for live game updates and instant results
- **Comprehensive SEO optimization** with dynamic meta tags and structured data
- **Progressive Web App (PWA)** with service worker caching and offline capabilities
- **Responsive design** optimized for mobile-first experience
- **Virtual coin system** with secure transaction management (no real money)
- **User authentication** (email/password + Google OAuth integration)
- **Performance monitoring** with Core Web Vitals tracking
- **Leaderboards** and detailed user statistics
- **Content-rich help system** with FAQ and game guides

### 📄 Content Pages

- **How to Play Guide**: Comprehensive tutorials for all games with strategies
- **FAQ System**: Detailed answers to common questions with structured data
- **About Us**: Platform information and mission statement
- **Contact Support**: User support and feedback system
- **Legal Pages**: Privacy Policy and Terms of Service

## 🛠️ Tech Stack

### Core Technologies

- **React 19.1.1** - Latest UI framework with concurrent features
- **TypeScript 5.8.3** - Full type safety and modern language features
- **Vite 7.1.0** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.3.5** - Utility-first CSS framework with custom design system

### State & Routing

- **Zustand 5.0.7** - Lightweight state management
- **React Router DOM 7.8.0** - Client-side routing with data loading
- **React Hook Form 7.62.0** - Performant form handling

### UI & Components

- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful icon library
- **Tailwind Animate** - Smooth animations and transitions
- **Embla Carousel** - Touch-friendly carousels

### Real-time & Performance

- **React Use WebSocket** - WebSocket integration with React
- **Service Workers** - Caching and offline functionality
- **Core Web Vitals Monitoring** - Performance tracking
- **Bundle Optimization** - Code splitting and lazy loading

### SEO & Analytics

- **Dynamic Meta Tags** - Page-specific SEO optimization
- **Structured Data (JSON-LD)** - Rich snippets for search engines
- **Open Graph & Twitter Cards** - Social media optimization
- **Google Analytics Integration** - User behavior tracking

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd frontend2

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APP_VERSION=1.0.0
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ads/            # Advertisement components
│   ├── aviator/        # Aviator crash game components
│   ├── double-trouble/ # Double Trouble game components
│   ├── landing/        # Landing page sections
│   ├── layout/         # Layout components (header, footer)
│   ├── play-lottery/   # Virtual lottery components
│   ├── shared/         # Shared components across games
│   │   ├── seo.tsx     # SEO component with meta tags
│   │   ├── seo-configs.ts # SEO configurations for all pages
│   │   ├── breadcrumb.tsx # Navigation breadcrumbs
│   │   ├── related-links.tsx # Internal linking component
│   │   └── countdown-timer.tsx # Reusable countdown timer
│   └── ui/             # Base UI components (Radix UI)
├── contexts/           # React contexts
│   └── WebSocketContext.tsx # WebSocket provider
├── hooks/              # Custom React hooks
│   ├── useWebSocket.ts # WebSocket connection management
│   └── useWebSocketHandlers.ts # Message handlers
├── libs/               # Utilities and constants
│   ├── interfaces.ts   # TypeScript interfaces
│   └── constants.ts    # App constants
├── pages/              # Page components
│   ├── Landing.tsx     # Homepage with SEO optimization
│   ├── PlayLottery.tsx # Virtual lottery game page
│   ├── Aviator.tsx     # Aviator crash game page
│   ├── DoubleTrouble.tsx # Double Trouble game page
│   ├── FAQ.tsx         # Frequently asked questions
│   ├── HowToPlay.tsx   # Game guides and tutorials
│   ├── AboutUs.tsx     # About page
│   ├── ContactUsPage.tsx # Contact form
│   └── NotFound.tsx    # Custom 404 page
├── store/              # Zustand state stores
│   └── websocketStore.ts # WebSocket state management
├── utils/              # Helper utilities
│   ├── performance.ts  # Core Web Vitals monitoring
│   ├── breadcrumb-utils.ts # Breadcrumb utilities
│   └── hmac.ts         # Security utilities
├── public/             # Static assets
│   ├── sitemap.xml     # SEO sitemap
│   ├── robots.txt      # Search engine directives
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service worker
└── main.tsx           # Application entry point
```

## 🎮 Game Components

### Play Lottery

- **Ticket Submission**: Number selection and betting interface
- **Latest Draw**: Real-time draw results and animations
- **Mega Pot**: Progressive jackpot display and management

### Double Trouble

- **Number Grid**: Interactive number selection
- **Range Bet Panel**: Range-based betting interface
- **Number Bet Panel**: Direct number betting
- **Countdown Timer**: Real-time game countdown
- **Current Bets**: Live betting display
- **Last Draw History**: Historical results

### Aviator

- **Game Display**: Visual game interface with animations
- **Bid Controls**: Betting controls and cash-out
- **History Panel**: Game history and statistics

## 🔌 WebSocket Integration

The application uses WebSocket for real-time communication:

```typescript
// WebSocket Context
const { socket, isConnected } = useWebSocketContext();

// Send messages
socket?.send(
  JSON.stringify({
    type: "PLACE_BET",
    data: { game: "double_trouble", amount: 100 },
  })
);

// Listen for updates
useEffect(() => {
  socket?.addEventListener("message", handleMessage);
}, [socket]);
```

## 🎨 Styling

### Design System

- **Tailwind CSS** for utility-first styling
- **Custom color palette** with gaming theme
- **Responsive breakpoints** for mobile-first design
- **Dark/Light mode** support (configurable)

### Component Styling

```typescript
// Example component with Tailwind classes
<div
  className="bg-gradient-to-r from-purple-600 to-blue-600 
                rounded-lg p-6 shadow-lg hover:shadow-xl 
                transition-all duration-300"
>
  <h2 className="text-2xl font-bold text-white mb-4">Game Title</h2>
</div>
```

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Component-based architecture**
- **Custom hooks** for reusable logic

### State Management

```typescript
// Zustand store example
interface GameStore {
  coins: number;
  currentGame: string;
  setCoins: (coins: number) => void;
  setCurrentGame: (game: string) => void;
}

const useGameStore = create<GameStore>((set) => ({
  coins: 0,
  currentGame: "",
  setCoins: (coins) => set({ coins }),
  setCurrentGame: (game) => set({ currentGame: game }),
}));
```

## 📱 Mobile Optimization

- **Responsive design** for all screen sizes
- **Touch-friendly** interfaces
- **Mobile-first** approach
- **PWA capabilities** for app-like experience

## 🔒 Security

- **HMAC authentication** for API requests
- **JWT token management**
- **Input validation** with Zod schemas
- **XSS protection** with proper sanitization
- **CSRF protection** via tokens

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

### Vercel Deployment

The project is configured for Vercel deployment with:

- **Automatic builds** on git push
- **Environment variables** configuration
- **Custom domain** support
- **CDN optimization**

### Build Output

```
dist/
├── assets/           # Compiled assets
├── index.html        # Entry HTML file
└── vite.svg         # Static assets
```

## 🔧 Configuration Files

- **vite.config.ts**: Vite build configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions
