# Content

## Use middleware to handle requests

- Use  middleware before the route handler to handle requests
- Use middleware after the route handler to handle responses
- Use middleware to handle errors (no route handler is hit)

## Use third party middleware

- Use morgan to log requests

    ```javascript
    // npm install morgan
    const morgan = require('morgan');
    app.use(morgan('dev'));
    ```

- Morgan support 3 types of rules parsing:
  - predefined formats: combined, common, dev, short, tiny
  - custom format string: `morgan(':method :url :status :res[content-length] - :response-time ms')`
  - custom function: `morgan(function (tokens, req, res) { return 'Hello, world!'; })`

- Here i selected the custom format string and customize token `body` to log request body

    ```javascript
    morgan.token('body', function (req, res) { return JSON.stringify(req.body); });
    app.use(morgan(':method :url :status :body - :response-time ms'));
    ```

## Reference

- [Morgan](https://github.com/expressjs/morgan#creating-new-tokens)