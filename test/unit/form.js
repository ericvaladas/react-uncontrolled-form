import React from 'react';
import simpleJSDOM from 'simple-jsdom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import Form from '../../src/form';
import {InputField} from '../fields';
import {required} from '../validators';

simpleJSDOM.install();


describe('Form', function() {
  describe('with a single field', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="banana" type="text"/>
        </Form>
      );
    });

    it('should have one field name', () => {
      expect(Object.keys(this.wrapper.instance().fields)).to.have.length(1);
    });

    it('should have a field with the correct name', () => {
      expect(this.wrapper.instance().fields.banana).to.exist;
    });

    it('should have one field reference', () => {
      expect(this.wrapper.instance().fields.banana).to.have.length(1);
    });

    it('should validate', () => {
      this.wrapper.instance().setState({valid: false});
      this.wrapper.instance().validate();
      expect(this.wrapper.instance().state.valid).to.be.true;
    });

    it('should not have any values', () => {
      let values = this.wrapper.instance().values();
      expect(values).to.deep.equal({});
    });

    it('should have a value after receiving a change', () => {
      let event = {
        type: 'change',
        target: {
          value: 'peel'
        }
      };
      this.wrapper.instance().fields.banana[0].handleChange(event);
      let values = this.wrapper.instance().values();
      expect(values).to.deep.equal({banana: 'peel'});
    });
  });

  describe('with two fields', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="banana" type="text"/>
          <InputField name="mango" type="text"/>
        </Form>
      );
    });

    it('should have two field names', () => {
      expect(Object.keys(this.wrapper.instance().fields)).to.have.length(2);
    });

    it('should have fields with the correct names', () => {
      expect(this.wrapper.instance().fields.banana).to.exist;
      expect(this.wrapper.instance().fields.mango).to.exist;
    });

    it('should have one field reference for each name', () => {
      expect(this.wrapper.instance().fields.banana).to.have.length(1);
      expect(this.wrapper.instance().fields.mango).to.have.length(1);
    });
  });

  describe('with two fields with the same name', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <InputField name="banana" type="text"/>
          <InputField name="banana" type="text"/>
        </Form>
      );
    });

    it('should have one field name', () => {
      expect(Object.keys(this.wrapper.instance().fields)).to.have.length(1);
    });

    it('should have one field with the correct name', () => {
      expect(this.wrapper.instance().fields.banana).to.exist;
    });

    it('should have two field references under the same name', () => {
      expect(this.wrapper.instance().fields.banana).to.have.length(2);
    });

    describe('getField', () => {
      it('should return one field', () => {
        let fields = this.wrapper.instance().fields.banana;
        expect(this.wrapper.instance().getField(fields)).to.not.be.instanceof(Array);
      });
    });
  });

  describe('validation', () => {
    describe('with one field', () => {
      beforeEach(() => {
        this.wrapper = mount(
          <Form>
            <InputField name="banana" type="text" validators={[required()]}/>
          </Form>
        );
      });

      it('should fail validation without a value', () => {
        this.wrapper.instance().validate();
        expect(this.wrapper.instance().state.valid).to.be.false;
      });

      it('should validate on submit', () => {
        const event = {
          preventDefault: () => {}
        };
        this.wrapper.instance().handleSubmit(event);
        expect(this.wrapper.instance().state.valid).to.be.false;
      });

      it('should have an invalid field after failing validation', () => {
        this.wrapper.instance().validate();
        expect(Object.keys(this.wrapper.instance().invalidFields)).to.have.length(1);
      });

      it('should have an invalid field with the correct name after failing validation', () => {
        this.wrapper.instance().validate();
        expect(this.wrapper.instance().invalidFields.banana).to.exist;
      });

      it('should pass validation after receiving a value', () => {
        const event = {
          type: 'change',
          target: {
            value: 'split'
          }
        };
        this.wrapper.instance().fields.banana[0].handleChange(event);
        this.wrapper.instance().validate();
        expect(this.wrapper.instance().state.valid).to.be.true;
      });

    });
  });
});
