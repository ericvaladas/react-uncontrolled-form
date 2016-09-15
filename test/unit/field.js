import React from 'react';
import {findDOMNode} from 'react-dom';
import simpleJSDOM from 'simple-jsdom';
import {expect} from 'chai';
import {mount} from 'enzyme';
import Form from '../../src/form';
import {InputField, SelectField, RequiredInputField} from '../fields';
import {required, minLength} from '../validators';


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

  describe('with a validator defined in the wrapped component', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <RequiredInputField name="banana" type="text"/>
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

    describe('and on the component tag', () => {
      beforeEach(() => {
        this.wrapper = mount(
          <Form>
            <RequiredInputField name="banana" type="text" validators={[minLength(5)]}/>
          </Form>
        );
        this.field = this.wrapper.instance().getField('banana');
      });

      it('should have two validators', () => {
        expect(this.field.validators).to.have.length(2);
      });

      it('should be invalid without a value', () => {
        expect(this.field.validate()).to.be.false;
      });

      it('should be invalid with a value under 5 characters', () => {
        const event = {
          type: 'change',
          target: {value: 'peel'}
        };
        return this.field.handleChange(event)
          .then(() => {
            expect(this.field.validate()).to.be.false;
          });
      });

      it('should be valid with a value with 5 characters', () => {
        const event = {
          type: 'change',
          target: {value: 'puree'}
        };
        return this.field.handleChange(event)
          .then(() => {
            expect(this.field.validate()).to.be.true;
          });
      });
    });
  });

  describe('with initial values', () => {
    beforeEach(() => {
      const initialValues = {
        banana: {value: 'peel'},
        grape: {value: true},
        fruit: {value: 'pear'},
        colour: {value: 'green'},
        colours: {value: ['cyan', 'yellow']},
      };
      this.wrapper = mount(
        <Form values={initialValues}>
          <InputField name="banana" type="text"/>
          <InputField name="grape" type="checkbox"/>
          <InputField name="fruit" type="checkbox" value="pear"/>
          <SelectField name="colour" options={['red', 'green', 'blue']}/>
          <SelectField name="colours" options={['cyan', 'magenta', 'yellow']} multiple={true}/>
        </Form>
      );
      this.textField = this.wrapper.instance().getField('banana');
      this.checkboxField1 = this.wrapper.instance().getField('grape');
      this.checkboxField2 = this.wrapper.instance().getField('fruit');
      this.selectField1 = this.wrapper.instance().getField('colour');
      this.selectField2 = this.wrapper.instance().getField('colours');
    });

    it('should have an initial value', () => {
      expect(findDOMNode(this.textField).value).to.equal('peel');
      expect(findDOMNode(this.selectField1).value).to.equal('green');
    });

    it('should be checked', () => {
      expect(findDOMNode(this.checkboxField1).checked).to.be.true;
      expect(findDOMNode(this.checkboxField2).checked).to.be.true;
    });

    it('should have an array if multiple is true', () => {
      let values = [];
      Array.from(findDOMNode(this.selectField2).children).forEach((option) => {
        if (option.selected) {
          values.push(option.value);
        }
      });
      expect(values[0]).to.equal('cyan');
      expect(values[1]).to.equal('yellow');
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
          <InputField name="grape" type="radio" value="grape"/>
        </Form>
      );
      this.field = this.wrapper.instance().getField('grape');
    });

    it('should not have a value', () => {
      expect(this.field.state.value).to.be.undefined;
    });

    it('should have a value after being checked', () => {
      const event = {
        type: 'change',
        target: {
          checked: true,
          type: 'radio',
          value: 'grape'
        }
      };
      return this.field.handleChange(event)
        .then(() => {
          expect(this.field.state.value).to.equal('grape');
        });
    });
  });

  describe('of type select', () => {
    describe('with multiple set to false', () => {
      beforeEach(() => {
        this.wrapper = mount(
          <Form>
            <SelectField name="fruit" options={['apple', 'banana', 'cranberry']}/>
          </Form>
        );
        this.field = this.wrapper.instance().getField('fruit');
      });

      it('should not have a value', () => {
        expect(this.field.state.value).to.be.undefined;
      });

      it('should have a value after being changed', () => {
        const event = {
          type: 'change',
          target: {
            value: 'banana'
          }
        };
        return this.field.handleChange(event)
          .then(() => {
            expect(this.field.state.value).to.equal('banana');
          });
      });
    });

    describe('with multiple set to true', () => {
      beforeEach(() => {
        this.wrapper = mount(
          <Form>
            <SelectField name="fruits" options={['apple', 'banana', 'cranberry']} multiple={true}/>
          </Form>
        );
        this.field = this.wrapper.instance().getField('fruits');
      });

      it('should not have a value', () => {
        expect(this.field.state.value).to.be.undefined;
      });

      it('should have a value after being changed', () => {
        this.options = findDOMNode(this.field).options;
        this.options[1].selected = true;
        const event = {
          type: 'change',
          target: {
            type: 'select-multiple',
            value: 'banana',
            options: this.options
          }
        };
        return this.field.handleChange(event)
        .then(() => {
          expect(this.field.state.value).to.deep.equal(['banana']);
          this.options[2].selected = true;
          event.target.value = 'cranberry';
          return this.field.handleChange(event)
          .then(() => {
            expect(this.field.state.value).to.deep.equal(['banana', 'cranberry']);
          });
        });
      });
    });
  });
});
