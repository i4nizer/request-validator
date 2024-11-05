### `validateRequest(fields, obj, res)`

The primary function of `validateRequest` is to validate incoming request data based on a set of predefined field rules. This function checks for missing fields and validates each field according to its specified criteria, such as minimum length, maximum length, or regex pattern. If any field fails validation, `validateRequest` immediately sends an error response and stops further processing.

#### Parameters

- **`fields`**: An array of field objects, each representing a field to validate. Each object can contain:
  - **`name`** (string, required): The name of the field to validate.
  - **`required`** (boolean, optional): Specifies if the field is required. Defaults to `true` if not provided.
  - **`min`** (number, optional): The minimum length (for strings) or minimum value (for numbers).
  - **`max`** (number, optional): The maximum length (for strings) or maximum value (for numbers).
  - **`pattern`** (RegExp, optional): A regular expression pattern that the field value must match (for strings only).

- **`obj`**: The object containing values to validate, such as `req.body` or `req.query`.

- **`res`**: The Express `Response` object used to send error messages if any validations fail.

#### Return Value

- Returns `true` if all fields pass validation.
- If any validation fails, it sends a response with an error message and a status code:
  - **400** for missing required fields.
  - **422** for validation failures (e.g., invalid length or pattern mismatch).

#### Example Usage

```javascript
const express = require('express');
const requestValidator = require('request-validator');

const app = express();
app.use(express.json());

const fields = [
    { name: 'username', required: true, min: 3, max: 15 },
    { name: 'password', required: true, min: 8 }
];

app.post('/register', (req, res) => {
    if (!requestValidator.validateRequest(fields, req.body, res)) return;

    // Proceed with registration logic
    res.status(200).send("Registration successful!");
});

app.listen(3000, () => console.log('Server running on port 3000'));
```