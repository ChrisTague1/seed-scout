const fs = require('fs');
const pdf = require('pdf-parse');

const files = fs.readdirSync('./downloads').map(f => `./downloads/${f}`);
const file = files[0];

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
            const line = lines[i].trim();
            
            if (line === 'CROP') {
                cornData.crop = lines[i + 1];
            }
            if (line === 'MATURITY') {
                cornData.maturity = lines[i + 1];
            }
            if (line === 'TRAIT') {
                cornData.trait = lines[i + 1];
            }
        }

        // Get Strength and Management section
        let managementIndex = lines.findIndex(line => line === 'STRENGTH AND MANAGEMENT');
        if (managementIndex !== -1) {
            let i = managementIndex + 1;
            while (i < lines.length && !lines[i].includes('CHARACTERISTICS')) {
                if (lines[i].startsWith('•')) {
                    cornData.strengthAndManagement.push(
                        lines[i].replace('•', '').trim()
                    );
                }
                i++;
            }
        }

        // Get sections
        let currentSection = '';
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for section headers
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

            // Skip empty lines, headers, and key explanations
            if (!line || line.includes('*Key') || line.includes('Poor') || 
                line === 'Page 1 of 2' || line === 'Page 2 of 2') {
                continue;
            }

            // Process line based on current section
            if (currentSection) {
                // Split the line into key and value, handling numeric values at the end
                const matches = line.match(/^(.*?)\s*(\d+)$/);
                if (matches) {
                    const [_, key, value] = matches;
                    
                    switch (currentSection) {
                        case 'characteristics':
                            cornData.characteristics[key.trim()] = value;
                            break;
                        case 'agronomics':
                            cornData.agronomics[key.trim()] = parseInt(value);
                            break;
                        case 'diseaseTolerance':
                            cornData.diseaseTolerance[key.trim()] = parseInt(value);
                            break;
                    }
                } else if (currentSection === 'herbicide' && line.includes('sensitivity')) {
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

async function processAllFiles() {
    const allData = {};
    
    // Process each file
    for (const file of files) {
        try {
            console.log(`Processing ${file}...`);
            const data = await parseCornPDF(file);
            // Use the name as the key in the object
            if (data.name) {
                allData[data.name] = data;
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
    
    // Write to data.json
    try {
        fs.writeFileSync('data.json', JSON.stringify(allData, null, 2));
        console.log('Successfully wrote data.json');
    } catch (error) {
        console.error('Error writing data.json:', error);
    }
}

// Run the processing
processAllFiles().catch(console.error);
