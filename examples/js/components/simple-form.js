import React from 'react';
import Field from '../../../src/js/forms/components/field';
import Form from '../../../src/js/forms/components/form'


const InputField = Field(React.createClass({
  render() {
    return (
      <div className="form-group">
        <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
        <input className="form-control" type={this.props.type} name={this.props.name} id={this.props.id} onChange={this.props.handleChange}/>
      </div>
    );
  }
}));

export default React.createClass({
  handleSubmit(e, values) {
    alert(JSON.stringify(values));
  },

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h2>Simple Form</h2>
        <InputField type="text" name="username" id="username" label="Username"/>
        <InputField type="password" name="password" id="password" label="Password"/>
        <button className="btn btn-primary" type="submit">Submit</button>
      </Form>
    );
  }
});
