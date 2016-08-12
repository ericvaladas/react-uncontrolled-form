import React from 'react';
import MinLengthValidator from '../forms/validators/min-length';
import EmailValidator from '../forms/validators/email';
import {Field, ErrorMessage} from '../forms/components/field';
import Form from '../forms/components/form'


export default React.createClass({

  render() {
    return (
      <Form action="/" method="get">
        <Field validators={[MinLengthValidator(3)]}>
          <label>Name</label>
          <input type="text" name="name" id="name"/>
          <ErrorMessage/>
        </Field>

        <Field validators={[EmailValidator()]}>
          <label>Email</label>
          <input type="text" name="email" id="email"/>
          <ErrorMessage/>
        </Field>

        <button type="submit">Submit</button>
      </Form>
    );
  }
});
