var postcss = require( 'postcss' );

module.exports = postcss.plugin( 'postcss-random', function ( options ) {

	return function ( css ) {

		options = options || {};

		var randomSeed = 0,
			minVal,
			maxVal;

		function seedRandom(max, min) {
		    max = max || 1;
		    min = min || 0;

		    randomSeed = (randomSeed * 9301 + 49297) % 233280;
		    var rnd = randomSeed / 233280;

		    return min + rnd * (max - min);
		}

		function getLimitValues(){
			minVal = parseInt( formattedValues[ 0 ] );
			maxVal = parseInt( formattedValues[ 1 ] );
		}

		function floatedRandomSeed(){
			getLimitValues();
			newValue = seedRandom(minVal, maxVal);
		}

		function noFloatedRandomSeed(){
			getLimitValues();
			newValue = Math.round(seedRandom(minVal, maxVal));
		}

		css.walkRules( function ( rule ) {

			rule.walkDecls( function ( decl, i ) {

				// variables
				var property = decl.prop;
					value = decl.value,
					formattedValues = [],
					newValue = null;

				// define randomSeed
				if(property === 'randomSeed'){
					randomSeed = value;
					decl.remove();
				}

				if ( value.indexOf( 'random(' ) !== -1 ) {

					try {
						formattedValues = value.match( /random\(([^)]+)\)/ )[ 1 ].split( ',' );
					} catch ( e ) {
						formattedValues = [];
					}

					switch (formattedValues.length){
						case 0:
							newValue = seedRandom();
							decl.value = decl.value.replace( "random()", newValue );
							break;
						case 1:
							console.log( 'postcss-random requires a total count of 0 or two arguments' );
							break;
						case 2:
							floatedRandomSeed();
							decl.value = decl.value.replace( "random(" + minVal + "," + maxVal + ")", newValue );
							break;
						case 3:
							eval('var randomOptions='+formattedValues[2]);
							if(randomOptions.float === true){
								floatedRandomSeed();
								decl.value = decl.value.replace( "random(" + minVal + "," + maxVal + "," + formattedValues[2] + ")", newValue );
							}else{
								noFloatedRandomSeed();
								decl.value = decl.value.replace( "random(" + minVal + "," + maxVal + "," + formattedValues[2] + ")", newValue );
							}
							break;
						default:
							console.log( 'postcss-random requires a total count of 0 or two arguments' );
							break;
					}
				}

			} );
		} );
	}
} );