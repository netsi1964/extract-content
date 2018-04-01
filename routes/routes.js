const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var appRouter = function(app) {
  app.get("/", function(req, res) {
    let { from, extract } = req.query;
    extract = JSON.parse(extract);
    request(from, function(error, response, body) {
      if (error) {
        res.status(404).send(`Could not fetch data from ${from}`);
      } else {
        const html = new JSDOM(body);
        const document = html.window.document;
        let selectors = Object.keys(extract);
        let values = {};
        selectors.map(key => {
          const selector = extract[key];
          const found = document.querySelector(selector);
          if (found !== null) {
            values[key] = found.textContent.trim();
          } else {
            values[key] = '';
          }
        });
        res.status(200).send(values);
      }
    });
  });
};

module.exports = appRouter;
