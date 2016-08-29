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

### Tests
Unit tests need to be rewritten and are currently not working.

## View examples
### Build
Run the following command to compile examples to the `dist` directory.
```sh
npm run build-examples
```

### Run local server
Run the following command and then visit `http://localhost:8000/` in your browser.
```sh
npm run examples-server
```


## Getting started
### Form and Field
This library consists of only two components: `Form` and `Field`. To start, just use the `<Form>` component instead of the html `<form>` tag. Feel free to create field components any way you like, and then simply wrap that component with `Field` before using it in your form. 
```js
const Input = Field(React.createClass({
  render() {
    return (
      <div className="row">
        <input name={this.props.name} onChange={this.props.handleChange}/>
      </div>
    );
  }
}));

const MyForm = React.createClass({
  render() {
    return (
      <Form>
        <Input name="username"/>
      </Form>
    );
  }
});
```
You'll notice two props used in that code example: `name` and `handleChange`. The `name` prop is important as that is how the form will identify your field and be able to pass initial values to it. The `handleChange` prop is required for the field to update its value and later be used for validation.

### Validators
Validators are simply functions that either return `true` or an error message. A validator function should return a function which returns the result.

```js
function minLength(length) {
  return (value) => {
    if (value && value.length >= length) {
      return true;
    }
    return `Must be at least ${length} characters`
  };
}
```


## API

### Field
#### State
- message
- valid
- value

#### Props
- handleChange
- message
- validate
- validators
- value

### Form
#### Properties
- fields
- invalidFields
- validate
- values

#### State
- valid

#### Props
- values (used for initial values)
