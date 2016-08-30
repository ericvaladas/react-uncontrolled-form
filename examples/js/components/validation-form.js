import React from 'react';
import Field from '../../../src/js/field';
import Form from '../../../src/js/form';
import {minLength, required} from '../validators';

const InputField = Field(React.createClass({
  render() {
    let classNames = "form-group";
    if (this.props.message) {
      classNames += " has-error";
    }
    return (
      <div className={classNames}>
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input className="form-control" {...this.props.element}/>
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

  handleSubmit(e, form) {
    if (form.valid) {
      this.setState({values: {}});

      // Get response from server
      this.setState({
        values: {
          username: {message: "Username already exists"}
        }
      });
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
