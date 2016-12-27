var postcss = require( 'postcss' );

module.exports = postcss.plugin( 'postcss-random', function ( options ) {

	return function ( css ) {

		/*----------  global vars  ----------*/

		options = options || {};

		// MIN and MAX values
		var limitValues = {
			min : 0,
			max : 1,
		};

		// arguments passed to random()
		var funcArguments;

		// final value which replace the random() function
		var newValue = 0;

		// options passed as the third argument
		var randomOptions = {
			randomSeed : options['randomSeed'] || null,
			round : Boolean(options['round']) || false,
			noSeed : Boolean(options['noSeed']) || false,
			floatingPoint : parseInt(options['floatingPoint']) || 5,
		};

		//  warning messages
		var warnings = {
			invalidArguments : 'postcss-random requires a total count of 0, 2 or 3 arguments',
			invalidOptionsFormat : 'Invalid options object format',
			invalidFloatingPoint : 'Invalid floating point',
		};

		/*----------  global functions  ----------*/
		function setDefaultRandomOptions(){
			randomOptions = {
				randomSeed : options['randomSeed'] || null,
				round : Boolean(options['round']) || false,
				noSeed : Boolean(options['noSeed']) || false,
				floatingPoint : parseInt(options['floatingPoint']) || 5,
			};
		}

		// essential random function, returns value depending on setted randomOptions
		function getRandom(){
			var randomGenerator = seedRandom;
			if( randomOptions.noSeed ){
				randomGenerator = simpleRandom;
			}

			// get random
			var returnValue = randomGenerator( limitValues.max, limitValues.min );

			// apply floating point correction
			returnValue = returnValue.toFixed( randomOptions.floatingPoint );

			// round if necessary
			if( randomOptions.round ){
				returnValue = Math.round( returnValue );
			}

			return returnValue;
		}

		// return simple random value, no seeding
		function simpleRandom( max, min ){
			max = max || 1;
			min = min || 0;
			var rnd = Math.random();

			return min + rnd * (max - min);
		}

		// return seeded random
		function seedRandom( max, min ) {
			max = max || 1;
			min = min || 0;

			randomOptions.randomSeed = ( randomOptions.randomSeed * 9301 + 49297 ) % 233280;
			var rnd = randomOptions.randomSeed / 233280;

			return min + rnd * ( max - min );
		}

		// update limits
		function setLimitValues() {
			limitValues.min = parseInt( funcArguments[ 0 ] || 0 );
			limitValues.max = parseInt( funcArguments[ 1 ] || 1 );
		}

		// set random options
		function setOptions( argument){
			var customOptions;

			// reset randomOptions to default
			setDefaultRandomOptions();

			// parse options, warn if invalid
			try{
				eval( 'customOptions =' + argument );
			}catch( e ){
				console.warn( warnings.invalidOptionsFormat, argument );
				return;
			}

			// apply custom options to random options
			for(var name in customOptions){
				randomOptions[name] = customOptions[name];
			}

			// correct invalif floating point values
			if( randomOptions.floatingPoint < 0 || isNaN(randomOptions.floatingPoint) ){
				console.warn( warnings.invalidFloatingPoint, randomOptions.floatingPoint );
				return;
			}
		}

		// walk rules
		css.walkRules( function ( rule ) {

			rule.walkDecls( function ( decl ) {

				var property = decl.prop;
				var value = decl.value;

				// if randomSeed property found, set random seed and return
				if ( property === 'randomSeed' ) {
					randomOptions.randomSeed = value;
					decl.remove();
					return;
				}

				if ( value.indexOf( 'random(' ) !== -1 ) {

					// remove whitespace
					value = value.replace( /\s/, '' );

					// try to get arguments
					try {
						// first we get the whole random command
						var commands = value.match( /random\(([^)]+)\)/g );
						// loop over each command instance
						for(var i = 0; i < commands.length; i++){
							// current command
							var curCommand = commands[i];
							// command inner
							var commandInner = curCommand.match( /random\(([^)]+)\)/ )[ 1 ];
							// seccond we replace the part ,{ with a bar
							var objectTemp = commandInner.replace(/,\s*{/,'|');
							// third we split it in half to seperate min/max and options
							var segmentSplit = objectTemp.split('|');
							// if length > 2 then there is something wrong
							if( segmentSplit.length > 2){
								console.warn( warnings.invalidOptionsFormat, commandInner );
								return;
							}else if( segmentSplit.length === 2){
								// otherwise split out min/max
								var minMaxSegment = segmentSplit[0];
								funcArguments = minMaxSegment.split( ',' );
								funcArguments.push( '{' + segmentSplit[1] );
							}else{
								// and of only one argument exists then it means taht only options were passed
								funcArguments = segmentSplit;
							}

							if( funcArguments.length >= 2 ){
								setLimitValues();
							}
							console.log(funcArguments);
							// perform action depending on arguments count
							switch ( funcArguments.length ) {

							case 0:
								newValue = seedRandom();
								break;

							case 1:
								setOptions( funcArguments[ 0 ] );
								if( typeof randomOptions !== 'object' ){
									console.warn( warnings.invalidOptionsFormat, randomOptions );
									return;
								}else{
									newValue = getRandom();
								}
								break;

							case 2:
								newValue = getRandom();
								break;

							case 3:
								setOptions( funcArguments[ 2 ] );
								newValue = getRandom();

								break;

							default:
								console.warn( warnings.invalidArguments );
								return;
							}

							// finally replace value with new value
							decl.value = decl.value.replace( /random\(([^)]*)\)/, newValue );
						}
					} catch ( e ) {
						funcArguments = [];
					}
				}

			} );
		} );
	};
} );