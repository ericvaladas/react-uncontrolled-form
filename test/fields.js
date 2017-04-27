import React from 'react';
import Field from '../src/field';
import {required} from './validators';


const InputField = Field(
  class extends React.Component {
    render() {
      return (
        <input {...this.props.element} placeholder={this.props.message}/>
      );
    }
  }
);

const RequiredInputField = Field(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.validators = [required()];
    }

    render() {
      return (
        <input {...this.props.element}/>
      );
    }
  }
);

const SelectField = Field(
  class extends React.Component {
    options() {
      return this.props.element.options.map((option) => {
        return <option key={option}>{option}</option>;
      });
    }

    render() {
      let elementProps = Object.assign({}, this.props.element);
      delete elementProps.options;

      return (
        <select {...elementProps}>
          {this.options()}
        </select>
      );
    }
  }
);

export {InputField, RequiredInputField, SelectField};
