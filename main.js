const { argv, exit } = require('node:process')
const { crawlPage, normalizeURL } = require('./crawl.js')
const { printReport } = require('./report.js')

async function main() {
    console.log(argv.length)
    console.log(argv[0])
    console.log(argv[1])
    console.log(argv[2])
    //console.log(argv[3])
    if(argv.length === 2 || argv.length > 3){
        console.log('Only a single argument: baseURL')
        exit(1)
    }
    const url = argv[2]
    console.log(`Crawling ${url}`);
    const normalURL = normalizeURL(url)
    const pageMap = {}
    //pageMap[normalURL] = 0
    const pages = await crawlPage(url, url, pageMap)
    const pagesString = JSON.stringify(pages)
    printReport(pages)
}

main()
