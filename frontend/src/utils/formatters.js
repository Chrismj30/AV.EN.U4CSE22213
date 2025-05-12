export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const formatCorrelation = (correlation) => {
  return correlation.toFixed(4);
};

export const getCorrelationColor = (correlation) => {
  // Color scale from red (negative) to white (neutral) to blue (positive)
  if (correlation === 1) return '#0000FF'; // Perfect positive correlation (blue)
  if (correlation > 0) {
    const intensity = Math.floor(correlation * 255);
    return `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
  }
  if (correlation < 0) {
    const intensity = Math.floor(Math.abs(correlation) * 255);
    return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
  }
  return '#FFFFFF'; // Zero correlation (white)
}; 