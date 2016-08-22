import React from 'react';


export default React.createClass({
  children: [],
  fields: [],

  componentWillMount() {
    this.children = React.Children.map(this.props.children, (child) => {
      if (child.type.displayName === "field") {
        child = React.cloneElement(child, {
          ref: (field) => { this.fields.push(field); }
        });
      }
      return child;
    });
  },

  validate() {
    let valid = true;
    for (let field of this.fields) {
      if (!field.validate()) {
        valid = false;
      }
    }
    return valid;
  },

  handleSubmit(e) {
    e.preventDefault();
    if (!this.validate()) {
      console.log('form is invalid');
    }
  },

  render() {
    return (
      <form {...this.props} onSubmit={this.handleSubmit}>
        {this.children}
      </form>
    );
  }
});

