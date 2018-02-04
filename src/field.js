import React from 'react';
import PropTypes from 'prop-types';


export default function(WrappedComponent) {
  class Field extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        checked: this.checked(),
        message: this.props.message,
        timestamp: 0,
        valid: true,
        value: this.props.initialValue
      };
      this.checked = this.checked.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.validate = this.validate.bind(this);
    }

    componentDidMount() {
      this.props.form.registerField(this);

      this.validators = this.props.validators || [];
      if (this.component && this.component.validators) {
        this.validators = this.component.validators.concat(this.validators);
      }
    }

    componentWillUnmount() {
      this.props.form.unregisterField(this);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.message !== this.props.message) {
        this.setState({message: nextProps.message});
      }
    }

    validate() {
      for (const validator of this.validators) {
        const result = validator(this.state.value);
        if (result !== undefined) {
          this.setState({valid: false, message: result});
          return false;
        }
      }
      this.setState({valid: true, message: ''});
      return true;
    }

    handleChange(event) {
      this.setState({
        type: event.target.type,
        timestamp: Date.now()
      });

      return new Promise(resolve => {
        switch (event.target.type) {
          case 'checkbox':
            this.setState({
              checked: event.target.checked,
              value: event.target.checked ? event.target.value : null
            }, resolve);
            break;
          case 'select-multiple':
            this.setState({
              value: Array.from(event.target.options)
                .map(option => option.selected ? option.value : null)
                .filter(value => value)
            }, resolve);
            break;
          case 'file':
            this.setState({value: event.target.files}, resolve);
            break;
          default:
            this.setState({value: event.target.value}, resolve);
        }
      });
    }

    checked() {
      return (
        this.props.checked ||
        this.props.value &&
        this.props.value === this.props.initialValue ||
        this.props.initialValue && !this.props.value ||
        this.props.initialValue &&
        this.props.initialValue.constructor === Array &&
        this.props.initialValue.indexOf(this.props.value) >= 0
      );
    }

    elementProps() {
      const elementProps = Object.assign({
        defaultChecked: this.checked(),
        defaultValue: this.props.value || this.props.initialValue,
        onChange: this.handleChange
      }, this.props);

      delete elementProps.checked;
      delete elementProps.form;
      delete elementProps.initialValue;
      delete elementProps.label;
      delete elementProps.message;
      delete elementProps.validators;
      delete elementProps.value;
      return elementProps;
    }

    render() {
      return (
        <WrappedComponent
          element={this.elementProps()}
          {...this.props}
          message={this.state.message}
          valid={this.state.valid}
          validate={this.validate}
          value={this.state.value}
          ref={component => { this.component = component;}}
        />
      );
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired
  };

  return Field;
}

