const { getURLsFromHTML, normalizeURL } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL capital invariance", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML", () => {
  const inputHTMLBody = `
 <html>
    <body>
        <a href="https://blog.boot.dev/">
            Boot.dev Blog
        </a>
        <a href="https://google.com">
            google link
        </a>
    </body>
</html>
`;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/", "https://google.com/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
   <html>
      <body>
          <a href="/path/">
              Boot.dev Blog
          </a>
          <a href="https://google.com">
              google link
          </a>
      </body>
  </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/", "https://google.com/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const inputHTMLBody = `
     <html>
        <body>
            <a href="invalid">
                invalid URL
            </a>
        </body>
    </html>
    `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
