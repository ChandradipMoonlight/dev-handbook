# Dev Handbook

A responsive educational website built with React, TypeScript, Vite, and Tailwind CSS. Learn programming languages, data structures & algorithms, system design, and interview preparation with simple explanations and real-world examples.

## Features

- 📚 **Comprehensive Tutorials**: Java, Python, and more programming languages
- 📊 **DSA Concepts**: Arrays, Linked Lists, and other data structures
- 🏗️ **System Design**: Learn to design scalable systems
- 🎯 **Interview Prep**: Common questions and solutions
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop
- 🎨 **Modern UI**: Clean and intuitive interface with Tailwind CSS
- 💻 **Syntax Highlighting**: Code examples with proper highlighting
- 📑 **Table of Contents**: Auto-generated TOC for easy navigation

## Tech Stack

- **React 18.3+** - UI framework
- **TypeScript 5.5+** - Type safety
- **Vite 5.4+** - Build tool
- **Tailwind CSS 3.4+** - Styling
- **React Router 6.26+** - Routing
- **react-markdown 9.0+** - Markdown rendering
- **react-syntax-highlighter 15.5+** - Code highlighting

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dev-handbook
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
dev-handbook/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout/     # Header, Sidebar, Footer
│   │   └── Content/    # MarkdownRenderer, CodeBlock, TOC
│   ├── content/        # Markdown tutorial files
│   │   ├── languages/  # Programming language tutorials
│   │   ├── dsa/        # Data structures & algorithms
│   │   ├── system-design/  # System design concepts
│   │   └── interview/  # Interview preparation
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Adding New Content

1. Create a new markdown file in the appropriate directory under `src/content/`
2. Update `src/utils/contentIndex.ts` to include the new content
3. The content will automatically appear in the navigation

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dev-handbook.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Automatic Deployment**:
   - The workflow will automatically deploy when you push to the `main` branch
   - Your site will be available at: `https://YOUR_USERNAME.github.io/dev-handbook/`

### Manual Deployment

If you want to deploy manually:

```bash
npm run build:gh-pages
```

Then push the `dist` folder to the `gh-pages` branch (though the GitHub Actions workflow handles this automatically).

### Custom Domain

If you want to use a custom domain:
1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure your DNS settings as per GitHub Pages documentation

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
