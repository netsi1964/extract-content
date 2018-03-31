var appRouter = function (app) {
    app.get("/", function(req, res) {
      res.status(200).send({ total: "4,793"});
    });
  }
  
  module.exports = appRouter;