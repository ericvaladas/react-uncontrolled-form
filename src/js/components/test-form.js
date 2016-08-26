import React from 'react';
import MinLengthValidator from '../forms/validators/min-length';
import EmailValidator from '../forms/validators/email';
import RequiredValidator from '../forms/validators/required';
import ExactValidator from '../forms/validators/exact';
import Field from '../forms/components/field';
import Form from '../forms/components/form'
import TermsConditions from './fields/terms-conditions';
import ReactDom from 'react-dom';


const TextField = Field(React.createClass({
  handleChange(e) {
    this.props.handleChange(e)
      .then(this.props.validate);
  },

  render() {
    let classNames = "form-row";
    if (!this.props.valid) {
      classNames += " invalid";
    }
    return (
      <div className={classNames}>
        <label>Name</label>
        <input type="text" name={this.props.name} id={this.props.id} onChange={this.handleChange} />
        <span className="message">{this.props.message}</span>
      </div>
    );
  }

}));

const EmailField = Field(React.createClass({
  render() {
    return (
      <div>
        <label>Email</label>
        <input type="text" name={this.props.name} id={this.props.id} onChange={this.props.handleChange} />
        <span className="message">{this.props.message}</span>
      </div>
    );
  }
}));

const PasswordField = Field(React.createClass({
  render() {
    return (
      <div>
        <label>Password</label>
        <input type="text" name={this.props.name} id={this.props.id} onChange={this.props.handleChange} />
        <span className="message">{this.props.message}</span>
      </div>
    );
  }
}));


const Checkbox = Field(React.createClass({
  render() {
    return (
        <div className="checkbox">
          <input type="checkbox" id="legal--i-agree" name="legal" value="i-agree" required="" data-audit-required="true" data-audit-error-message="Agree or Not" data-audit-multiple="legal" onChange={this.props.handleChange}/>
          <label className="label" htmlFor="legal--i-agree">I agree</label>
        </div>
    );
  }
}));


export default React.createClass({

  getInitialState() {
    return {
      invalidFieldCount: 0
    };
  },

  handleSubmit(e, values) {
    if (this.form.state.valid) {
      console.log(values);
    }
    else {
      console.log('form is invalid');
    }

    this.setState({invalidFieldCount: Object.keys(this.form.invalidFields).length});
  },

  render() {
    return (
      <Form onSubmit={this.handleSubmit} ref={(form) => { this.form = form; }}>

        {this.state.invalidFieldCount} invalid fields

        <TextField name="something" id="something" validators={[MinLengthValidator(3)]}/>

        <PasswordField name="password" id="password" validators={[RequiredValidator()]}/>
        <PasswordField name="password2" id="password2" validators={[RequiredValidator(), ExactValidator(() => { return this.form.fields.password.state.value })]} />

        <EmailField name="email" id="email" validators={[EmailValidator()]}/>
        <TermsConditions name="terms" id="terms" validators={[RequiredValidator()]}/>

        <button type="submit">submit</button>

      </Form>

    );
  }
});
