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
        let field = this.fields[fieldName];
        if (!field.validate()) {
          this.invalidFields[fieldName] = field;
        }
      }
      let valid = Object.keys(this.invalidFields).length === 0;
      this.setState({valid: valid}, resolve);
    });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.validate()
      .then(() => {
        if (this.props.onSubmit) {
          this.props.onSubmit(e, this.values());
        }
      });
  },

  values() {
    let values = {};
    for (let fieldName in this.fields) {
      let field = this.fields[fieldName];
      values[fieldName] = field.state.value
    }
    return values;
  },

  addPropsToChildren(children, props) {
    console.log("addPropsToChildren");
    return React.Children.map(children, (child) => {
      let childProps = {};
      if (child.props) {
        childProps.children = this.addPropsToChildren(child.props.children, props);
        if (child.type.displayName === "Field") {
          props.value = this.props.values[child.props.name];
          childProps = Object.assign(childProps, props);
        }
        return React.cloneElement(child, childProps);
      }
      return child;
    });
  },

  children() {
    let fields = {}
    const ref = {ref: (field) => { if (field) { fields[field.props.name] = field;} }}
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

