# react-forms
Prototyping form validation with React.

## Setup
Install dependencies.
```sh
npm install
```

Build.
```sh
gulp
```

Run unit tests.
```sh
npm run test
```

## Development
### Local server
Run the following command and then visit localhost:8080 in your browser.
```sh
npm run dev-server
```

### Automatic build
You can have gulp automatically build the javascript as you make changes by running the following watch command.
```sh
gulp watch-js
```

## Example form
```js
<form onSubmit={this.handleSubmit}>
  <TextField name="name" label="Name" ref={(field) => { this.fields.push(field); }} validators={[MinLengthValidator(3)]}/>
  <button type="submit">Submit</button>
</form>
```

## Documentation

### Form
The form is responsible for calling `validate()` on all the fields. In this prototype, this happens when the form is submitted. Fields are stored on the form by using the `ref` property on the field components, which runs a callback and pushes the field into a fields array on the form.

### Field Mixin
Each field component uses the `FieldMixin` which provides the necessary validation functions. The mixin allows you to pass validators to the component which are run when the form is submitted.

### Field components
The field components are responsible for rendering the form field markup and displaying validation messages. Field components must store the field value in its state for validation. Validators can be added in `createClass` or passed as a prop. A component can have any number of validators and they will all be run when you call `validate()`.

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
