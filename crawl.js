const { JSDOM } = require('jsdom')
const delay = ms => new Promise(res => setTimeout(res, ms));

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = normalizeURL(baseURL)
    const normalURL = normalizeURL(currentURL)
    //console.log(JSON.stringify(pages))
    let newPages = pages
    //console.log(JSON.stringify(newPages))
    //console.log(normalURL in newPages)
    //console.log(currentURL)
    //console.log(baseURL)
    //If we leave the domain, then don't go any further
    if(!normalURL.includes(baseURLObj)) {
        console.log("Leaving domain")
        return newPages
    }

    if(normalURL in newPages) {
        if(currentURL === baseURL) {
            console.log('Oops baseURL')
            newPages[normalURL] = 0
        } else {
            console.log(`Already contains page ${currentURL}`)
            newPages[normalURL]++
        }
        return newPages
    }
    if(currentURL === baseURL) {
        console.log('Oops baseURL')
        newPages[normalURL] = 0
    } else {
        console.log(`New page found: ${currentURL}`)
        newPages[normalURL] = 1;
    }

    try{
        //await delay(1000)
        const webPage = await fetch(currentURL, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/html'
            }
        })
        const webPageHeaders = await webPage.headers.get('Content-Type').split(';')
        const webPageResponseCode = await webPage.status
        const webPageText = await webPage.text()
        if(webPageResponseCode > 399) {
            throw new Error('Cannot access page at that address')
        }
        if(webPageHeaders[0] !== 'text/html') {
            throw new TypeError('Accessed url is not a website')
        }

        const urlListTemp = getURLsFromHTML(webPageText, currentURL)
        const urlList = urlListTemp.formedURLs
        for(const subURL of urlList) {
            console.log(`Searching through ${subURL}`)
            newPages = await crawlPage(baseURL, subURL, newPages)
        }

    } catch(err) {
        console.log(err.message)
        return newPages
    }
    console.log('Exiting up')
    return newPages
}

function normalizeURL(url) {
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
        fullPath = fullPath.slice(0,-1)
    }
    return fullPath
}

//HTML Body is a string of the html file
//baseURL is the root URL of the crawled website
//Returns a non-normalized array of all the URLs in the HTML string
function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody, {
        url: `${baseURL}`,
        referrer: `${baseURL}`,
        contentType: 'text/html',
        pretendToBeVisual: true,
        storageQuota: 10000000
    });
    const links = dom.window.document.querySelectorAll('a');
    const formedURLs = []
    const numURLs = links.length
    for(let i = 0; i < links.length; i++) {
        formedURLs.push(`${links[i].href}`)
    }
    const urlObject = {
        formedURLs,
        numURLs
    }
    return urlObject

}


module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}
