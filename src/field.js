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

    componentWillMount() {
      if (this.props.value) {
        this.setState({checked: this.props.value === this.state.value});
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
      if (this.props.validators) {
        for (let validator of this.props.validators) {
          let result = validator(this.state.value);
          if (result !== true) {
            this.setState({valid: false, message: result});
            return false;
          }
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
            this.setState({value: event.target.checked}, resolve);
            break;
          case 'radio':
            this.setState({value: event.target.value}, () => {
              this.setState({checked: this.props.value === this.state.value}, resolve);
            });
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
      console.log(this.props.name, this.state.checked);
      const elementProps = Object.assign({
        onChange: this.handleChange,
        defaultValue: this.props.value || this.state.value,
        checked: this.state.checked
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
        />
      );
    }
  });
  return Field;
}
