# react-forms
Prototyping form validation with React.

## Setup
Install dependencies.
```sh
npm install
```

Build.
```sh
npm run build
```

Run unit tests.
```sh
npm run test
```

## Development
### Local server
Run the following command and then visit `http://localhost:8080/` in your browser.
```sh
npm run dev-server
```

### Automatic rebuild
The app can automatically rebuild as you make changes by running the following watch command.
```sh
npm run watch
```

## Example form
```js
<Form>
  <Field validators={[MinLengthValidator(3)]}>
    <label>Name</label>
    <input type="text" name="name" id="name"/>
    <ErrorMessage/>
  </Field>

  <button type="submit">Submit</button>
</Form>
```

## Documentation

### Validators
Validators are objects that contain two functions: `validate` and `errorMessage`.

`validate` must be a function that takes an argument for the value and it must return true or false.

`errorMessage` must be a function that returns a string.

#### Example validator
```js
function MinLengthValidator(minLength) {
  this.minLength = minLength;
}

Object.assign(MinLengthValidator.prototype, {
  validate(value) {
    return value.length >= this.minLength;
  },

  errorMessage() {
    return `Must be at least ${this.minLength} characters`
  }
});
```
