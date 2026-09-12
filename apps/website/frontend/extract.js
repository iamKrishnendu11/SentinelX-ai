const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let match = content.match(/Action:\s*create_file\(([\s\S]*?)\)(?:\s*Observation:|$)/);
    if (match) {
        try {
            let jsonStr = match[1].trim();
            // Handle cases where the string might not be perfectly parsed due to newlines
            let parsed = JSON.parse(jsonStr);
            if (parsed.file_text !== undefined) {
                fs.writeFileSync(filePath, parsed.file_text, 'utf8');
                console.log('Cleaned', filePath);
            }
        } catch (e) {
            console.error('JSON parse error in', filePath, e.message);
        }
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    let list = fs.readdirSync(dir);
    for (let file of list) {
        let fullPath = path.join(dir, file);
        let stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else if (fullPath.match(/\.(jsx|js|css|html|tsx|ts)$/)) {
            processFile(fullPath);
        }
    }
}

walk(path.join(__dirname, 'landing-page'));
