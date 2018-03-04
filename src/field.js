import React from 'react';


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

  checked(value) {
    const initialValue = this.props.form.initialValues[this.name];
    return (
      value &&
      value === initialValue ||
      initialValue && !value ||
      initialValue &&
      initialValue.constructor === Array &&
      initialValue.indexOf(value) >= 0
    );
  }

  addPropsToChildren(children) {
    return React.Children.map(children, child => {
      if (child && child.props) {
        const props = {
          children: this.addPropsToChildren(child.props.children)
        };
        if (child.props.name) {
          this.name = child.props.name;
          this.onChange = child.props.onChange;
          Object.assign(props, {
            defaultChecked: this.checked(child.props.value),
            defaultValue: child.props.value || this.props.form.initialValues[this.name],
            onChange: this.handleChange,
            value: child.type.constructor === Function ? child.props.value : undefined
          });
        }
        child = React.cloneElement(child, props);
      }
      return child;
    });
  }

  render() {
    const children = this.props.children(this.state, this.validate);
    return this.addPropsToChildren(children);
  }
}

Field.defaultProps = {
  validators: []
};

export default Field;
