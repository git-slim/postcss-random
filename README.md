# postcss-random [![Build Status](https://travis-ci.org/git-slim/postcss-random.svg?branch=develop)](https://travis-ci.org/git-slim/postcss-random)

> [PostCSS](https://github.com/postcss/postcss) plugin to generate random numbers based on random seeds using `random()` function.

**Note:** It's best practice to require the plugin right before [postcss-calc](https://github.com/postcss/postcss-calc).

## Installation

```console
$ npm install postcss-random
```

## Exmaples

`Input`

```css
/**

	NOTE:
	- CSS units can be added right after function call (e.g. 'px')
	- Syntax: random(min, max, {options})

 */

.foo{
	transform: translateX(random(0,20,{round: true})px);
}
```

`Output`

```css
.foo{
	transform: translateX(12px);
}
```

## Options
**Note:** All options can also be defined inline.

```javascript
var postcssRandom = require('postcss-random');

var postcssProcessors = [
	postcssRandom({
		randomSeed:		0;			// default: 0
		round: 			true,		// default: false
		noSeed: 		true,		// default: false
		floatingPoint: 	10 			// default: 5
	})
]
```
- **`randomSeed (Integer)`** sets initial seed

- **`round (Boolean)`**	if true, returns an integer

- **`noSeed (Boolean)`** if true, the returned value will be seed-independent and recalculated with each compilation

- **`floatingPoint (Integer)`** sets the number of digits after decimal point

## Inline-Options

`Input (noSeed : false)`

```css
*{
	randomSeed: 0;
}

.foo{
	transform: translateX(random(0,20)%);
}
```

`Output`

```css
*{
}

.foo{
	transform: translateX(11.12345%);
}
```

`Input (noSeed : true)`

```css
*{
	randomSeed: 0;
}

.foo{
	transform: translateX(random(0,20, {noSeed: true} )%);
}
```

`Output`

```css
*{
}

.foo{
	/* returned value changes with each compilation */
	transform: translateX(6.12345%);
}
```

## Contributors

* [Paul Kamma](https://github.com/X-Tender)
* [Marten Zander](https://github.com/SlimMarten)

### [License](https://github.com/git-slim/postcss-random/blob/develop/LICENSE)
### [Changelog](https://github.com/git-slim/postcss-random/blob/develop/CHANGELOG.md)
