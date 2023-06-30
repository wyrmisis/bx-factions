# PostCSS Inherit Parser

[![Build Status](https://travis-ci.org/GarthDB/postcss-inherit-parser.svg?branch=master)](https://travis-ci.org/GarthDB/postcss-inherit-parser) [![Code Climate](https://codeclimate.com/github/GarthDB/postcss-inherit-parser/badges/gpa.svg)](https://codeclimate.com/github/GarthDB/postcss-inherit-parser) [![Test Coverage](https://codeclimate.com/github/GarthDB/postcss-inherit-parser/badges/coverage.svg)](https://codeclimate.com/github/GarthDB/postcss-inherit-parser/coverage) [![Issue Count](https://codeclimate.com/github/GarthDB/postcss-inherit-parser/badges/issue_count.svg)](https://codeclimate.com/github/GarthDB/postcss-inherit-parser) [![Dependency Status](https://david-dm.org/GarthDB/postcss-inherit-parser.svg)](https://david-dm.org/GarthDB/postcss-inherit-parser) [![Inline docs](http://inch-ci.org/github/GarthDB/postcss-inherit-parser.svg?branch=master)](http://inch-ci.org/github/GarthDB/postcss-inherit-parser) [![npm version](https://badge.fury.io/js/postcss-inherit-parser.svg)](https://badge.fury.io/js/postcss-inherit-parser)

---

A PostCSS Parser that supports syntax for inherit declarations with pseudo classes.

```css
.b:before {
  content: "";
}
.a {
  inherit: .b:before;
}
```

## Defining `inherit` syntax

Using an options object with a property of `propertyRegExp`, you can define a custom `inherit` syntax.

This example:

```js


parse(
  '.a { color: red; } .b { extend: .a; }',
  { propertyRegExp: /^extends?$/ }
);
```

would work with this css:

```css
.a {
  color: red;
}
.b {
  extend: .a;
}
```
