const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function downloadPDFFromPage(browser, url) {
    const downloadPath = path.join(__dirname, 'downloads');
    console.log(`Setting up download directory at: ${downloadPath}`);
    
    if (!fs.existsSync(downloadPath)) {
        console.log('Downloads directory does not exist, creating it...');
        fs.mkdirSync(downloadPath);
        console.log('Downloads directory created successfully');
    }

    let page;
    try {
        console.log('Creating new page...');
        page = await browser.newPage();
        
        console.log('Configuring download behavior...');
        const client = await page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath
        });

        console.log('Navigating to webpage...');
        const response = await page.goto(url, {
            waitUntil: 'domcontentloaded',
        });
        console.log(`Page loaded with status: ${response.status()}`);

        console.log('Waiting for Download PDF button to be available...');
        const downloadButton = await page.waitForSelector('button.Overview_download-button__zOUg6', {
            timeout: 10000,
            visible: true
        });

        console.log('Attempting to click download button...');
        await downloadButton.click();

        console.log('Waiting for download to initiate...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const filesBeforeWait = fs.readdirSync(downloadPath);

        console.log('Waiting for download to complete...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        const filesAfterWait = fs.readdirSync(downloadPath);
        const newFiles = filesAfterWait.filter(file => !filesBeforeWait.includes(file));
        
        if (newFiles.length > 0) {
            console.log(`New files downloaded: ${newFiles.join(', ')}`);
            await page.close();
            return newFiles;
        } else {
            throw new Error('No files were downloaded');
        }

    } catch (error) {
        console.error('An error occurred:', error);
        
        if (page) {
            await page.screenshot({ 
                path: 'error.png',
                fullPage: true 
            });
            const html = await page.content();
            fs.writeFileSync('error.html', html);
            await page.close();
        }
        throw error;
    }
}

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const url = 'https://www.cropscience.bayer.us/d/dekalb-dkc081-18rib-corn';
        const downloadedFiles = await downloadPDFFromPage(browser, url);
        console.log('Download completed successfully:', downloadedFiles);
    } catch (error) {
        console.error('Download failed:', error);
    } finally {
        await browser.close();
    }
}

main().catch(error => {
    console.error('Final error:', error);
    process.exit(1);
});
