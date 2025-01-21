const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  // if this is an offsite URL, bail immediately
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);

  // if we've already visisted this page just increase the count but don't visit again
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  //initialize this page. Since we made it this far we know t
  pages[normalizedURL] = 1;

  console.log(`actively crawling ${currentURL}`);
  let htmlBody = "";

  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(`HTTP error with status code: ${resp.status}, on page: ${currentURL}`);
      return pages;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`content type is not html. Type: ${contentType}, on page: ${currentURL}`);
      return pages;
    }

    htmlBody = await resp.text();
  } catch (err) {
    console.log(`Error in fetch: ${err.message}, on page ${currentURL}`);
  }
  const nextURLs = getURLsFromHTML(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }
  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      //relative
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with relative url: ${err.message}`);
      }
    } else {
      //absolute
      try {
        const urlObj = new URL(`${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`);
      }
    }
  }

  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  crawlPage,
  normalizeURL,
  getURLsFromHTML,
};
