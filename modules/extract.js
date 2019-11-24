const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const extract = (req, res) => {
  let { from, extract } = req.query;
  if (typeof from !== "undefined") {
    let route = "";
    try {
      extract = JSON.parse(extract);

      request(from, function(error, response, body) {
        if (error) {
          res.status(404).send(`Could not fetch data from ${from}`);
        } else {
          if (typeof extract !== "undefined") {
            route = "Extracting content";

            const html = new JSDOM(body);
            const document = html.window.document;
            let selectors = Object.keys(extract);
            let values = {};
            selectors.map(key => {
              const selector = extract[key];
              const found = Array.from(document.querySelectorAll(selector));
              if (found !== null) {
                var all = [];
                if (found.length > 1) {
                  found.map(ele => {
                    all.push(ele.textContent.trim());
                  });
                  values[key] = all;
                } else {
                  values[key] = found[0] ? found[0].textContent.trim() : "";
                }
              } else {
                values[key] = "";
              }
            });
            res.status(200).send(values);
          } else {
            route = "No extract";
            // Just return the response body, as no extract was specified we simply act as proxy
            res.status(200).send(body);
          }
        }
      });
    } catch (error) {
      res
        .status(404)
        .send(
          `${error.message}<br>Route:${route}<br>from=${from}<br>extract=${extract}`
        );
    }
  } else {
    res.status(404).send(`Please supply from and extract parameters`);
  }
};

module.exports = extract;
