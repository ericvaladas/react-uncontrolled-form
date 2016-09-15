import React from 'react';
import Field from '../src/field';
import {required} from './validators';


const InputField = Field(React.createClass({
  render() {
    return (
      <input {...this.props.element}/>
    );
  }
}));

const RequiredInputField = Field(React.createClass({
  validators: [required()],

  render() {
    return (
      <input {...this.props.element}/>
    );
  }
}));

const SelectField = Field(React.createClass({
  options() {
    return this.props.element.options.map((option) => {
      return <option key={option}>{option}</option>;
    });
  },

  render() {
    let elementProps = Object.assign({}, this.props.element);
    delete elementProps.options;

    return (
      <select {...elementProps}>
        {this.options()}
      </select>
    );
  }
}));

export {InputField, RequiredInputField, SelectField};
