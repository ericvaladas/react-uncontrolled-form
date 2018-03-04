import React from 'react';
import PropTypes from 'prop-types';



class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.checked(),
      message: this.props.form.message,
      timestamp: 0,
      valid: true,
      value: this.props.form.initialValue
    };
    if (!props.form) {
      throw new Error(
        'The prop `form` is required. If a Field component is nested ' +
        'inside another component, you must pass the `form` prop to it.'
      );
    }
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    this.props.form.registerField(this);
  }

  componentWillUnmount() {
    this.props.form.unregisterField(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.form.message !== this.props.form.message) {
      this.setState({message: nextProps.form.message});
    }
  }

  validate() {
    for (const validator of this.props.validators) {
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
      timestamp: event.timeStamp
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
      this.props.value &&
      this.props.value === this.props.form.initialValue ||
      this.props.form.initialValue && !this.props.value ||
      this.props.form.initialValue &&
      this.props.form.initialValue.constructor === Array &&
      this.props.form.initialValue.indexOf(this.props.value) >= 0
    );
  }

  render() {
    const elementProps = Object.assign({
      defaultChecked: this.checked(),
      defaultValue: this.props.value || this.props.form.initialValue,
      onChange: this.handleChange
    }, this.props);

    const discard = ['checked', 'form', 'label', 'validators', 'value', 'children'];

    discard.forEach(property => {
      delete elementProps[property];
    });

    return this.props.children(elementProps, this.state, this.validate);
  }
}

Field.propTypes = {
  name: PropTypes.string.isRequired
};

Field.defaultProps = {
  validators: []
};

export default Field;
