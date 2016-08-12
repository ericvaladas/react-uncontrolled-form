import React from 'react';
import classNames from 'classnames';


const Field = React.createClass({
  children: [],

  getInitialState() {
    return {
      value: "",
      valid: true
    };
  },

  componentWillMount() {
    this.children = React.Children.map(this.props.children, (child) => {
      if (child.type.displayName === "ErrorMessage") {
        child = React.cloneElement(child, {
          ref: (errorMessage) => { this.errorMessage = errorMessage; }
        });
      }
      if (child.type === "input") {
        child = React.cloneElement(child, {
          onChange: this.handleChange,
        });
      }
      return child;
    });
  },

  componentDidMount() {
    this.validators = this.validators || [];
    let validators = this.props.validators;
    if (validators && validators.constructor === Array) {
      this.validators = this.validators.concat(validators);
    }
  },

  validate() {
    for (let validator of this.validators) {
      if (!validator.validate(this.state.value)) {
        this.setState({valid: false});
        if (this.errorMessage) {
          this.errorMessage.setState({
            message: validator.errorMessage()
          });
        }
        return false;
      }
    }
    this.setState({valid: true});
    return true;
  },

  handleChange(event) {
    this.setState({value: event.target.value});
  },

  render() {
    let className = classNames({
      'form-row': true,
      'invalid': !this.state.valid
    });

    return (
      <div className={className}>
        {this.children}
      </div>
    );
  }
});

const ErrorMessage = React.createClass({
  getInitialState() {
    return {
      message: ""
    };
  },

  render() {
    return (
      <span className="message">{this.state.message}</span>
    );
  }
});

export {Field, ErrorMessage};
