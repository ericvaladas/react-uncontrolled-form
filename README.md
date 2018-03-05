# React Uncontrolled Form

A 2kb library for building forms and validation with uncontrolled fields in React.

[![npm version](https://badge.fury.io/js/react-uncontrolled-form.svg)](https://badge.fury.io/js/react-uncontrolled-form)
[![Travis build status](http://img.shields.io/travis/ericvaladas/react-uncontrolled-form.svg)](https://travis-ci.org/ericvaladas/react-uncontrolled-form)
[![Coverage Status](https://coveralls.io/repos/github/ericvaladas/react-uncontrolled-form/badge.svg?branch=master)](https://coveralls.io/github/ericvaladas/react-uncontrolled-form?branch=master)
[![Dependency Status](https://david-dm.org/ericvaladas/react-uncontrolled-form.svg)](https://david-dm.org/ericvaladas/react-uncontrolled-form)
[![devDependency Status](https://david-dm.org/ericvaladas/react-uncontrolled-form/dev-status.svg)](https://david-dm.org/ericvaladas/react-uncontrolled-form?type=dev)
[![gzip size](http://img.badgesize.io/https://unpkg.com/react-uncontrolled-form/dist/react-uncontrolled-form.min.js?compression=gzip&label=gzip)](https://unpkg.com/react-uncontrolled-form/dist/react-uncontrolled-form.min.js)

## Usage

Install the package with npm.
```sh
npm install --save react-uncontrolled-form
```

Import the `Field` and `Form` components.
```js
import { Field, Form } from 'react-uncontrolled-form';
```

### Example
```js
class MyForm extends React.Component {
  handleSubmit(form) {
  }

  render() {
    return (
      <Form onSubmit={form => this.handleSubmit(form)}>
        <Field>
          {() => <input name="email" type="email"/>}
        </Field>
        <Field validators={[minLength(6)]}>
          {state =>
            <div>
              <input name="password" type="password"/>
              <div>{state.message}</div>
            </div>
          }
        </Field>
        <button>Submit</button>
      </Form>
    );
  }
}
```

### CodeSandbox Examples
- [Field Validation](https://codesandbox.io/s/vvryvlrn95)
- [Form Validation](https://codesandbox.io/s/48jjv19mx7)
- [Initial Values](https://codesandbox.io/s/7ry6ykr80)

### Field Component
The `Field` component requires its children to be a function that returns JSX. When a `Field` renders it will call the children function, passing `state` and `validate` as arguments, and render the output. During the render, if an element with a `name` attribute is found, it will be registered with the `Form` and have the necessary props passed to it.

### Form Component
The `Form` component will render a `<form>` element and validate its `Field` components on submission. A `form` prop, containing essential field registration functions, is automatically passed to all child components to be used by the `Field` component. If you nest a `Field` component inside another component, you must pass along the `form` prop to it.

### Form submission
When a form is submitted, all fields will have their validators run. The `onSubmit` event handler is passed an object containing the form's validity, values, and invalid fields.
```js
class MyForm extends React.Component {
  handleSubmit(form) {
    if (form.valid) {
      console.log('Form values:', form.values);
    }
  },

  render() {
    return (
      <Form onSubmit={form => this.handleSubmit(form)}>
        <Field>
          {() => <input name="username"/>}
        </Field>
        <button>Submit</button>
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
        <Field>
          {() => <input name="firstName"/>}
        </Field>
        <Field>
          {() => <input name="lastName"/>}
        </Field>
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
        <Field validators={[minLength(3)]}>
          {state =>
            <div>
              <input name="username"/>
              <div>{state.message}</div>
            </div>
          }
        </Field>
      </Form>
    );
  }
}
```
The validation message will be passed to your Field component via `state.message`. If a validator does not return a message, the field is considered valid.
```js
class MyForm extends React.Component {
  render() {
    return (
      <Form>
        <Field>
          {state =>
            <div className={'form-group' + (state.valid ? '' : ' has-error')}>
              <label className="control-label" htmlFor="username">Username</label>
              <input name="username" id="username" className="form-control"/>
              <span className="help-block">{state.message}</span>
            </div>
          }
        </Field>
      </Form>
    );
  }
};
```

### Validation
All fields have a `validate` function that will call each validator in the `validators` prop. By default, `validate` is only called when the form is submitted. However, this function is passed to the render prop and can be called whenever you like. Here's an example of validating a field as you type.
```js
class MyForm extends React.Component {
  render() {
    return (
      <Form>
        <Field validators={[minLength(3)]}>
          {(state, validate) =>
            <div>
              <input name="username" onChange={validate}/>
              <div>{state.message}</div>
            </div>
          }
        </Field>
      </Form>
    );
  }
}
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
      <Form messages={this.state.messages} onSubmit={form => this.handleSubmit(form)}>
        <Field>
          {state =>
            <div>
              <input name="username"/>
              <div>{state.message}</div>
            </div>
          }
        </Field>
      </Form>
    );
  }
}
```

#### Field Dependant Validation
If you need access to another field's value for validation, you can do so by adding a `ref` to your form. To retrieve the value, call the form's `values` function.
```js
function match(compareValue, fieldName) {
  return value => {
    if (compareValue() !== value) {
      return fieldName + ' does not match';
    }
  };
}

class MyForm extends React.Component {
  render() {
    return (
      <Form ref={form => this.form = form}>
        <Field>
          {() => <input name="email" type="email"/>}
        </Field>
        <Field
          validators={[match(() => this.form.values().email, 'Email')]}
          exclude={true}
        >
          {state =>
            <div>
              <input name="confirm-email" type="email"/>
              <div>{state.message}</div>
            </div>
          }
        </Field>
      </Form>
    );
  }
}
```

### Nested Components
The `Form` component uses a `form` prop to provide field registration functions, initial values, and messages to its child components. If you want to nest a `Field` component inside another component, you will need to pass the `form` prop manually.
```js
class MyComponent extends React.Component {
  render() {
    return (
      <Field form={this.props.form}>
        {() => <input name="username"/>}
      </Field>
    );
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

### Transform
The value of any field can be transformed by passing the `transform` prop to the `Field` component. For example, a checkbox input will have the value `"on"` if no value is provided, but it can be changed to a boolean value if that is preferred.
```js
class MyForm extends React.Component {
  render() {
    return (
      <Form>
        <Field transform={value => Boolean(value)}>
          {() =>
            <label>
              <input name="agree-to-terms" type="checkbox"/>
              I agree to the terms
            </label>
          }
        </Field>
      </Form>
    );
  }
}
```

### Custom Change Events
If you create a custom input, or use a component like [react-select](https://github.com/JedWatson/react-select), which passes a custom value to the `onChange` handler, the `Field` component will still register the value. The field's value will be set to the argument passed to `onChange`. The `Field` component passes an `onChange` prop to the child with a `name` attribute, so you do not need to set one yourself.

#### React-Select
With the use of a couple optional props, react-select works just as you'd expect. In this example, `simpleValue` and `multi` set to `true` will produce a value of `"one,two"`. Using this in combination with the `transform` prop on the `Field`, a value of `["one", "two"]` can be achieved.
```js
class MyForm extends React.Component {
  render() {
    <Form>
      <Field transform={value => value.split(',')}>
        {state =>
          <Select
            name="numbers"
            value={state.value}
            simpleValue={true}
            multi={true}
            options={[
              {value: 'one', label: 'One'},
              {value: 'two', label: 'Two'},
            ]}
          />
        }
      </Field>
    </Form>
  }
}
```



### Form Props

| Prop | Description |
| --- | --- |
| [`onSubmit`](#form-submission) | A callback function<br>`onSubmit({valid: [bool], values: {...}, invalidFields: {...}}` |
| [`values`](#initial-values) | An object that will provide values to the form's fields |
| [`messages`](#validation) | An object that will provide messages to the form's fields |

### Field Props

| Prop | Description |
| --- | --- |
| `form` | An object containing the form's registration functions, initial values, and messages |
| `validators` | An array containing the field's [validators](#validators) |
| `exclude` | A boolean that, when set to `true`, will exclude this field from the form's values |

**Note: `name` is a required prop that you must pass to your field as it is the lookup key for the field's value.**

