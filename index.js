var postcss = require( 'postcss' );

module.exports = postcss.plugin( 'postcss-random', function ( options ) {

	return function ( css ) {

		/*----------  global vars  ----------*/

		options = options || {};

		// initial random seed
		var randomSeed = 0;

		// MIN and MAX values
		var limitValues = {
			min : 0,
			max : 1,
		};

		// arguments passed to random()
		var funcArguments;

		// finale value which replace the random() function
		var newValue = 0;

		// options passed as the third argument
		var randomOptions = {
			round : false
		};

		//  message for invalid count of given arguments
		var warningTxt = 'postcss-random requires a total count of 0 or two arguments';

		// global functions

		// return seeded random
		function seedRandom( max, min ) {
			max = max || 1;
			min = min || 0;

			randomSeed = ( randomSeed * 9301 + 49297 ) % 233280;
			var rnd = randomSeed / 233280;

			return min + rnd * ( max - min );
		}

		// update limits
		function setLimitValues() {
			limitValues.min = parseInt( funcArguments[ 0 ] || 0 );
			limitValues.max = parseInt( funcArguments[ 1 ] || 1 );
		}

		// get random number within range
		function getSeededRandom() {
			setLimitValues();
			return seedRandom( limitValues.min, limitValues.max );
		}

		// get random int wihtin range (rounded float)
		function getRoundedSeededRandom() {
			return Math.round( getSeededRandom() );
		}

		// set random options
		function setOptions( argument){
			eval( 'randomOptions =' + argument );
		}

		// walk rules
		css.walkRules( function ( rule ) {

			rule.walkDecls( function ( decl ) {

				var property = decl.prop;
				var value = decl.value;

				if ( property === 'randomSeed' ) {
					randomSeed = value;
					decl.remove();
					return;
				}

				if ( value.indexOf( 'random(' ) !== -1 ) {

					// remove whitespace
					value = value.replace( /\s/, '' );

					// try to get arguments
					try {
						funcArguments = value.match( /random\(([^)]+)\)/ )[ 1 ].split( ',' );
					} catch ( e ) {
						funcArguments = [];
					}

					// perform action depending on arguments count
					switch ( funcArguments.length ) {

					case 0:
						newValue = seedRandom();
						break;

					case 1:
						console.warn( warningTxt );
						break;

					case 2:
						newValue = getSeededRandom();
						break;

					case 3:
						setOptions( funcArguments[ 2 ] );

						if ( randomOptions.round ) {
							newValue = getRoundedSeededRandom();
						} else {
							newValue = getSeededRandom();
						}
						break;

					default:
						console.warn( warningTxt );
						break;
					}

					// finaly replace value with new value
					decl.value = decl.value.replace( /random\(.*\)/, newValue );
				}

			} );
		} );
	};
} );