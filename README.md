# react-forms
Prototyping form validation with React.

## Setup
Install dependencies

`npm install`

Build

`gulp`

Run unit tests

`gulp test`

## Development
### Local server

Right now the easiest way to play around with this app is to run a local server with python. Run the following command and visit localhost:8000 in your browser.

`python -m SimpleHTTPServer`

### Automatic build
You can have gulp automatically build the javascript as you make changes by running the following watch command.

`gulp watch-js`

## Example
```js
<form onSubmit={this.handleSubmit}>
  <TextField name="name" label="Name" ref={(field) => { this.fields.push(field); }} validators={[MinLengthValidator(3)]}/>
  <button type="submit">Submit</button>
</form>
```

## Documentation

### Field Mixin
Each field component uses the `FieldMixin` which provides the necessary validation functions. The mixin allows you to pass validators to the component which are run when the form is submitted.

### Field components
The field components are responsible for rendering the form field markup and displaying validation messages. Field components must store the field value in its state for validation. Validators can be added in `createClass` or passed as a prop. A component can have any number of validators and they will all be run when you call `validate()`.

### Validators
Validators are objects that contain two functions: `validate` and `errorMessage`.

`validate` must be a function that takes an argument for the value and it must return true or false.

`errorMessage` must be a function that returns a string.
