var requirejs = require('../lib/node_modules/requirejs/bin/r');

var config = {
    baseUrl: 'js/scripts',
    paths: {
    	jquery: 'empty:'
    },
    name: 'main',
    out: 'dist/main.js',
    optimize: 'none',
    logLevel: 3
};

requirejs.optimize(config, function (buildResponse) {
    //buildResponse is just a text output of the modules
    //included. Load the built file for the contents.
    //Use config.out to get the optimized file contents.
    //var contents = fs.readFileSync(config.out, 'utf8');
    // console.log(requirejs.optimize);
});

