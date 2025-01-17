const fs = require('fs');
const pdf = require('pdf-parse');

const files = fs.readdirSync('./downloads').map(f => `./downloads/${f}`);

async function parseCornPDF(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        const text = data.text;

        const result = {
            name: '',
            crop: '',
            maturity: '',
            trait: '',
            strengthAndManagement: [],
            characteristics: {},
            agronomics: {},
            diseaseTolerance: {},
            herbicide: {}
        };

        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        // Extract basic information
        result.name = lines.find(line => line.match(/^DKC\d+-\d+RIB$/));
        result.crop = lines.find(line => line.match(/^Corn$/));
        result.maturity = lines.find(line => /^\d+$/.test(line));
        result.trait = lines.find(line => line.match(/^VT2PRIB$/));

        let currentSection = '';
        
        function parseValue(value) {
            // If the value is numeric, convert it to a number
            if (/^\d+$/.test(value)) {
                return parseInt(value);
            }
            return value;
        }

        function processLine(line, section) {
            // Handle special cases for characteristics section
            if (section === 'characteristics') {
                if (line.startsWith('Gdus to mid-pollination')) {
                    const value = line.match(/\d+$/)?.[0];
                    if (value) result.characteristics['gdus to mid-pollination'] = parseValue(value);
                    return;
                }
                if (line.startsWith('Gdus to black layer')) {
                    const value = line.match(/\d+$/)?.[0];
                    if (value) result.characteristics['gdus to black layer'] = parseValue(value);
                    return;
                }
                if (line.startsWith('Value added trait')) {
                    const value = line.split('Value added trait')?.[1]?.trim();
                    if (value) result.characteristics['value added trait'] = value;
                    return;
                }
                if (line.startsWith('Relative maturity')) {
                    const value = line.match(/\d+$/)?.[0];
                    if (value) result.characteristics['relative maturity'] = parseValue(value);
                    return;
                }
                if (line.startsWith('Planting rate')) {
                    const value = line.split('Planting rate')?.[1]?.trim();
                    if (value) result.characteristics['planting rate'] = value;
                    return;
                }
                if (line.startsWith('New product')) {
                    const value = line.split('New product')?.[1]?.trim();
                    if (value) result.characteristics['new product'] = value;
                    return;
                }
                if (line.startsWith('Variety')) {
                    const value = line.split('Variety')?.[1]?.trim();
                    if (value) result.characteristics['variety'] = value;
                    return;
                }
                if (line.startsWith('Cob color')) {
                    const value = line.split('Cob color')?.[1]?.trim();
                    if (value) result.characteristics['cob color'] = value;
                    return;
                }
                if (line.startsWith('Kernel cap color')) {
                    const value = line.split('Kernel cap color')?.[1]?.trim();
                    if (value) result.characteristics['kernel cap color'] = value;
                    return;
                }
                if (line.startsWith('Kernel row')) {
                    const value = line.match(/\d+$/)?.[0];
                    if (value) result.characteristics['kernel row'] = parseValue(value);
                    return;
                }
            }

            // Handle other sections
            const parts = line.split(/(?=[0-9A-Z-])/).map(part => part.trim());
            if (parts.length >= 2) {
                const key = parts[0].toLowerCase();
                const value = parseValue(parts[parts.length - 1]);
                
                switch(section) {
                    case 'agronomics':
                        result.agronomics[key] = value;
                        break;
                    case 'diseaseTolerance':
                        result.diseaseTolerance[key] = value;
                        break;
                    case 'herbicide':
                        result.herbicide[key] = value;
                        break;
                }
            }
        }

        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === 'STRENGTH AND MANAGEMENT') {
                i++;
                while (i < lines.length && lines[i].startsWith('•')) {
                    result.strengthAndManagement.push(lines[i].substring(2).trim());
                    i++;
                }
            }

            if (lines[i] === 'CHARACTERISTICS') {
                currentSection = 'characteristics';
                i++;
                while (i < lines.length && !['AGRONOMICS', 'DISEASE TOLERANCE', 'HERBICIDE'].includes(lines[i])) {
                    if (lines[i]) {
                        processLine(lines[i], currentSection);
                    }
                    i++;
                }
            }

            if (lines[i] === 'AGRONOMICS') {
                currentSection = 'agronomics';
                i++;
                while (i < lines.length && !['DISEASE TOLERANCE', 'HERBICIDE'].includes(lines[i])) {
                    if (lines[i]) {
                        processLine(lines[i], currentSection);
                    }
                    i++;
                }
            }

            if (lines[i] === 'DISEASE TOLERANCE') {
                currentSection = 'diseaseTolerance';
                i++;
                while (i < lines.length && !['HERBICIDE'].includes(lines[i])) {
                    if (lines[i]) {
                        processLine(lines[i], currentSection);
                    }
                    i++;
                }
            }

            if (lines[i] === 'HERBICIDE') {
                currentSection = 'herbicide';
                i++;
                while (i < lines.length && lines[i] !== '*Key') {
                    if (lines[i]) {
                        processLine(lines[i], currentSection);
                    }
                    i++;
                }
            }
        }

        return result;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw error;
    }
}

async function processAllFiles() {
    const allData = {};
    
    for (const file of files) {
        try {
            console.log(`Processing ${file}...`);
            const data = await parseCornPDF(file);
            if (data.name) {
                allData[data.name] = data;
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
    
    try {
        fs.writeFileSync('data.json', JSON.stringify(allData, null, 2));
        console.log('Successfully wrote data.json');
    } catch (error) {
        console.error('Error writing data.json:', error);
    }
}

processAllFiles().catch(console.error);
