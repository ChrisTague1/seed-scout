const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent.includes('View Profile')
);

const urls = buttons.map(btn => btn.closest('a').href);

// Print the URLs to console
console.log(urls);

// Copy URLs to clipboard as a formatted list
const urlList = urls.join('\n');
