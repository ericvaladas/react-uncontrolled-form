import React from 'react';


export default React.createClass({
  fields: {},
  invalidFields: {},

  getInitialState() {
    return {valid: true};
  },

  getDefaultProps() {
    return {values: {}};
  },

  validate() {
    return new Promise((resolve) => {
      this.invalidFields = {};
      for (let fieldName in this.fields) {
        let field = this.getField(this.fields[fieldName]);
        if (field && !field.validate()) {
          this.invalidFields[fieldName] = field;
        }
      }
      this.setState({
        valid: Object.keys(this.invalidFields).length === 0
      }, resolve);
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.validate()
      .then(() => {
        if (this.props.onSubmit) {
          this.props.onSubmit(e, {
            valid: this.state.valid,
            values: this.values()
          });
        }
      });
  },

  getField(fields) {
    return fields.sort((a, b) => {
      return b.state.timestamp - a.state.timestamp;
    })[0];
  },

  values() {
    let values = {};
    for (let fieldName in this.fields) {
      let field = this.getField(this.fields[fieldName]);
      if (field && field.state.value) {
        values[fieldName] = field.state.value;
      }
    }
    return values;
  },

  addPropsToChildren(children, props) {
    return React.Children.map(children, (child) => {
      let childProps = {};
      if (child.props) {
        childProps.children = this.addPropsToChildren(child.props.children, props);
        if (child.type.displayName === 'Field') {
          const values = this.props.values[child.props.name] || {};
          childProps = Object.assign(childProps, values, props);
        }
        return React.cloneElement(child, childProps);
      }
      return child;
    });
  },

  children() {
    let fields = {};
    const ref = {
      ref: (field) => {
        if (field) {
          if (!fields[field.props.name]) {
            fields[field.props.name] = [];
          }
          fields[field.props.name].push(field);
        }
      }
    };
    const children = this.addPropsToChildren(this.props.children, ref);
    this.fields = fields;
    return children;
  },

  render() {
    return (
      <form {...this.props} onSubmit={this.handleSubmit}>
        {this.children()}
      </form>
    );
  }
});

