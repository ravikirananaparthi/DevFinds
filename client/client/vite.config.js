import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path'; // Import resolve function to resolve file paths

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, // Use the PORT environment variable if available, otherwise default to 5173
    // host: '0.0.0.0', // Uncomment this line if you want to listen on all network interfaces
  },
  resolve: {
    alias: {
      // Set up aliases for environment variables to use them in your code
      'import.meta.env': resolve(process.cwd(), './.env'),
    },
  },
});
