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
        });

        console.log('Page loaded, waiting for button...');
        await page.waitForSelector('button.Overview_download-button__zOUg6', {
            visible: true,
        });

        await page.evaluate(() => {
            const button = document.querySelector('button.Overview_download-button__zOUg6');
            if (button) button.click();
        });

        // Wait for download to start
        await new Promise(resolve => setTimeout(resolve, 500));
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
    "https://www.cropscience.bayer.us/d/dekalb-dkc081-18rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc084-15rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc092-13rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc092-14rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc093-76rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc093-77rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc095-57rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc096-21rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc098-88rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc099-11rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc101-33rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc101-35rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc102-13rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc102-28rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc103-07rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc103-47rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc104-08rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc104-14rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc105-33rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc105-35rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc106-98rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc107-33rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc108-17rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc108-64rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc110-10-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc110-10rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc110-41-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc110-41rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc111-30-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc111-33rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc111-35rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc112-12rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc112-29rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc113-83-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc113-83rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc114-42rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc114-43rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc114-99-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc114-99rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc115-33rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc116-62-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc116-62rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc117-27-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc117-27rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc117-78-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc117-78rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc119-30-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc119-30rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc25-15rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc28-25rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc29-89rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc31-85rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc32-12rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc32-35rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc35-34rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc35-88rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc36-48rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc36-86rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc39-54rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc39-55rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc40-64rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc40-77rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc40-99rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc41-54rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc41-55rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc42-64rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc42-65rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc43-10rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc43-46-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc43-75rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc44-80rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc44-97rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc44-98rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc45-35rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc45-65rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc45-74rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc46-18-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc46-50rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc47-23-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc47-27rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc47-48rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc47-85rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc48-34rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc48-69rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc48-95rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc49-24rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc49-42-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc49-72rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc50-63rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc50-87rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc50-88rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc51-20rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc51-25rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc51-91rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc51-92rib-corn",
    "https://www.cropscience.bayer.us/d/dekalb-dkc51-98rib-corn"
]

    try {
        for (let i = 0; i < urls.length; i++) {
            try {
                await downloadPDFFromPage(browser, urls[i]);
                console.log(`Downloaded ${i + 1}/${urls.length}: ${urls[i]}`);
            } catch (error) {
                console.error(`Failed ${i + 1}/${urls.length}: ${urls[i]}`);
            }
            // Add delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    } finally {
        await browser.close();
    }
}

main().catch(error => {
    console.error('Final error:', error);
    process.exit(1);
});
