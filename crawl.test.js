const {test, expect} = require('@jest/globals')
const { normalizeURL, getURLsFromHTML  } = require('./crawl.js')
const { JSDOM } = require('jsdom')
const { readFile } = require('fs/promises')

async function content(path) {
    return await readFile(path, 'utf8')
}


test('Can identify a fully formatted path', () => {
    expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('Can identify a path without a closing /', () => {
    expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('Handles error when given bad URL without protocol https://', () => {
    expect(() => {
        normalizeURL('blog.boot.dev/path/')
    }).toThrow('Invalid URL');
    //expect(normalizeURL('blog.boot.dev/path/')).toThrow("Invalid URL");
});

test('Handles error when given bad URL without protocol https', () => {
    expect(() => {
        normalizeURL('blog.boot.dev/path')
    }).toThrow('Invalid URL');
});

test('Can identify non-secure HTTP request', () => {
    expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('Can identify through capitalization', () => {
    expect(normalizeURL('HTTP://BLOG.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('Can identify through capitalization and without closing /', () => {
    expect(normalizeURL('HTTP://BLOG.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('Output empty list on HTML file with no links', async () => {
    const url = ''
    const data = await JSDOM.fromURL(url)
    expect(getURLsFromHTML(data.serialize(), url)).toBe();
});

test('Can create a list on HTML file with a single link', async () => {
    const url = ''
    const data = await JSDOM.fromURL(url)
    expect(getURLsFromHTML(data.serialize(), url)).toBe();
});

test('List contains all the links on a small HTML page' , async () => {
    const url = 'https://blog.boot.dev/'
    const data = await JSDOM.fromURL(url)
    expect(getURLsFromHTML(data.serialize(), url).numURLs).toBe(51);
});

test('List contains all the links on a large HTML page', async () => {
    const url = 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics'
    const data = await JSDOM.fromURL(url)
    expect(getURLsFromHTML(data.serialize(), url)).toBe(397);
});

test('Relative URL fragment gets converted to absolute URL', async () => {
    const url = ''
    const data = await JSDOM.fromURL(url)
    expect(getURLsFromHTML(data.serialize(), url)).toBe();
});

test('Relative URL path gets converted to absolute URL', async () => {
    const url = ''
    const data = await JSDOM.fromURL(url)
    expect(getURLsFromHTML(data.serialise(), url)).toBe();
});
