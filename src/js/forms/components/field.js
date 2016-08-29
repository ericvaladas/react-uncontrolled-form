import React from 'react';


export default function(WrappedComponent) {
  const Field = React.createClass({
    getInitialState() {
      return {
        value: this.props.value,
        message: "",
        valid: true
      };
    },

    validate() {
      if (this.props.validators) {
        for (let validator of this.props.validators) {
          let result = validator(this.state.value);
          if (result !== true) {
            this.setState({valid: false, message: result});
            return false;
          }
        }
      }
      this.setState({valid: true, message: ""});
      return true;
    },

    handleChange(event) {
      return new Promise((resolve) => {
        switch (event.target.type) {
          case "checkbox":
            this.setState({value: event.target.checked}, resolve);
            break;
          case "select-multiple":
            this.setState({
              value: Array.from(event.target.selectedOptions).map((option) => {
                return option.value;
              })}, resolve);
            break;
          default:
            this.setState({value: event.target.value}, resolve);
        }
      });
    },

    render() {
      return (
        <WrappedComponent {...this.props} handleChange={this.handleChange} message={this.state.message} validate={this.validate} value={this.state.value}/>
      );
    }
  });
  return Field;
};
