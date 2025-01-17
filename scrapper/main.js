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
}

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const urls = [
        'https://www.cropscience.bayer.us/d/dekalb-dkc081-18rib-corn',
        'https://www.cropscience.bayer.us/d/dekalb-dkc084-15rib-corn',
        'https://www.cropscience.bayer.us/d/dekalb-dkc092-13rib-corn',
        'https://www.cropscience.bayer.us/d/dekalb-dkc092-14rib-corn',
    ];

    try {
        await Promise.all(urls.map(async (url, i) => {
            try {
                await downloadPDFFromPage(browser, url);
                console.log(`Downloaded ${i + 1}/${urls.length}: ${url}`);
            } catch (error) {
                console.error(`Failed ${i + 1}/${urls.length}: ${url}`, error);
            }
        }));
    } finally {
        await browser.close();
    }
}

main().catch(error => {
    console.error('Final error:', error);
    process.exit(1);
});
