const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');
const csvtojson = require(path.join(__dirname, 'csvtojson.js'));
const fs = require('fs');


const width = 1080;
const height = 720;
// Chart.js configuration
async function producejpg(csvpath, destpath) {
    const data = await csvtojson(csvpath);
    const configuration = {
        type: 'polarArea',
        data: data
    };
    const backgroundColour = 'white';

    const canvas = new ChartJSNodeCanvas({ width: width, height: height, backgroundColour });

    const image = await canvas.renderToBufferSync(configuration, 'image/png');

    fs.writeFileSync(destpath, image);
}

async function producehtml(csvpath, destpath) {
    const data = await csvtojson(csvpath);
    const configuration = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true
        }
    };
    
    const backgroundColour = 'white';

    const canvas = new ChartJSNodeCanvas({type:'svg', width: width, height: height, backgroundColour });

    const image = await canvas.renderToBufferSync(configuration, 'image/svg+xml');

    fs.writeFileSync(destpath, image);
}

async function producesvg(csvpath, destpath) {
    const data = await csvtojson(csvpath);
    const configuration = {
        type: 'polarArea',
        data: data
    };
    const backgroundColour = 'white';

    const canvas = new ChartJSNodeCanvas({type:'svg', width: width, height: height, backgroundColour });

    const image = await canvas.renderToBufferSync(configuration, 'image/svg+xml');

    fs.writeFileSync(destpath, image);
}

async function producepdf(csvpath, destpath) {
    const data = await csvtojson(csvpath);
    const configuration = {
        type: 'polarArea',
        data: data
    };
    const backgroundColour = 'white';

    const canvas = new ChartJSNodeCanvas({type:'pdf', width: width, height: height, backgroundColour });

    const image = await canvas.renderToBufferSync(configuration, 'application/pdf');

    fs.writeFileSync(destpath, image);
}


async function produceThumbnail(filepath, thumbnailPath) {
    const data = await csvtojson(filepath);
    const configuration = {
        type: 'polarArea',
        data: data
    };
    const backgroundColour = 'white';

    const canvas = new ChartJSNodeCanvas({ width: 480, height: 320, backgroundColour });

    const image = canvas.renderToBufferSync(configuration, 'image/jpeg');

    fs.writeFileSync(thumbnailPath, image);
}

module.exports = { producejpg, producehtml, producesvg, producepdf, produceThumbnail };