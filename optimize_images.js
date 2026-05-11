const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to walk through directory
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

// Map to store old to new filename mapping
const replaceMap = {};

async function processImages() {
    const imagesDir = path.join(__dirname, 'images');
    const files = [];
    walkDir(imagesDir, (filepath) => {
        if (filepath.endsWith('.jpg') || filepath.endsWith('.png') || filepath.endsWith('.jpeg')) {
            files.push(filepath);
        }
    });

    console.log(`Found ${files.length} images to process.`);

    for (const file of files) {
        try {
            const ext = path.extname(file);
            const size = fs.statSync(file).size;
            
            // Only optimize images larger than 50KB
            if (size > 50 * 1024) {
                const newFile = file.replace(ext, '.webp');
                
                await sharp(file)
                    .webp({ quality: 80 })
                    .toFile(newFile);
                
                const oldRelative = file.split(path.sep + 'images' + path.sep)[1].replace(/\\/g, '/');
                const newRelative = newFile.split(path.sep + 'images' + path.sep)[1].replace(/\\/g, '/');
                
                replaceMap[`images/${oldRelative}`] = `images/${newRelative}`;
                console.log(`Converted ${oldRelative} to webp`);
            }
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    // Now update HTML files
    const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
    for (const htmlFile of htmlFiles) {
        let content = fs.readFileSync(htmlFile, 'utf8');
        let updated = false;
        
        for (const [oldPath, newPath] of Object.entries(replaceMap)) {
            // Use regex to replace globally
            const regex = new RegExp(oldPath.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            if (regex.test(content)) {
                content = content.replace(regex, newPath);
                updated = true;
            }
        }
        
        if (updated) {
            fs.writeFileSync(htmlFile, content, 'utf8');
            console.log(`Updated image links in ${htmlFile}`);
        }
    }
}

processImages();
