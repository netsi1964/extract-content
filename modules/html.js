const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const extract = (req, res) => {
  let { from, extract } = req.query;
  if (typeof from !== "undefined") {
    try {
      if (typeof extract !== "undefined") {
        extract = JSON.parse(extract);
      }

      request(from, function(error, response, body) {
        if (error) {
          res.status(404).send(`Could not fetch data from ${from}`);
        } else {
          let values = {};
          if (extract) {
            const html = new JSDOM(body);
            const document = html.window.document;
            let selectors = Object.keys(extract);
            selectors.map(key => {
              const selector = extract[key];
              const found = document.querySelector(selector);
              if (found !== null) {
                values[key] = found.outerHTML;
              } else {
                values[key] = "";
              }
            });
          } else {
            values.html = body;
          }
          res.status(200).send(values);
        }
      });
    } catch (error) {
      res.status(404).send(`${error.message}`);
    }
  } else {
    res.status(404).send(`Please supply from and extract parameters`);
  }
};

module.exports = extract;
