const
bodyParser   = require('body-parser'),
Router       = require('router'),
percolator   = require('../es/percolator/init-percolator');

class ProgramHandler {
  static addRoutes(client, router) {
    if (client === undefined) {
      throw new Error('[BOOTSTRAP]: client argument undefined in KeyHandler');
    }
    const api = Router();
    api.use(bodyParser.json());

    // add queries for programs to the ES /search index
    api.post('/', addQueries(client));
    // sets the router arguement to use our 'programs' api
    // this is the router that handles all incoming requests for the server
    router.use('/programs', api);
  }
}

module.exports = {
  ProgramHandler
};

function addQueries(client) {
  return (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if(req.body.queries === undefined) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        message: 'queries are undefined'
      }));
    }
    percolator.modules.addQueries(client, req.body.queries)
      .then( queries => res.end(JSON.stringify({ update: queries})) )
      .catch( error => {
        res.end(JSON.stringify({
          message: error.message
        }));
      });
  };
}