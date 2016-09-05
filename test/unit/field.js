import React from 'react';
import simpleJSDOM from 'simple-jsdom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import Form from '../../src/form';
import {InputField} from '../fields';
import {required} from '../validators';

simpleJSDOM.install();


describe('Field', function() {
  describe('type="text"', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="banana" type="text"/>
        </Form>
      );
      this.field = this.wrapper.instance().fields.banana[0];
    });

    describe('render', () => {
      it('should have the correct type', () => {
        expect(this.field.props.type).to.equal('text');
      });
    });
  });
});
