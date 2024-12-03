# common-es
Provides utilities for Node.js to be able to resolve ES modules, such as providing the `__dirname` and `__filename` variables.
---
When working with Node.js using ES modules, sometimes you'll need the **dirname global variable, or the **filename variable, such as when reading or writing a file.
Unfortunately, this global variable doesn't exist when you have the `"type": "module"` option set in your **package.json** file. In order to get the functionality of these nonexistent variables, you have to do a bit of work manually.
This simple utility provides access to these variables in a **simple** and a **standard** way.
# Usage:
```ts
// # myProjectFile.js
import { getGlobals } from 'common-es'
const { __dirname, __filename } = getGlobals(import.meta.url)
// now you can use __dirname or file name normally as you would do in commonjs
// ...
// ...
```
# API
```
getGlobals(url: string): { __dirname: string, __filename: string }
```
a function that provides the **\_\_dirname** and **\_\_filename** variables.
Expects a string, this string is always the `import.meta.url`.
If you're not familiar with this weird syntax, read this reference on MDN [Here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
