# Task Management App

<h2 align="center">
  <img height="256" width="256" src="./src/assets/react.svg">
</h2>

<h3 align="center">A modern task management application built with React and Vite!</h3>

## 🚀 Features

- **Task Management**: Create, edit, delete, and organize tasks
- **Status Columns**: Drag and drop tasks between different status columns
- **Task Filtering**: Filter tasks by status, priority, and other criteria
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Seamless task updates without page refresh

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **React Icons** - Icon library
- **CKEditor 5** - Rich text editing
- **JSON Server** - Mock API for development

## 📦 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nguenl0c/my-clone-github.git
cd my-clone-github
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the JSON server (in another terminal):
```bash
npm run server
```

The app will be available at http://localhost:3001/

## 🔧 Available Scripts

- `npm run dev` - Starts development server at http://localhost:3001/
- `npm run build` - Builds for production, emitting to `dist/`
- `npm run preview` - Tests production build locally at http://localhost:4173/
- `npm run server` - Starts JSON server at http://localhost:3004/
- `npm run lint` - Runs ESLint to check code quality
- `npm run deploy` - Deploys to GitHub Pages

## 🚀 Deployment

### Automatic Deployment (Recommended)

This project is configured with GitHub Actions for automatic deployment to GitHub Pages:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy your app
3. Your app will be available at: `https://nguenl0c.github.io/my-clone-github/`

### Manual Deployment

To manually deploy to GitHub Pages:

```bash
npm run deploy
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── TaskCard.jsx
│   ├── TaskBoard.jsx
│   ├── StatusColumn.jsx
│   └── ...
├── context/             # React Context for state management
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── data/                # Static data and mock APIs
├── assets/              # Images, icons, and other assets
└── style.css           # Global styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3004
```

### Build Configuration

The project uses Vite for building. Key configurations in `vite.config.js`:

- Base path is automatically set for GitHub Pages deployment
- Dev server runs on port 3001
- Production builds are optimized for GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Troubleshooting

### Build Issues

If you encounter build issues on GitHub:

1. Check that all dependencies are properly listed in `package.json`
2. Ensure your Node.js version is 18 or higher
3. Verify that the build script runs locally: `npm run build`
4. Check GitHub Actions logs for specific error messages

### Common Issues

- **Port conflicts**: Change the port in `vite.config.js` if 3001 is occupied
- **JSON Server not running**: Make sure to run `npm run server` in a separate terminal
- **Build failures**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/nguenl0c/my-clone-github/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce
