import React from 'react';


export default function(WrappedComponent) {
  const Field = React.createClass({
    getInitialState() {
      return {
        value: "",
        message: "",
        valid: true
      };
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
        let result = validator(this.state.value);
        if (result !== true) {
          this.setState({valid: false, message: result});
          return false;
        }
      }
      this.setState({valid: true, message: ""});
      return true;
    },

    handleChange(event) {
      return new Promise((resolve) => {
        switch (event.target.type) {
          case "checkbox":
            this.setState({value: event.target.checked}, resolve); break;
          case "select-multiple":
            this.setState({
              value: Array.from(event.target.selectedOptions).map((option) => {
                return option.value;
              })
            }, resolve);
            break;
          default:
            this.setState({value: event.target.value}, resolve); break;
        }
      });
    },

    render() {
      return (
        <WrappedComponent handleChange={this.handleChange} message={this.state.message} validate={this.validate}/>
      );
    }
  });
  return Field;
}
