const fs = require('fs');
const csv = require('csv-parser');

const backgroundColor = [
  'rgba(162, 70, 127, 0.35)',
  'rgba(155, 190, 79, 0.35)',
  'rgba(40, 105, 50, 0.35)',
  'rgba(32, 98, 219, 0.35)',
  'rgba(74, 201, 183, 0.35)',
  'rgba(202, 143, 61, 0.35)',
  'rgba(156, 243, 121, 0.35)',
  'rgba(112, 26, 175, 0.35)',
  'rgba(165, 191, 222, 0.35)',
  'rgba(29, 145, 137, 0.35)',
  'rgba(108, 166, 39, 0.35)',
  'rgba(220, 159, 29, 0.35)'
]

async function csvToJson(csvFilePath) {
  return new Promise((resolve, reject) => {
    const labels = [];
    const data = [];
    const extra = {};


    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        try{
          const colourLabel = Object.keys(row)[2];
          const valueLabel = Object.keys(row)[1];
          const firstLabel = Object.keys(row)[0];
          labels.push(row[firstLabel]);
          let temp = Number.parseFloat(row[valueLabel].replace(',', '.'))
          console.log(temp, isNaN(temp));
          if(temp === undefined || isNaN(temp)) {
            console.log(temp, 'NaN');
            reject('CSV file corrupt');
          }
          data.push(temp);
        } catch(err) {
          console.log(err);
          reject('Check CSV first')
        }
      })
      .on('end', () => {
        resolve({ labels, datasets: [{ data, backgroundColor }] });
      })
      .on('error', (error) => {
        console.log('Houston, problem');
        reject(error);
      })
  })
}
module.exports = csvToJson;