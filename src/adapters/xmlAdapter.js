const fs = require('fs');
const xml2js = require('xml2js');

const parseXML = async (filePath) => {
    const parser = new xml2js.Parser();
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            parser.parseString(data, (err, result) => {
                if (err) reject(err);
                // Transformar el resultado XML a la estructura deseada
                const transformedReadings = result.readings.reading.map(reading => ({
                    client: reading.$.clientID,
                    period: reading.$.period,
                    reading: parseFloat(reading._)
                }));
                resolve(transformedReadings);
            });
        });
    });
};

module.exports = { parseXML };
