import React from 'react';


export default React.createClass({
  componentWillMount() {
    this.fields = {};
    this.invalidFields = {};
  },

  getInitialState() {
    return {valid: true};
  },

  getDefaultProps() {
    return {
      values: {},
      messages: {}
    };
  },

  validate() {
    return new Promise((resolve) => {
      this.invalidFields = {};
      for (let fieldName in this.fields) {
        for (let field of this.fields[fieldName]) {
          if (field && !field.validate()) {
            this.invalidFields[fieldName] = field;
          }
        }
      }
      this.setState({
        valid: Object.keys(this.invalidFields).length === 0
      }, resolve);
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    return this.validate()
      .then(() => {
        if (this.props.onSubmit) {
          this.props.onSubmit(e, {
            valid: this.state.valid,
            values: this.values(),
            invalidFields: this.invalidFields
          });
        }
      });
  },

  getField(fieldName) {
    return this.fields[fieldName].sort((a, b) => {
      return b.state.timestamp - a.state.timestamp;
    })[0];
  },

  getCheckboxValues(fieldName) {
    let fieldValues = [];
    for (let field of this.fields[fieldName]) {
      if (field.state.value && field.state.checked) {
        fieldValues.push(field.props.value || field.state.value);
      }
    }
    return fieldValues;
  },

  values() {
    let values = {};
    for (let fieldName in this.fields) {
      let field = this.getField(fieldName);
      switch (field.state.type) {
        case 'checkbox': {
          let fieldValues = this.getCheckboxValues(fieldName);
          if (fieldValues.length === 1) {
            values[fieldName] = fieldValues[0];
          }
          else if (fieldValues.length > 1) {
            values[fieldName] = fieldValues;
          }
          break;
        }
        default: {
          if (field && field.state.value) {
            values[fieldName] = field.state.value;
          }
        }
      }
    }
    return values;
  },

  addPropsToChildren(children, props) {
    return React.Children.map(children, (child) => {
      let childProps = {};
      if (child.props) {
        childProps.children = this.addPropsToChildren(child.props.children, props);
        if (child.type.constructor === Function) {
          const values = {
            initialValue: this.props.values[child.props.name],
            message: this.props.messages[child.props.name]
          };
          childProps = Object.assign(childProps, values, props);
        }
        child = React.cloneElement(child, childProps);
      }
      return child;
    });
  },

  registerField() {
    return {
      registerField: (field) => {
        const name = field.props.name;
        if (!this.fields[name]) {
          this.fields[name] = [];
        }
        this.fields[field.props.name].push(field)
      }
    }
  },

  render() {
    const children = this.addPropsToChildren(this.props.children, this.registerField());
    let formProps = Object.assign({}, this.props);
    delete formProps.values;
    delete formProps.messages;

    return (
      <form {...formProps} onSubmit={this.handleSubmit}>
        {children}
      </form>
    );
  }
});

