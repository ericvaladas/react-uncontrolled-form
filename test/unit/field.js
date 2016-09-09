import React from 'react';
import {findDOMNode} from 'react-dom';
import simpleJSDOM from 'simple-jsdom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import Form from '../../src/form';
import {InputField} from '../fields';
import {required} from '../validators';


simpleJSDOM.install();


describe('Field', function() {
  describe('without validators', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="banana" type="text"/>
        </Form>
      );
      this.field = this.wrapper.instance().getField('banana');
    });

    it('should be valid without a value', () => {
      expect(this.field.validate()).to.be.true;
    });

    it('should be valid with a value', () => {
      const event = {
        type: 'change',
        target: {value: 'peel'}
      };
      return this.field.handleChange(event)
        .then(() => {
          expect(this.field.validate()).to.be.true;
        });
    });
  });

  describe('with a validator', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="banana" type="text" validators={[required()]}/>
        </Form>
      );
      this.field = this.wrapper.instance().getField('banana');
    });

    it('should be invalid without a value', () => {
      expect(this.field.validate()).to.be.false;
    });

    it('should be valid with a value', () => {
      const event = {
        type: 'change',
        target: {value: 'peel'}
      };
      return this.field.handleChange(event)
        .then(() => {
          expect(this.field.validate()).to.be.true;
        });
    });
  });

  describe('with initial values', () => {
    beforeEach(() => {
      const initialValues = {
        'banana': {value: 'peel'},
        'grape': {value: true},
        'fruit': {value: 'pear'}
      };
      this.wrapper = mount(
        <Form values={initialValues}>
          <InputField name="banana" type="text"/>
          <InputField name="grape" type="checkbox"/>
          <InputField name="fruit" type="checkbox" value="pear"/>
        </Form>
      );
      this.textField = this.wrapper.instance().getField('banana');
      this.checkboxField1 = this.wrapper.instance().getField('grape');
      this.checkboxField2 = this.wrapper.instance().getField('fruit');
    });

    it('should have an initial value', () => {
      expect(findDOMNode(this.textField).value).to.equal('peel');
    });

    it('should be checked', () => {
      expect(findDOMNode(this.checkboxField1).checked).to.be.true;
      expect(findDOMNode(this.checkboxField2).checked).to.be.true;
    });
  });

  describe('of type checkbox', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="grape" type="checkbox"/>
        </Form>
      );
      this.field = this.wrapper.instance().getField('grape');
    });

    it('should not be initially checked', () => {
      expect(findDOMNode(this.field).checked).to.be.false;
    });

    it('should not have a value', () => {
      expect(this.field.state.value).to.be.undefined;
    });

    it('should have a value after being checked', () => {
      const event = {
        type: 'change',
        target: {
          checked: true,
          type: 'checkbox',
          value: 'on'
        }
      };
      return this.field.handleChange(event)
        .then(() => {
          expect(this.field.state.value).to.equal('on');
        });
    });

    it('should have a value of null after being unchecked', () => {
      const event = {
        type: 'change',
        target: {
          checked: true,
          type: 'checkbox',
          value: 'on'
        }
      };
      return this.field.handleChange(event)
        .then(() => {
          event.target.checked = false;
          return this.field.handleChange(event)
            .then(() => {
              expect(this.field.state.value).to.be.null;
            });
        });
    });
  });

  describe('of type radio', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="grape" type="radio"/>
        </Form>
      );
      this.field = this.wrapper.instance().getField('grape');
    });
  });
});
