import React from 'react';


export default function(WrappedComponent) {
  const Field = React.createClass({
    getInitialState() {
      return {
        value: this.props.initialValue,
        message: this.props.message,
        valid: true,
        timestamp: 0
      };
    },

    componentDidMount() {
      this.validators = this.props.validators || [];
      if (this.component && this.component.validators) {
        this.validators = this.component.validators.concat(this.validators);
      }
    },

    componentDidUpdate(prevProps) {
      if (prevProps.value !== this.props.value) {
        this.setState({value: this.props.value});
      }
      if (prevProps.message !== this.props.message) {
        this.setState({message: this.props.message});
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
      this.setState({valid: true, message: ''});
      return true;
    },

    handleChange(event) {
      this.setState({timestamp: Date.now()});

      return new Promise((resolve) => {
        switch (event.target.type) {
          case 'checkbox':
          case 'radio':
            this.setState({value: event.target.value}, resolve);
            break;
          case 'select-multiple':
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
        defaultChecked: this.props.value === this.props.initialValue,
        defaultValue: this.props.value || this.state.value,
        onChange: this.handleChange
      }, this.props);

      delete elementProps.initialValue;
      delete elementProps.message;
      delete elementProps.validators;
      delete elementProps.value;

      return elementProps;
    },

    render() {
      return (
        <WrappedComponent
          element={this.elementProps()}
          label={this.props.label}
          message={this.state.message}
          validate={this.validate}
          value={this.state.value}
          initialValue={this.props.initialValue}
          ref={(component) => { this.component = component;}}
        />
      );
    }
  });
  return Field;
}
