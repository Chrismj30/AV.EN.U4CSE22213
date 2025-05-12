function calculateAverage(values) {
  if (!values || values.length === 0) {
    return 0;
  }
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

function calculateCovariance(xValues, yValues) {
  if (!xValues || !yValues || xValues.length === 0 || yValues.length === 0 || xValues.length !== yValues.length) {
    return 0;
  }

  const xMean = calculateAverage(xValues);
  const yMean = calculateAverage(yValues);
  
  let sum = 0;
  for (let i = 0; i < xValues.length; i++) {
    sum += (xValues[i] - xMean) * (yValues[i] - yMean);
  }
  
  return sum / (xValues.length - 1);
}

function calculateStandardDeviation(values) {
  if (!values || values.length <= 1) {
    return 0;
  }
  
  const mean = calculateAverage(values);
  
  let sumSquaredDiff = 0;
  for (let i = 0; i < values.length; i++) {
    sumSquaredDiff += Math.pow(values[i] - mean, 2);
  }
  
  return Math.sqrt(sumSquaredDiff / (values.length - 1));
}

function calculateCorrelation(xValues, yValues) {
  if (!xValues || !yValues || xValues.length <= 1 || yValues.length <= 1 || xValues.length !== yValues.length) {
    return 0;
  }
  
  const covariance = calculateCovariance(xValues, yValues);
  const xStdDev = calculateStandardDeviation(xValues);
  const yStdDev = calculateStandardDeviation(yValues);
  
  if (xStdDev === 0 || yStdDev === 0) {
    return 0;
  }
  
  return covariance / (xStdDev * yStdDev);
}

module.exports = {
  calculateAverage,
  calculateCovariance,
  calculateStandardDeviation,
  calculateCorrelation
}; 