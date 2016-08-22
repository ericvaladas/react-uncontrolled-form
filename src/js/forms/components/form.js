import React from 'react';


export default React.createClass({
  children: [],
  fields: [],

  getInitialState() {
    return {
      numberInvalid: 0
    };
  },

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
    let numberInvalid = 0;
    this.setState({numberInvalid: 0});
    for (let field of this.fields) {
      if (!field.validate()) {
        numberInvalid += 1;
      }
    }
    this.setState({numberInvalid: numberInvalid});
    return numberInvalid === 0;
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
        {this.state.numberInvalid} Invalid
        {this.children}
      </form>
    );
  }
});

