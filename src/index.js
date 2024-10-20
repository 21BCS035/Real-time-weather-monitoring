import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Material-UI components
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme (with vibrant colors)
const theme = createTheme({
  palette: {
    background: {
      paper: '#ffffff', // Card background color
      default: '#f0f4f7', // App background color (light blueish)
    },
    primary: {
      main: '#1976d2', // Primary color (blue)
    },
    secondary: {
      main: '#ff4081', // Secondary color (pink)
    },
    text: {
      primary: '#212121', // Dark gray for primary text
      secondary: '#ffffff', // White for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif', // Set a global font family
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes styles across browsers */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
