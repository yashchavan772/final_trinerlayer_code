# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## OpenAI Integration

TrinetLayer now includes OpenAI-powered content generation for vulnerability educational content.

### Features

- **AI-Enhanced Content Generation**: Automatically generate engaging 40% theory / 60% practical vulnerability narratives
- **Story-Driven Learning**: Real-world scenarios with beginner-friendly explanations
- **Structured Output**: Consistent content format across all vulnerability sections
- **GPT-5 Powered**: Utilizes OpenAI's latest GPT-5 model for superior reasoning and educational content

### Setup

1. Add your OpenAI API key to `.env`:
```bash
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

2. The system uses GPT-5 by default for best results
3. Content generation happens on-demand through the UI

### Usage

The AI content generator is available on vulnerability detail pages:

1. Click "AI-Enhanced Content" button
2. Click "Generate Content" to create educational content
3. AI generates structured content following the 40/60 theory/practical approach

### Content Generation API

```javascript
import { useVulnerabilityContentGenerator } from './hooks/useVulnerabilityContentGenerator';

const { generateSection, isGenerating, error } = useVulnerabilityContentGenerator();

// Generate specific section
const content = await generateSection({
  vulnerabilityType: 'SQL Injection',
  section: 'explanation'
});

// Generate complete vulnerability documentation
const completeContent = await generateComplete('XSS');
```

### Error Handling

The system includes comprehensive error handling for:
- Authentication errors (invalid API key)
- Rate limiting (usage quota)
- Network issues
- Internal server errors

All errors are logged appropriately and user-friendly messages are displayed.

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Powered by React and Vite
- Styled with Tailwind CSS
- FastAPI Backend with Python

Built with ❤️ by the TrinetLayer Team