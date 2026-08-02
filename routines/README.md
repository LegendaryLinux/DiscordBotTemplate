This directory contains JavaScript files which export routines that receive the Discord client as their sole argument.
Each routine runs once when the client is ready and once per hour thereafter.

```js
module.exports = async (client) => {
  // Perform a recurring operation
};
```
