# React App Frontend

A production-ready React 18 frontend boilerplate with TypeScript, Vite, TailwindCSS, and React Router v6+.

## 🚀 Features

- **React 18** with modern hooks and concurrent features
- **TypeScript** for type safety and better developer experience
- **Vite** for fast development and optimized builds
- **TailwindCSS** for utility-first styling
- **React Router v6+** for client-side routing
- **WebSocket Integration** for real-time communication
- **Centralized API Configuration** with TypeScript interfaces
- **Authentication Context** with mock login/logout functionality
- **Protected Routes** for secure access control
- **Responsive Design** with mobile-first approach
- **Vercel Ready** with proper SPA routing configuration

## 📁 Project Structure

```
src/
├── api/                 # API configuration and client
│   └── index.ts        # Centralized API setup
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   └── ProtectedRoute.tsx # Route protection
├── constants/          # Application constants
│   ├── messages.ts     # Centralized text messages
│   └── routes.ts       # Route definitions
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login form
│   ├── Register.tsx    # Registration form
│   └── Dashboard.tsx   # Protected dashboard
├── types/              # TypeScript interfaces
│   └── interfaces.ts   # Centralized type definitions
├── websocket/          # WebSocket configuration
│   └── index.ts        # WebSocket client setup
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with TailwindCSS
```

## 🛠️ Tech Stack

- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety
- **Vite 4.5.0** - Build tool and dev server
- **TailwindCSS 3.3.5** - CSS framework
- **React Router 6.20.1** - Client-side routing
- **PostCSS 8.4.31** - CSS processing
- **ESLint** - Code linting

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

### API Configuration

The API client is configured in `src/api/index.ts` with:
- Base URL configuration
- Authentication token handling
- Request/response interceptors
- Error handling

### WebSocket Configuration

WebSocket client is set up in `src/websocket/index.ts` with:
- Automatic reconnection
- Event-based messaging
- Connection status monitoring
- Convenience methods for common operations

## 🎨 Styling

The project uses TailwindCSS with:
- Custom color palette (primary colors)
- Responsive design utilities
- Custom component classes
- Consistent spacing and typography

### Custom CSS Classes

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card component styling

## 🔐 Authentication

The authentication system includes:
- **AuthContext** for state management
- **Mock login/logout** functionality
- **Protected routes** with automatic redirects
- **Token-based** authentication (localStorage)
- **Loading states** and error handling

### Demo Credentials

For testing purposes, you can use any email and password:
- **Email:** demo@example.com
- **Password:** password123

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized navigation for mobile devices

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment with:
- `vercel.json` configuration
- SPA routing support
- Build optimization
- Environment variable support

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🔧 Development

### Code Organization

- **Components** are organized by feature
- **Types** are centralized in `src/types/interfaces.ts`
- **Constants** are grouped by purpose
- **Messages** are internationalization-ready

### Best Practices

- Use TypeScript interfaces for all data structures
- Implement proper error handling
- Follow React hooks best practices
- Use semantic HTML elements
- Maintain consistent naming conventions

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update documentation as needed
4. Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Built with ❤️ using modern web technologies** 