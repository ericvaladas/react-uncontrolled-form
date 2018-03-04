import React from 'react';


class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {valid: true};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.registerField = this.registerField.bind(this);
    this.unregisterField = this.unregisterField.bind(this);
  }

  componentWillMount() {
    this.fields = {};
    this.invalidFields = {};
  }

  validate() {
    return new Promise(resolve => {
      this.invalidFields = {};
      for (const fieldName in this.fields) {
        for (const field of this.fields[fieldName]) {
          if (field && !field.validate()) {
            this.invalidFields[fieldName] = field;
          }
        }
      }
      this.setState({
        valid: Object.keys(this.invalidFields).length === 0
      }, resolve);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    return this.validate()
      .then(() => {
        if (this.props.onSubmit) {
          this.props.onSubmit({
            valid: this.state.valid,
            values: this.values(),
            invalidFields: this.invalidFields
          });
        }
      });
  }

  getField(fieldName) {
    return this.fields[fieldName].sort((a, b) => {
      return b.state.timestamp - a.state.timestamp;
    })[0];
  }

  getCheckboxValues(fieldName) {
    const fieldValues = [];
    for (const field of this.fields[fieldName]) {
      if (field.state.value && field.state.checked) {
        fieldValues.push(field.props.value || field.state.value);
      }
    }
    return fieldValues;
  }

  values() {
    const values = {};
    Object.keys(this.fields)
      .filter(fieldName => this.fields[fieldName].length)
      .forEach(fieldName => {
        const field = this.getField(fieldName);
        switch (field.state.type) {
          case 'checkbox': {
            const fieldValues = this.getCheckboxValues(fieldName);
            if (fieldValues.length === 1) {
              values[fieldName] = fieldValues[0];
            }
            else if (fieldValues.length > 1) {
              values[fieldName] = fieldValues;
            }
            break;
          }
          default:
            if (field.state.value !== undefined) {
              values[fieldName] = field.state.value;
            }
        }
      });
    return values;
  }

  addPropsToChildren(children) {
    if (!children || children.constructor === Function) {
      return children;
    }
    return React.Children.map(children, child => {
      if (child && child.props) {
        const props = {
          children: this.addPropsToChildren(child.props.children)
        };
        if (child.type.constructor === Function) {
          props.form = {
            registerField: this.registerField,
            unregisterField: this.unregisterField,
            initialValue: this.props.values[child.props.name],
            message: this.props.messages[child.props.name]
          };
        }
        child = React.cloneElement(child, props);
      }
      return child;
    });
  }

  registerField(field) {
    const name = field.name;
    if (!this.fields[name]) {
      this.fields[name] = [];
    }
    this.fields[name].push(field);
  }

  unregisterField(field) {
    const fields = this.fields[field.name];
    fields.splice(fields.indexOf(field), 1);
  }

  render() {
    const children = this.addPropsToChildren(this.props.children);
    const formProps = Object.assign({}, this.props);
    delete formProps.values;
    delete formProps.messages;

    return (
      <form {...formProps} onSubmit={this.handleSubmit}>
        {children}
      </form>
    );
  }
}

Form.defaultProps = {
  values: {},
  messages: {}
};

export default Form;

