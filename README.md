# Formwood

A lightweight and uncomplicated library for building React forms with reusable validation.

[![Travis build status](http://img.shields.io/travis/ericvaladas/formwood.svg)](https://travis-ci.org/ericvaladas/formwood)
[![Coverage Status](https://coveralls.io/repos/github/ericvaladas/formwood/badge.svg?branch=master)](https://coveralls.io/github/ericvaladas/formwood?branch=master)
[![Dependency Status](https://david-dm.org/ericvaladas/formwood.svg)](https://david-dm.org/jmeas/i18n-list-generator.js)
[![devDependency Status](https://david-dm.org/ericvaladas/formwood/dev-status.svg)](https://david-dm.org/ericvaladas/formwood#info=devDependencies)


## Getting started

### Usage
Install the package with npm.
```sh
npm install --save formwood
```

Import the `Form` and `Field` modules.
```js
import {Form, Field} from 'formwood';
```

### Form and Field
To start, use the `<Form>` component instead of an html `<form>` tag. Feel free to create field components any way you like, and then wrap that component with `Field` before using it in your form.
```js
const Input = Field(React.createClass({
  render() {
    return (
      <div className="row">
        <input {...this.props.element}/>
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
The spread props `this.props.element` on the input element will add all your props as well as an `onChange` and `defaultValue` prop. The `onChange` handler will store the value of the input in its state, which is later used for validation. The `defaultValue` prop will set the input with an initial value provided by the `Form`.

When a form is submitted, all fields will have their validators run. The `onSubmit` event handler is passed an object containing the form's valid status and its values.
```js
const MyForm = React.createClass({
  handleSubmit(e, form) {
    if (form.valid) {
      // Post JSON.stringify(form.values);
    }
  },

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input name="username"/>
      </Form>
    );
  }
});
```

### Initial values
You can pass initial values to your fields by adding the `values` prop to the `Form`. Initial values can contain a value and a message for each field.
```js
const MyForm = React.createClass({
  getInitialState() {
    values: {
      firstName: {value: 'Eric'},
      lastName: {value: 'Valadas'}
    }
  },

  render() {
    return (
      <Form values={this.state.values}>
        <Input name="firstName" validators={[required()]}/>
        <Input name="lastName" validators={[required()]}/>
      </Form>
    );
  }
});
```

You can make use of the initial values to set messages on your fields as well, such as server-side validation errors after submitting the form.
```js
const MyForm = React.createClass({
  getInitialState() {
    values: {}
  },

  handleSubmit(e, form) {
    this.setState({
      values: {
        username: {message: 'Username already exists.'}
      }
    });
  },

  render() {
    return (
      <Form values={this.state.values} onSubmit={this.handleSubmit}>
        <Input name="username"/>
      </Form>
    );
  }
});
```


To make these values actually appear in your fields, you must add the appropriate `value` prop. For most input fields, you must use the React prop `defaultValue` to prevent the input from becoming a `Controlled Component`. This is included in the spread prop `this.props.element` for you. For checkbox type inputs, you must use the `checked` property.
```js
const Text = Field(React.createClass({
  render() {
    return (
      <div className="row">
        <input {...this.props.element} type="text"/>
      </div>
    );
  }
}));

const Checkbox = Field(React.createClass({
  render() {
    return (
      <div className="row">
        <input {...this.props.element} type="checkbox" checked={this.props.value}/>
      </div>
    );
  }
}));
```

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

const MyForm = React.createClass({
  render() {
    return (
      <Form>
        <Input name="username" validators={[minLength(3)]}/>
      </Form>
    );
  }
});
```

All fields have a `validate` function that will run through their list of validators. By default, `validate` is only called when the form is submitted. However, this function is passed down as a prop and can be called whenever you like. Here's an example of validating a field as you type.
```js
const Input = Field(React.createClass({
  handleChange(e) {
    this.props.element.onChange(e).then(this.props.validate);
  },

  render() {
    return (
      <div className="row">
        <input {...this.props.element} onChange={this.handleChange}/>
      </div>
    );
  }
}));
```
