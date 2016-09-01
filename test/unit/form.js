import React from 'react';
import simpleJSDOM from 'simple-jsdom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import {Field, Form} from '../../src/formwood';

simpleJSDOM.install();


const InputField = Field(React.createClass({
  render() {
    return (
      <input {...this.props.element}/>
    );
  }
}));

describe('Form', function() {
  describe('render with a field named "test"', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="banana"/>
        </Form>
      );
    });

    it('should have one field reference', () => {
      expect(Object.keys(this.wrapper.instance().fields)).to.have.length(1);
    });

    it('should have a key named banana in fields', () => {
      expect(this.wrapper.instance().fields.banana).to.exist;
    });
  });
});
