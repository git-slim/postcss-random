var postcss = require('postcss');

module.exports = postcss.plugin('postcss-random', function (options) {

    return function (css) {

        options = options || {};

        css.walkRules(function (rule) {

		    rule.walkDecls(function (decl, i) {

		 		var value = decl.value,
		 			newValue = null;

				if (value.indexOf( 'random(' ) !== -1) {
				    var values = value.match(/random\(([^)]+)\)/)[1].split(',');

				    if(values.length === 0){
				    	// if no argument provided
				    	newValue = Math.random();
				    }else if(values.length === 2){
				    	// if min and max value provided
				    	var minVal = parseInt(values[0]);
				    	var maxVal = parseInt(values[1]);

				    	newValue = Math.floor((Math.random() * maxVal) + minVal);
				    }else{
				    	// if invalid count of arguments is provided
				    	console.log('postcss-random requires a total count of 0 or two arguments');
				    }

				    // add new value
				    decl.value = decl.value.replace("random(" + minVal + "," + maxVal + ")",newValue);
				}

		    });

		});

    }

});