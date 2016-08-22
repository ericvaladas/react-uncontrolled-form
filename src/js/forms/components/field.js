import React from 'react';
import classNames from 'classnames';


export default function(WrappedComponent) {
  const Field = React.createClass({
    getInitialState() {
      return {
        value: "",
        errorMessage: "",
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
        if (!validator.validate(this.state.value)) {
          this.setState({
            valid: false,
            errorMessage: validator.errorMessage()
          });
          return false;
        }
      }
      this.setState({valid: true});
      return true;
    },

    handleChange(event) {
      switch (event.target.type) {
        case "text":
          this.setState({value: event.target.value}); break;
        case "checkbox":
          this.setState({value: event.target.checked}); break;
        default:
          break;
      }
    },

    render() {
      let className = classNames({
        'form-row': true,
        'invalid': !this.state.valid
      });

      return (
        <div className={className}>
          <WrappedComponent handleChange={this.handleChange} errorMessage={this.state.errorMessage}/>
        </div>
      );
    }
  });
  return Field;
}
