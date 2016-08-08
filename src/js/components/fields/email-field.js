import React from 'react';
import classNames from 'classnames';
import FieldMixin from '../mixins/field-mixin';
import EmailValidator from '../../validators/email';


export default React.createClass({
  mixins: [FieldMixin],
  validators: [EmailValidator()],

  handleChange(event) {
    this.setState({value: event.target.value});
  },

  render() {
    let className = classNames({
      'form-row': true,
      'invalid': !this.state.valid
    });

    return (
      <div className={className}>
        <label>{this.props.label}</label>
        <input type="email" name={this.props.name} onChange={this.handleChange} required={this.props.required}/>
        <span className="message">{this.state.message}</span>
      </div>
    );
  }
});
