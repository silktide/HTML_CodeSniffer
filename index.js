var fs         = require('fs');
var scriptPath = __dirname+'/build/HTMLCS.js';

if (fs.existsSync(scriptPath) === true) {
    module.exports={
        library:function() { require(scriptPath) },
        source:function () { fs.readFileSync(scriptPath); }
    };
} else {
    throw new Error('HTMLCS must be built using `grunt build` before it can be required in Nodejs.');
}