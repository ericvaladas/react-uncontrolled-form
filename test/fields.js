import React from 'react';
import Field from '../src/field';


const InputField = Field(React.createClass({
  render() {
    return (
      <input {...this.props.element}/>
    );
  }
}));

export {InputField};
