const fs = require('fs');
const path = require('path');

function saveSVGFileInfo(folderPath, jsonDataFilePath) {
    const clothingData = {};

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        files.forEach(file => {
            if (path.extname(file) === '.svg') {
                const id = path.basename(file, '.svg').replace(/-svgrepo-com/g, '');
                const newFileName = id + '.svg';
                const url = `/clothingitems/${newFileName}`;
                const description = `${id}`;

                clothingData[id] = { url, description };

                // Rename the file
                fs.rename(path.join(folderPath, file), path.join(folderPath, newFileName), err => {
                    if (err) {
                        console.error('Error renaming file:', err);
                        return;
                    }
                });
            }
        });

        fs.writeFile(jsonDataFilePath, JSON.stringify(clothingData, null, 2), err => {
            if (err) {
                console.error('Error writing JSON data:', err);
                return;
            }
            console.log('SVG file information saved successfully.');
        });
    });
}

saveSVGFileInfo('./clothingitems', './clothingData.json');
