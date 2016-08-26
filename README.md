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

Unit tests need to be rewritten.

## Development
### Local server
Run the following command and then visit `http://localhost:8000/` in your browser.
```sh
npm run dev-server
```

### Automatic rebuild
The app can automatically rebuild as you make changes by running the following watch command.
```sh
npm run watch
```

## Example field
```js
const InputField = Field(React.createClass({
  render() {
    return (
      <div className="row">
        <label>{this.props.label}</label>
        <input type={this.props.type} name={this.props.name} id={this.props.id} onChange={this.handleChange} />
        <span className="message">{this.props.message}</span>
      </div>
    );
  }
}));
```

## Example form
```js
<Form>
  <InputField type="text" name="username" id="username" validators={[minLength(3)]}/>
  <InputField type="password" name="password" id="password" validators={[required()]}/>
  <button type="submit">Submit</button>
</Form>
```

## Documentation

### Validators
Validators are simply functions that either return `true` or an error message. A validator function should return a function which returns the result.

#### Example validator
```js
function minLength(minLength) {
  return (value) => {
    if (value.length >= minLength) {
      return true;
    }
    return `Must be at least ${minLength} characters`
  };
}
```
