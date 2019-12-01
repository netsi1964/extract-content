const extract = require("../modules/extract");
const html = require("../modules/html");
const raw = require("../modules/raw");

var appRouter = function(app) {
  app.get("/", extract);
  app.get("/html", html);
  app.get("/raw", raw);
};

module.exports = appRouter;
