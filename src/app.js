const { parseCSV } = require('./adapters/csvAdapter');
const { parseXML } = require('./adapters/xmlAdapter');
const { detectSuspiciousReadings } = require('./core/use_cases/DetectSuspiciousReadings');
const path = require('path');

const filePath = process.argv[2];

const processFile = async (filePath) => {
    let readings = [];
    if (!filePath) {
        console.error('No file path provided');
        return;
    }
    if (filePath.endsWith('.csv')) {
        readings = await parseCSV(filePath);
    } else if (filePath.endsWith('.xml')) {
        readings = await parseXML(filePath);
    } else {
        console.error('Unsupported file format');
        return;
    }

    // Convertimos los datos a un formato uniforme si es necesario
    const standardizedReadings = readings.map(reading => ({
        clientId: reading.client,
        month: reading.period,
        value: parseFloat(reading.reading)
    }));

    const suspiciousReadings = detectSuspiciousReadings(standardizedReadings);

// Mostramos los resultados
console.log('| Client            | Month     | Suspicious  | Median    |');
console.log('---------------------------------------------------------');
suspiciousReadings.forEach(reading => {
    const clientPadded = reading.client.padEnd(18, ' '); // Asegura que el campo tenga 18 caracteres
    const monthPadded = reading.month.padEnd(10, ' '); // Asegura que el campo tenga 10 caracteres
    const suspiciousPadded = reading.suspicious.toString().padEnd(12, ' '); // Asegura que el campo tenga 12 caracteres
    const medianPadded = reading.median.toString().padEnd(10, ' '); // Asegura que el campo tenga 10 caracteres
    console.log(`| ${clientPadded}| ${monthPadded}| ${suspiciousPadded}| ${medianPadded}|`);
});

};

processFile(filePath).catch(console.error);
