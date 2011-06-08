/*jshint boss: true */

load("jshint.js");
load("json2.js");

(function (args) {
    var name   = args[0],
        optstr = args[1], // arg1=val1,arg2=val2,...
        opts   = { rhino: true },
        input, predef = {};

    if (!name) {
        print('Usage: jshint.js file.js');
        quit(1);
    }

    if (optstr) {
        optstr.split(',').forEach(function (arg) {
            var o = arg.split('=');
            opts[o[0]] = (function (ov) {
                switch (ov) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                	return ov;
                }
            })(o[1]);
        });
        if (opts.predef) {
        	opts.predef.split(';').map(function (globalVar) {
        		predef[globalVar] = false;
        	});
        	opts.predef = predef;
        }
    }

    input = readFile(name);

    if (!input) {
        print('jshint: Couldn\'t open file ' + name);
        quit(1);
    }

    if (!JSHINT(input, opts)) {
        for (var i = 0, err; err = JSHINT.errors[i]; i++) {
            print(err.reason + ' (' + name.split('\\').pop() + ':' + err.line + ':' + err.character + ')');
            print('> ' + (err.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            print('');
        }
        quit(1);
    }

    quit(0);
}(arguments));
