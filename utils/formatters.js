// Format currency with specified locale and currency code
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Format percentage values
  export const formatPercentage = (value, digits = 2) => {
    return `${value.toFixed(digits)}%`;
  };
  
  // Format large numbers with K, M, B suffixes
  export const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toFixed(2);
  };
  
  // Format date to readable format
  export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate percentage change between two values
  export const calculatePercentageChange = (currentValue, previousValue) => {
    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  };
  
  // Determine color based on value (for profit/loss indicators)
  export const getProfitLossColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };
  
  // Format number with specified decimal points
  export const formatWithDecimals = (value, decimals = 2) => {
    return parseFloat(value).toFixed(decimals);
  };
  
  // Shorten wallet address for display
  export const shortenAddress = (address, chars = 4) => {
    if (!address) return '';
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
  };