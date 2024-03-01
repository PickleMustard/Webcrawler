function printReport(pages) {
    console.log('Creating a report of the crawled website...')
    console.log('...........................................')
    console.log('...........................................')

    const sortedPages = sortList(pages)

    for(const sortedPage of sortedPages) {
        console.log(`Found ${sortedPage[1]} references to ${sortedPage[0]} internally`)
    }
}


function sortList(pages) {
    const sortable = []
    for(const page in pages) {
        sortable.push([page, pages[page]]);
    }

    sortable.sort((a,b) => {
        return a[1]-b[1];
    });

    return sortable
}

module.exports = {
    printReport
}
