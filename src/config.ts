// Application configuration
const config = {
  // Currency settings - Pakistani Rupees
  CURRENCY_SYMBOL: 'Rs',
  CURRENCY_CODE: 'PKR',

  // API settings
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001',

  // App settings
  APP_NAME: 'POS System',
  APP_VERSION: '1.0.0',
};

export default config;
