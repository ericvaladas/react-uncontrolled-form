# Formwood

A lightweight and uncomplicated library for building forms and validation with React.

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

Import the `Field` and `Form` modules.
```js
import {Field, Form} from 'formwood';
```

### Field and Form
`Field` is a higher order component that will add the necessary functionality to your form fields. You must create a component for your input and then wrap the component with `Field`. The final step for your field is to spread `this.props.element` on the input element. Then, use the `Form` component in place of a `form` tag.

```js
const Input = Field(React.createClass({
  render() {
    return (
      <div className="row">
        <label>{this.props.label}</label>
        <input {...this.props.element}/>
      </div>
    );
  }
}));

const MyForm = React.createClass({
  render() {
    return (
      <Form>
        <Input name="username" type="text" label="Username"/>
      </Form>
    );
  }
});
```
Spreading `this.props.element` on the input element will add all your props, such as `name` and `type`, as well as an `onChange` and `defaultValue` prop. The `name` is a required prop, as it is the lookup key for the field's value. The `onChange` handler will store the value of the input in its state, which is later used for form values and validation. The `defaultValue` prop will set the input with an initial value provided by the `Form`.

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
        <Input name="username" type="text"/>
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
        <Input name="firstName" type="text"/>
        <Input name="lastName" type="text"/>
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
        <Input name="username" type="text"/>
      </Form>
    );
  }
});
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
        <Input name="username" type="text" validators={[minLength(3)]}/>
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
