const fs = require('fs');
const pdf = require('pdf-parse');

const files = fs.readdirSync('./downloads').map(f => `./downloads/${f}`);

const file = files[0]

async function parseCornPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
        const data = await pdf(dataBuffer);
        const text = data.text;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        const cornData = {
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

        // Get name (it's usually the first non-empty line)
        cornData.name = lines[0];

        // Find basic info
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.startsWith('CROP')) {
                cornData.crop = lines[i + 1];
            }
            if (line.startsWith('MATURITY')) {
                cornData.maturity = lines[i + 1];
            }
            if (line.startsWith('TRAIT')) {
                cornData.trait = lines[i + 1];
            }
        }

        // Get Strength and Management section
        let managementIndex = lines.findIndex(line => line.includes('STRENGTH AND MANAGEMENT'));
        if (managementIndex !== -1) {
            while (lines[++managementIndex] && !lines[managementIndex].includes('CHARACTERISTICS')) {
                if (lines[managementIndex].startsWith('•')) {
                    cornData.strengthAndManagement.push(
                        lines[managementIndex].replace('•', '').trim()
                    );
                }
            }
        }

        // Get Characteristics section
        let currentSection = '';
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line === 'CHARACTERISTICS') {
                currentSection = 'characteristics';
                continue;
            } else if (line === 'AGRONOMICS') {
                currentSection = 'agronomics';
                continue;
            } else if (line === 'DISEASE TOLERANCE') {
                currentSection = 'diseaseTolerance';
                continue;
            } else if (line === 'HERBICIDE') {
                currentSection = 'herbicide';
                continue;
            }

            if (currentSection === 'characteristics') {
                if (line.includes('Gdus') || line.includes('Value') || 
                    line.includes('Relative') || line.includes('Planting') ||
                    line.includes('New product') || line.includes('Variety') ||
                    line.includes('Cob color') || line.includes('Kernel')) {
                    const parts = line.split(/\s+/);
                    const value = parts.pop();
                    const key = parts.join(' ');
                    if (key && value) {
                        cornData.characteristics[key] = value;
                    }
                }
            } else if (currentSection === 'agronomics') {
                if (line && !line.includes('*Key') && !line.includes('Poor')) {
                    const parts = line.split(/\s+/);
                    const value = parts.pop();
                    const key = parts.join(' ');
                    if (key && value && !isNaN(value)) {
                        cornData.agronomics[key] = parseInt(value);
                    }
                }
            } else if (currentSection === 'diseaseTolerance') {
                if (line && !line.includes('*Key') && !line.includes('Poor')) {
                    const parts = line.split(/\s+/);
                    const value = parts.pop();
                    const key = parts.join(' ');
                    if (key && value && !isNaN(value)) {
                        cornData.diseaseTolerance[key] = parseInt(value);
                    }
                }
            } else if (currentSection === 'herbicide') {
                if (line && !line.includes('*Key') && !line.includes('Poor')) {
                    const parts = line.split(/\s+/);
                    const value = parts.pop();
                    const key = parts.join(' ');
                    if (key && value) {
                        cornData.herbicide[key] = value;
                    }
                }
            }
        }

        return cornData;
    } catch (error) {
        console.error(`Error parsing PDF ${filePath}:`, error);
        throw error;
    }
}

parseCornPDF(file).then(console.log).catch(console.log);

