import React from 'react';


export default React.createClass({
  fields: [],
  invalidFields: [],

  validate() {
    this.invalidFields = [];
    for (let field of this.fields) {
      if (!field.validate()) {
        this.invalidFields.push(field);
      }
    }
    return this.invalidFields.length === 0;
  },

  handleSubmit(e) {
    e.preventDefault();
    this.validate()
    if (this.props.onSubmit) {
      this.props.onSubmit(e);
    }
  },

  getData() {
    let data = {};
    for (let field of this.fields) {
      data[field.props.name] = field.state.value;
    }
    return data;
  },

  getChildren() {
    let fields = []
    let children = React.Children.map(this.props.children, (child) => {
      if (child && child.type && child.type.displayName === "Field") {
        child = React.cloneElement(child, {
          ref: (field) => { fields.push(field); }
        });
      }
      return child;
    });
    this.fields = fields;
    return children;
  },

  render() {
    return (
      <form {...this.props} onSubmit={this.handleSubmit}>
        {this.getChildren()}
      </form>
    );
  }
});

