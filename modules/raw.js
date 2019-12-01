const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const raw = (req, res) => {
  let { from } = req.query;
  if (typeof from !== "undefined") {
    let route = "";
    try {
      route = "Doing request...";
      request(from, function(error, response, body) {
        if (error) {
          res.status(404).send(`Could not fetch data from ${from}`);
        } else {
          route = "Raw";
          res.status(200).send(body);
        }
      });
    } catch (error) {
      res
        .status(404)
        .send(`${error.message}<br>Route:${route}<br>from=${from}`);
    }
  } else {
    res.status(404).send(`Please supply from parameter`);
  }
};

module.exports = raw;
