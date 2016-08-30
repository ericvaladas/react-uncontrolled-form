import React from 'react';


export default function(WrappedComponent) {
  const Field = React.createClass({
    getInitialState() {
      return {
        value: this.props.value,
        message: this.props.message,
        valid: true
      };
    },

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.value != this.props.value) {
        this.setState({value: this.props.value});
      }
      if (prevProps.message != this.props.message) {
        this.setState({message: this.props.message});
      }
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

    elementProps() {
      const elementProps = Object.assign({
        onChange: this.handleChange,
        defaultValue: this.props.value
      }, this.props);

      delete(elementProps.message);
      delete(elementProps.validators);
      delete(elementProps.value);

      return elementProps;
    },

    render() {
      return (
        <WrappedComponent element={this.elementProps()} label={this.props.label} message={this.state.message} validate={this.validate} value={this.state.value}/>
      );
    }
  });
  return Field;
};
