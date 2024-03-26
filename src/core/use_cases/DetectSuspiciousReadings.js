const { calculateMedian } = require('../../utils/calculateMedian');

function detectSuspiciousReadings(readings) {
  // Agrupar lecturas por cliente
  const readingsByClient = readings.reduce((acc, reading) => {
    if (!acc[reading.clientId]) {
      acc[reading.clientId] = [];
    }
    acc[reading.clientId].push(reading);
    return acc;
  }, {});

  const suspiciousReadings = [];

  Object.entries(readingsByClient).forEach(([clientId, readings]) => {
    // Calcular la mediana de las lecturas para el cliente actual
    const median = calculateMedian(readings.map(reading => reading.value));

    // Filtrar lecturas que sean sospechosas (mediana anual más menos 50%)
    readings.                      forEach(reading => {
      const deviation = Math.abs(reading.value - median);
      if (deviation / median > 0.5) {
        suspiciousReadings.push({
          client: clientId,
          month: reading.month,
          suspicious: reading.value,
          median
        });
      }
    });
  });

  return suspiciousReadings;
}

module.exports = { detectSuspiciousReadings };
