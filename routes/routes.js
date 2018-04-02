const extract = require("../modules/extract");
const html = require("../modules/html");

var appRouter = function(app) {
  app.get("/", extract);
  app.get("/html", html);
};

module.exports = appRouter;
