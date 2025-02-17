# Chess vs AI

![Chess vs AI](https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=1200&h=400)

A modern, responsive chess application built with React and TypeScript, featuring an AI opponent and a beautiful, interactive interface.

![App Preview](https://imgur.com/wDqhhn0.png)

## ✨ Features

- 🎮 Play against an AI opponent
- 🔄 Automatic role switching between White and Black pieces
- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- 🎯 Move validation and legal move highlighting
- 📝 Detailed move history with analysis
- 💾 Local game state persistence
- 🏆 Player statistics tracking
- 🔍 Right-click square highlighting for strategy planning
- ⚡ Fast and smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **chess.js** - Chess move validation and game state management
- **react-chessboard** - Chess board visualization
- **Lucide React** - Modern icon library

### Development Tools
- ESLint - Code linting
- Prettier - Code formatting
- PostCSS - CSS processing
- Autoprefixer - CSS vendor prefixing

## 🎯 Technical Highlights

### State Management
- Custom React hooks for game state management
- Local storage integration for game persistence
- Efficient state updates with React's useState and useEffect

### Performance Optimizations
- Lazy loading and code splitting
- Memoized components and callbacks
- Efficient re-rendering strategies
- Optimized asset loading

### User Experience
- Smooth animations and transitions
- Responsive design for all screen sizes
- Intuitive drag-and-drop interface
- Accessible color schemes
- Clear visual feedback for moves and game state

### Code Quality
- Strong TypeScript typing
- Component-based architecture
- Clean and maintainable code structure
- Comprehensive error handling
- Modern ES6+ features

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/chess-vs-ai.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Project Structure

```
src/
├── components/          # React components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🎨 Features in Detail

### AI Opponent
- Implements chess engine for move generation
- Evaluates board positions
- Makes strategic decisions

### Game State Management
- FEN string parsing and generation
- Move validation and generation
- Game history tracking
- State persistence

### User Interface
- Responsive chess board
- Move highlighting
- Piece animations
- Game controls
- Statistics display

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

Created with ♟️ by [Your Name]

---

<p align="center">Made with ❤️ and React</p>