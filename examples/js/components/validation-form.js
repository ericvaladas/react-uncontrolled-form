import React from 'react';
import Field from '../../../src/js/forms/components/field';
import Form from '../../../src/js/forms/components/form'

function minLength(length) {
  return (value) => {
    if (value && value.length >= length) {
      return true;
    }
    return `Must be at least ${length} characters`
  };
}

function required() {
  return (value) => {
    if (!!value === true) {
      return true;
    }
    return 'Required';
  };
};


const InputField = Field(React.createClass({
  render() {
    let classNames = "form-group";
    if (this.props.message) {
      classNames += " has-error";
    }
    return (
      <div className={classNames}>
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input className="form-control" type={this.props.type} name={this.props.name} id={this.props.id} onChange={this.props.handleChange} defaultValue={this.props.value}/>
        <span className="help-block">{this.props.message}</span>
      </div>
    );
  }
}));

export default React.createClass({
  getInitialState() {
    return {
      values: {}
    }
  },

  handleSubmit(e, valid, values) {
    if (valid) {
      this.setState({values: {}});

      // Get response from server
      this.setState({values: {
        username: {
          message: "Username already exists"
        },
      }});
    }
  },

  render() {
    return (
      <Form onSubmit={this.handleSubmit} values={this.state.values}>
        <h2>Form With Validation</h2>
        <InputField type="text" name="username" id="username" label="Username" validators={[required(), minLength(3)]}/>
        <InputField type="password" name="password" id="password" label="Password" validators={[required(), minLength(6)]}/>
        <button className="btn btn-primary" type="submit">Submit</button>
      </Form>
    );
  }
});
