import React from 'react';
import PropTypes from 'prop-types';



class Field extends React.Component {
  constructor(props) {
    super(props);
    if (!props.form) {
      throw new Error(
        'The prop `form` is required. If a Field component is nested ' +
        'inside another component, you must pass the `form` prop to it.'
      );
    }
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  componentWillUnmount() {
    this.props.form.unregisterField(this);
  }

  componentDidMount() {
    this.setState({
      checked: this.checked(),
      message: this.props.form.messages[this.name],
      timestamp: 0,
      valid: true,
      value: this.props.form.initialValues[this.name]
    });
    this.props.form.registerField(this);
  }

  componentWillReceiveProps(nextProps) {
    const message = this.props.form.messages[this.name];
    const nextMessage = nextProps.form.messages[this.name];
    if (nextMessage !== message) {
      this.setState({message: nextMessage});
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
    return new Promise(resolve => {
      const state = {};
      if (event.target) {
        state.type = event.target.type;
        state.timestamp = event.timeStamp;

        switch (event.target.type) {
          case 'checkbox':
            state.checked = event.target.checked;
            state.value = event.target.checked ? event.target.value : null;
            break;
          case 'select-multiple':
            state.value = Array.from(event.target.options)
                .map(option => option.selected ? option.value : null)
                .filter(value => value);
            break;
          case 'file':
            state.value = event.target.files;
            break;
          default:
            state.value = event.target.value;
        }
      }

      if (event.value) {
        state.value = event.value;
      }

      this.setState(state, () => {
        if (this.onChange) {
          this.onChange(event);
        }
        resolve();
      });
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
