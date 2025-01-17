const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function downloadPDFFromPage(browser, url) {
    const downloadPath = path.join(__dirname, 'downloads');
    console.log(`Setting up download directory at: ${downloadPath}`);
    
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }

    const page = await browser.newPage();
    
    // Add request interception to debug
    await page.setRequestInterception(true);
    page.on('request', request => {
        console.log(`Request: ${request.url()}`);
        request.continue();
    });

    // Add error logging
    page.on('error', err => console.error('Page error:', err));
    page.on('console', msg => console.log('Page log:', msg.text()));

    await page.setViewport({ width: 1366, height: 768 });
    
    await page._client().send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    try {
        console.log('Navigating to webpage...');
        await page.goto(url, {
            waitUntil: 'networkidle2', // Less strict than networkidle0
            // timeout: 60000 // Increase timeout to 60 seconds
        });

        console.log('Page loaded, waiting for button...');
        await page.waitForSelector('button.Overview_download-button__zOUg6', {
            visible: true,
            timeout: 30000
        });

        await page.evaluate(() => {
            const button = document.querySelector('button.Overview_download-button__zOUg6');
            if (button) button.click();
        });

        // Wait for download to start
        await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
        console.error(`Error processing ${url}:`, error);
        throw error;
    } finally {
        await page.close();
    }
}

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1366,768',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    const urls = [
        'https://www.cropscience.bayer.us/d/dekalb-dkc081-18rib-corn',
        'https://www.cropscience.bayer.us/d/dekalb-dkc084-15rib-corn',
        'https://www.cropscience.bayer.us/d/dekalb-dkc092-13rib-corn',
        'https://www.cropscience.bayer.us/d/dekalb-dkc092-14rib-corn',
    ];

    try {
        for (let i = 0; i < urls.length; i++) {
            try {
                await downloadPDFFromPage(browser, urls[i]);
                console.log(`Downloaded ${i + 1}/${urls.length}: ${urls[i]}`);
            } catch (error) {
                console.error(`Failed ${i + 1}/${urls.length}: ${urls[i]}`);
            }
            // Add delay between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    } finally {
        await browser.close();
    }
}

main().catch(error => {
    console.error('Final error:', error);
    process.exit(1);
});
