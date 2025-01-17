const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function downloadPDF() {
    const downloadPath = path.join(__dirname, 'downloads');
    console.log(`Setting up download directory at: ${downloadPath}`);
    
    if (!fs.existsSync(downloadPath)) {
        console.log('Downloads directory does not exist, creating it...');
        fs.mkdirSync(downloadPath);
        console.log('Downloads directory created successfully');
    } else {
        console.log('Downloads directory already exists');
    }

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser launched successfully');

    let page;
    try {
        console.log('Creating new page...');
        page = await browser.newPage();
        console.log('Page created successfully');

        console.log('Configuring download behavior...');
        const client = await page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath
        });
        console.log('Download behavior configured');

        console.log('Navigating to webpage...');
        const response = await page.goto('https://www.cropscience.bayer.us/d/dekalb-dkc081-18rib-corn', {
            waitUntil: 'domcontentloaded',
        });
        console.log(`Page loaded with status: ${response.status()}`);

        console.log('Waiting for Download PDF button to be available...');
        const downloadButton = await page.waitForSelector('button.Overview_download-button__zOUg6', {
            timeout: 10000,
            visible: true
        });
        console.log('Download button found');

        console.log('Getting button text...');
        const buttonText = await page.evaluate(button => button.textContent, downloadButton);
        console.log(`Button text: "${buttonText}"`);

        console.log('Checking if button is visible and clickable...');
        const buttonBox = await downloadButton.boundingBox();
        console.log(`Button position: x=${buttonBox.x}, y=${buttonBox.y}, width=${buttonBox.width}, height=${buttonBox.height}`);

        console.log('Attempting to click download button...');
        await downloadButton.click();
        console.log('Button clicked successfully');

        console.log('Waiting for download to initiate...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Checking downloads directory for new files...');
        const filesBeforeWait = fs.readdirSync(downloadPath);
        console.log(`Files in download directory before wait: ${filesBeforeWait.join(', ') || 'none'}`);

        console.log('Waiting for download to complete...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const filesAfterWait = fs.readdirSync(downloadPath);
        console.log(`Files in download directory after wait: ${filesAfterWait.join(', ') || 'none'}`);

        const newFiles = filesAfterWait.filter(file => !filesBeforeWait.includes(file));
        if (newFiles.length > 0) {
            console.log(`New files downloaded: ${newFiles.join(', ')}`);
        } else {
            console.log('No new files detected in downloads directory');
        }

    } catch (error) {
        console.error('An error occurred:', error);
        console.log('Error stack trace:', error.stack);
        
        if (page) {
            console.log('Taking error screenshot...');
            await page.screenshot({ 
                path: 'error.png',
                fullPage: true 
            });
            console.log('Error screenshot saved as error.png');

            console.log('Capturing page HTML at time of error...');
            const html = await page.content();
            fs.writeFileSync('error.html', html);
            console.log('Page HTML saved as error.html');
        }
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
            console.log('Browser closed successfully');
        }
    }
}

async function downloadWithRetry(maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        console.log(`\nStarting download attempt ${i + 1} of ${maxRetries}`);
        try {
            await downloadPDF();
            console.log(`Attempt ${i + 1} completed successfully`);
            break;
        } catch (error) {
            console.log(`\nAttempt ${i + 1} failed with error: ${error.message}`);
            if (i < maxRetries - 1) {
                console.log('Waiting 5 seconds before retrying...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                console.log('Starting next attempt...');
            } else {
                console.log('Maximum retry attempts reached');
                throw error;
            }
        }
    }
}

console.log('Starting download process...');
downloadWithRetry().catch(error => {
    console.error('Final error:', error);
    process.exit(1);
});
