# I18n-amd
_I18n-amd internationalization library_

I18n.js is a library that helps working with internationalization on javascript. This library uses [amd](http://en.wikipedia.org/wiki/Asynchronous_module_definition) structure.
[![Build Status](https://travis-ci.org/elo7/i18n-amd.svg?branch=master)](https://travis-ci.org/elo7/i18n-amd)

## Install

Install with [npm](https://www.npmjs.com): `npm install elo7-i18n-amd`

## Dependency

I18n-amd depends on an [amd](http://en.wikipedia.org/wiki/Asynchronous_module_definition) implementation. We suggest [async-define](https://github.com/elo7/async-define) implementation for dependency lookup.
I18n-amd also depends on [ajax-amd](https://github.com/elo7/ajax-amd) and a stable version is already defined in `package.json`. You only need to install with [npm](https://www.npmjs.com) and load i18n-amd and ajax-amd files on your page.
I18n-amd expects an endpoint with the url "/i18n/{messageKey}" to return a JSON response with the following structure:
```js
{
	version: 1,
	message: "Confirm",
	key: "words.Confirm"
}
```
This one should be implemented on your web application.

For pluralized keys it's expect the following message structure:
```
{
	version: 1,
	message: "No product",
	key: "products.zero"
},
{
	version: 1,
	message: "One product",
	key: "products.one"
},
{
	version: 1,
	message: "{0} products",
	key: "products.other"
}
```

For formatted messages, it's expect the following message structure:
```js
{
	version: 1,
	message: "Hello {0}! Have a {1} day!",
	key: "args.example"
}
```

## Methods

#### get
`.get(key)`

###### Description:
Returns an internationalized message for the given key. This method caches the key, value and version on `localStorage` to avoid unecessary requests. The current version of your application is stored on `sessionStorage`, if the message version doesn't match current version, a new request is done to update the cached value with the new message.

###### Sample:
``` js
define(['i18n'], function(i18n) {
	// words.Confirm=Confirm
	i18n.get('words.Confirm'); // Returns "Confirm"
});
```
#### count
`.count(key, size)`

###### Description:
Returns the pluralized internationalized message for the given key. It's also replace `{0}` with the size parameter. This method uses `get` method and caches the message on the same way.

###### Sample:
``` js
define(['i18n'], function(i18n) {
	i18n.count('products', 0); // Returns "No product"
	i18n.count('products', 1); // Returns "One product"
	i18n.count('products', 2); // Returns "2 products"
});
```
#### args
`.args(key, args...)`

###### Description:
Returns internationalized message for the given key formatted with arguments. The message should contains `{n}` to be replaced with the argument[n]. This method also uses `get` method on background and caches the message on the same way.

###### Sample:
``` js
define(['i18n'], function(i18n) {
	i18n.args('args.example', 'Bielo', 'nice'); // Returns "Hello Bielo! Have a nice day!"
});
```

#### domain
`.domain("example.com")`

###### Description:
Sets an optional domain which i18n lib will make requests for the internationalization. This variable needs to be set before any `get()` usage if the domain isn't the same as the current page.

###### Sample:
``` js
define(['i18n'], function(i18n) {
	i18n.domain("some-domain.com");
});
```

## License

Event-amd is released under the [BSD](https://github.com/elo7/i18n-amd/blob/master/LICENSE). Have at it.

* * *

Copyright :copyright: 2019 Elo7# i18n-amd
