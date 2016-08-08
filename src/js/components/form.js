import React from 'react';
import TextField from './fields/text-field';
import EmailField from './fields/email-field';
import MinLengthValidator from '../validators/min-length';


export default React.createClass({
  componentWillMount() {
    this.fields = [];
  },

  validate() {
    let valid = true;
    for (let field of this.fields) {
      if (!field.validate()) {
        valid = false;
      }
    }
    return valid;
  },

  handleSubmit(e) {
    e.preventDefault();
    if (!this.validate()) {
      console.log('form is invalid');
    }
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField name="name" label="Name" ref={(field) => { this.fields.push(field); }} validators={[MinLengthValidator(3)]}/>
        <EmailField name="email" label="Email" ref={(field) => { this.fields.push(field); }}/>
        <button type="submit">Submit</button>
      </form>
    );
  }
});
