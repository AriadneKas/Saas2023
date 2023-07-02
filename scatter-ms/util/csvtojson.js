const fs = require('fs');
const csv = require('csv-parser');


const backgroundColor =  [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',  
] //add colours later

async function csvToJson(csvFilePath) {
  return new Promise((resolve, reject) => {
    const labels = [];
    const data = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const valueLabel = Object.keys(row)[1];
        labels.push(row['Labels']);
        data.push(Number.parseFloat(row[valueLabel].replace(',', '.')));
      })
      .on('end', () => {
        resolve({ labels, datasets: [{ data, backgroundColor }] });
      })
      .on('error', (error) => {
        reject(error);
      });
  })
}
module.exports = csvToJson;