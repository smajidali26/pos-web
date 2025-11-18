// Analytics Configuration

export const ANALYTICS_CONFIG = {
  // Auto-refresh intervals (in milliseconds)
  REFRESH_INTERVALS: {
    REALTIME_DASHBOARD: 30000, // 30 seconds
    SALES_ANALYTICS: 300000, // 5 minutes
    INVENTORY_ANALYTICS: 600000, // 10 minutes
    FORECASTS: 3600000, // 1 hour
  },

  // Cache durations (in milliseconds)
  CACHE_DURATIONS: {
    DASHBOARD: 300000, // 5 minutes
    SALES_ANALYTICS: 900000, // 15 minutes
    INVENTORY_ANALYTICS: 1800000, // 30 minutes
    ABC_ANALYSIS: 3600000, // 1 hour
    FORECASTS: 7200000, // 2 hours
  },

  // Default date ranges
  DATE_RANGES: {
    TODAY: () => {
      const today = new Date();
      return {
        startDate: new Date(today.setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date().toISOString(),
      };
    },
    YESTERDAY: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: new Date(yesterday.setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date(yesterday.setHours(23, 59, 59, 999)).toISOString(),
      };
    },
    LAST_7_DAYS: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      return {
        startDate: new Date(startDate.setHours(0, 0, 0, 0)).toISOString(),
        endDate: endDate.toISOString(),
      };
    },
    LAST_30_DAYS: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      return {
        startDate: new Date(startDate.setHours(0, 0, 0, 0)).toISOString(),
        endDate: endDate.toISOString(),
      };
    },
    LAST_90_DAYS: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);
      return {
        startDate: new Date(startDate.setHours(0, 0, 0, 0)).toISOString(),
        endDate: endDate.toISOString(),
      };
    },
    THIS_MONTH: () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      };
    },
    LAST_MONTH: () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    },
  },

  // Chart colors
  CHART_COLORS: {
    PRIMARY: 'rgb(75, 192, 192)',
    SECONDARY: 'rgb(54, 162, 235)',
    SUCCESS: 'rgb(75, 192, 192)',
    DANGER: 'rgb(255, 99, 132)',
    WARNING: 'rgb(255, 206, 86)',
    INFO: 'rgb(54, 162, 235)',
    PURPLE: 'rgb(153, 102, 255)',
    ORANGE: 'rgb(255, 159, 64)',

    // Alpha variants
    PRIMARY_ALPHA: 'rgba(75, 192, 192, 0.2)',
    SECONDARY_ALPHA: 'rgba(54, 162, 235, 0.2)',
    SUCCESS_ALPHA: 'rgba(75, 192, 192, 0.2)',
    DANGER_ALPHA: 'rgba(255, 99, 132, 0.2)',
    WARNING_ALPHA: 'rgba(255, 206, 86, 0.2)',
    INFO_ALPHA: 'rgba(54, 162, 235, 0.2)',
    PURPLE_ALPHA: 'rgba(153, 102, 255, 0.2)',
    ORANGE_ALPHA: 'rgba(255, 159, 64, 0.2)',

    // ABC Classes
    CLASS_A: 'rgb(75, 192, 192)',
    CLASS_B: 'rgb(255, 206, 86)',
    CLASS_C: 'rgb(255, 99, 132)',

    // Turnover Classifications
    FAST_MOVING: 'rgb(16, 185, 129)',
    NORMAL: 'rgb(59, 130, 246)',
    SLOW_MOVING: 'rgb(245, 158, 11)',
    DEAD_STOCK: 'rgb(239, 68, 68)',
  },

  // Chart defaults
  CHART_DEFAULTS: {
    HEIGHT: 300,
    FONT_SIZE: 12,
    ANIMATION_DURATION: 750,
    RESPONSIVE: true,
    MAINTAIN_ASPECT_RATIO: false,
  },

  // Forecast settings
  FORECAST: {
    DEFAULT_DAYS: 30,
    MAX_DAYS: 90,
    METHODS: [
      { value: 'AUTO', label: 'Auto (Recommended)' },
      { value: 'LINEAR', label: 'Linear Regression' },
      { value: 'MOVING_AVERAGE', label: 'Moving Average' },
      { value: 'EXPONENTIAL', label: 'Exponential Smoothing' },
    ],
    CONFIDENCE_LEVEL: 0.95,
  },

  // ABC Analysis settings
  ABC_ANALYSIS: {
    CLASS_A_THRESHOLD: 80, // 80% of revenue
    CLASS_B_THRESHOLD: 95, // 95% of revenue
    DEFAULT_PERIOD_DAYS: 90,
    STRATEGIES: {
      A: 'High-value items: Strict control, frequent monitoring, close supplier relationships',
      B: 'Medium-value items: Regular monitoring, standard control procedures',
      C: 'Low-value items: Simple controls, bulk ordering, periodic review',
    },
  },

  // Inventory turnover settings
  TURNOVER: {
    FAST_MOVING_THRESHOLD: 6, // turnover ratio >= 6
    NORMAL_THRESHOLD: 3, // 3 <= turnover ratio < 6
    SLOW_MOVING_THRESHOLD: 1, // 1 <= turnover ratio < 3
    DEFAULT_PERIOD_DAYS: 90,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // Export settings
  EXPORT: {
    FORMATS: ['CSV', 'PDF'],
    DEFAULT_FORMAT: 'CSV',
    FILENAME_PREFIX: 'analytics',
  },
};

export default ANALYTICS_CONFIG;
