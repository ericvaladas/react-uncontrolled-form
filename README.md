# React Uncontrolled Form

A small library for building forms and validation with uncontrolled fields in React.

[![npm version](https://badge.fury.io/js/react-uncontrolled-form.svg)](https://badge.fury.io/js/react-uncontrolled-form)
[![Travis build status](http://img.shields.io/travis/ericvaladas/react-uncontrolled-form.svg)](https://travis-ci.org/ericvaladas/react-uncontrolled-form)
[![Coverage Status](https://coveralls.io/repos/github/ericvaladas/react-uncontrolled-form/badge.svg?branch=master)](https://coveralls.io/github/ericvaladas/react-uncontrolled-form?branch=master)
[![Dependency Status](https://david-dm.org/ericvaladas/react-uncontrolled-form.svg)](https://david-dm.org/ericvaladas/react-uncontrolled-form)
[![devDependency Status](https://david-dm.org/ericvaladas/react-uncontrolled-form/dev-status.svg)](https://david-dm.org/ericvaladas/react-uncontrolled-form?type=dev)

## Usage

Install the package with npm.
```sh
npm install --save react-uncontrolled-form
```

Import the `Field` and `Form` modules.
```js
import {Field, Form} from 'react-uncontrolled-form';
```

### Example
```js
const Input = Field(
  class extends React.Component {
    render() {
      return <input {...this.props.element}/>;
    }
  }
);

class MyForm extends React.Component {
  render() {
    return (
      <Form>
        <Input name="email" type="email"/>
        <Input name="password" type="password" validators={[minLength(6)]}/>
      </Form>
    );
  }
}
```

#### More Examples
https://ericvaladas.github.io/formwood-examples

### Field and Form
`Field` is a higher order component that will add the necessary functionality to your form fields. You must create a component for your input and wrap it with `Field`. Then, spread `this.props.element` on your input element. Lastly, use the `Form` component in place of a `form` tag when building your form.

Spreading `this.props.element` on the input element will add all your props, such as `name` and `type`, as well as an `onChange` and `defaultValue` prop. The `onChange` handler will store the value of the input in its state, which is later used for form values and validation. The `defaultValue` prop will set the input with an initial value provided by the `Form`.

**Note: `name` is a required prop as it is the lookup key for the field's value.**

### Form submission
When a form is submitted, all fields will have their validators run. The `onSubmit` event handler is passed an object containing the form's validity and its values.
```js
class MyForm extends React.Component {
  handleSubmit(form) {
    if (form.valid) {
      console.log('Form values:', form.values);
    }
  },

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Input name="username" type="text"/>
      </Form>
    );
  }
}
```

### Initial Values
You can pass initial values to your fields by adding the `values` prop to the `Form`.
```js
class MyForm extends React.Component {
  render() {
    const values = {
      firstName: 'Eric',
      lastName: 'Valadas'
    };

    return (
      <Form values={values}>
        <Input name="firstName" type="text"/>
        <Input name="lastName" type="text"/>
      </Form>
    );
  }
}
```

### Validators
Validators are simply functions that return an error message.
```js
function minLength(length) {
  return value => {
    if (!value || value.length < length) {
      return `Must be at least ${length} characters`;
    }
  };
}

class MyForm extends React.Component {
  render() {
    return (
      <Form>
        <Input name="username" type="text" validators={[minLength(3)]}/>
      </Form>
    );
  }
}
```
The validation message will be passed to your field component via the `message` prop. If a validator does not return a message, it is considered valid.
```js
const Input = Field(
  class extends React.Component {
    render() {
      let className = "form-group";
      if (!this.props.valid) {
        className += " has-error";
      }
      return (
        <div className={className}>
          <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
          <input className="form-control" {...this.props.element}/>
          <span className="help-block">{this.props.message}</span>
        </div>
      );
    }
  }
);
```

### Validation
All fields have a `validate` function that will run through their list of validators. By default, `validate` is only called when the form is submitted. However, this function is passed down as a prop and can be called whenever you like. Here's an example of validating a field as you type.
```js
const Input = Field(
  class extends React.Component {
    handleChange(e) {
      this.props.element.onChange(e).then(this.props.validate);
    },

    render() {
      return (
        <input {...this.props.element} onChange={e => this.handleChange(e)}/>
      );
    }
  }
);
```

You can also add field messages to your form which can be useful for things like server-side validation errors after submitting the form.
```js
class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {messages: {}};
  }

  handleSubmit() {
    this.setState({
      messages: {username: 'Username already exists'}
    });
  },

  render() {
    return (
      <Form messages={this.state.messages} onSubmit={this.handleSubmit}>
        <Input name="username" type="text"/>
      </Form>
    );
  }
}
```

### Nested Components
The `Form` component uses a `form` prop to provide field registration functions, initial values, and messages to its child components. However, if you want to nest a `Field` component inside another component, you will need to pass the `form` prop manually.
```js
class MyComponent extends React.Component {
  render() {
    return <Input name="username" type="text" form={this.props.form}/>
  }
}

class MyForm extends React.Component {
  render() {
    <Form>
      <MyComponent/>
    </Form>
  }
}
```

## API
### Form
You can obtain a `Form` instance by adding a `ref` prop to your form.
```js
render() {
  return (
    <Form ref={(form) => { this.form = form; }}>
      ...
    </Form>
  );
}
```
| Property | Type | Returns | Description |
| --- | --- | --- | --- |
| `fields` | `object` | `object` | `{fieldName: [field, ...], ...}` |
| `getCheckboxValues(fieldName)` | `function` | `Array` | An array of field values |
| `getField(fieldName)` | `function` | `Field instance` | The most recently changed field for the given name |
| `handleSubmit(e)` | `function` | `Promise` | Calls `validate` then calls `props.onSubmit` |
| `invalidFields` | `object` | `object` | `{fieldName: field, ...}` |
| `validate()` | `function` | `Promise` | Calls `validate` on all fields |
| `values()` | `function` | `object` | `{fieldName: fieldValue, ...}` |

| Prop | Description |
| --- | --- |
| [`onSubmit`](#form-submission) | Passes an additional form object argument to your handler<br>`onSubmit({valid: [bool], values: {...}, invalidFields: {...}}` |
| [`values`](#initial-values) | An object that contains values for the form's fields |
| [`messages`](#validation) | An object that contains messages for the form's fields |

### Field
These properties are passed down to your field via props.

| Property | Type | Returns | Description |
| --- | --- | --- | --- |
| `handleChange(e)` | `function` | `Promise` | Sets the `value` property of the state |
| `validate()` | `function` | `boolean` | Calls each validator and sets the `valid` and `message` properties of the state |

| Prop | Description |
| --- | --- |
| `element` | Contains essential props (listed below) and any prop you pass to your field |
| `element.defaultChecked` | The initial checked value for the element |
| `element.defaultValue` | The initial value for the element |
| [`element.onChange`](#validation) | The field's `handleChange` function |
| `message` | The message returned by a validator or a form's `messages` prop |
| `valid` | The valid property in the field's state. The initial value is `true` |
| `validate` | The field's `validate` function |
| `validators` | An array of validators |
| `value` | The value property in the field's state |

**Note: `name` is a required prop that you must pass to your field as it is the lookup key for the field's value.**

