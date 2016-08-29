import React from 'react';
import Field from '../../../src/js/field';
import Form from '../../../src/js/form';
import {minLength, passwordEquals, required} from '../validators';


const InputField = Field(React.createClass({
  handleChange(e) {
    this.props.handleChange(e).then(this.props.validate);
  },

  render() {
    let classNames = "form-group";
    if (this.props.message) {
      classNames += " has-error";
    }
    return (
      <div className={classNames}>
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input autoComplete="off" className="form-control" type={this.props.type} name={this.props.name} id={this.props.id} onChange={this.handleChange} defaultValue={this.props.value}/>
        <span className="help-block">{this.props.message}</span>
      </div>
    );
  }
}));

const CheckboxField = Field(React.createClass({
  render() {
    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" onChange={this.props.handleChange} checked={this.props.value}/>
          {this.props.label}
        </label>
      </div>
    );
  }
}));


export default React.createClass({
  getInitialState() {
    return {
      values: {
        username: {value: 'Jo'},
        junkmail: {value: true}
      }
    }
  },

  passwordValue() {
    if (this.form) {
      return this.form.fields.password.state.value;
    }
  },

  render() {
    return (
      <Form values={this.state.values} ref={(form) => { this.form = form; }}>
        <h2>Advanced Form</h2>
        <InputField type="text" name="username" id="username" label="Username" validators={[required(), minLength(4)]}/>
        <InputField type="password" name="password" id="password" label="Password" validators={[required(), minLength(6)]}/>
        <InputField type="password" name="password-confirm" id="password-confirm" label="Confirm" validators={[required(), passwordEquals(this.passwordValue)]}/>
        <CheckboxField name="junkmail" label="Sign me up for junk"/>
        <button className="btn btn-primary" type="submit">Submit</button>
      </Form>
    );
  }
});
