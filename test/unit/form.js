import React from 'react';
import {findDOMNode} from 'react-dom';
import simpleJSDOM from 'simple-jsdom';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {mount} from 'enzyme';
import Form from '../../src/form';
import {InputField, SelectField} from '../fields';
import {required} from '../validators';


chai.use(sinonChai);
simpleJSDOM.install();

describe('Form', function() {
  describe('with a single field', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <h1>Test</h1>
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
      return this.wrapper.instance().validate()
        .then(() => {
          expect(this.wrapper.instance().state.valid).to.be.true;
        });
    });

    it('should not have any values', () => {
      let values = this.wrapper.instance().values();
      expect(values).to.deep.equal({});
    });

    it('should have a value after receiving a change', () => {
      const event = {
        type: 'change',
        target: {value: 'peel'}
      };
      return this.wrapper.instance().fields.banana[0].handleChange(event)
        .then(() => {
          let values = this.wrapper.instance().values();
          expect(values).to.deep.equal({banana: 'peel'});
        });
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
      beforeEach(() => {
        this.clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        this.clock.restore();
      });

      it('should return one field', () => {
        expect(this.wrapper.instance().getField('banana')).to.be.a.String;
      });

      it('should return the most recently changed field', () => {
        const event = {
          type: 'change',
          target: {value: 'peel'}
        };

        let fields = this.wrapper.instance().fields.banana;
        this.wrapper.instance().fields.banana[0].handleChange(event);
        this.clock.tick(100);
        return this.wrapper.instance().fields.banana[1].handleChange(event)
          .then(() => {
            let field = this.wrapper.instance().fields.banana[1];
            expect(this.wrapper.instance().getField('banana')).to.equal(field);
          });
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
        return this.wrapper.instance().validate()
          .then(() => {
            expect(this.wrapper.instance().state.valid).to.be.false;
          });
      });

      it('should validate on submit', () => {
        const event = {
          preventDefault: sinon.spy()
        };
        sinon.spy(this.wrapper.instance(), 'validate');
        this.wrapper.instance().handleSubmit(event);
        expect(this.wrapper.instance().validate).to.have.been.calledOnce;
      });

      it('should have an invalid field after failing validation', () => {
        return this.wrapper.instance().validate()
          .then(() => {
            expect(Object.keys(this.wrapper.instance().invalidFields)).to.have.length(1);
          });
      });

      it('should have an invalid field with the correct name after failing validation', () => {
        return this.wrapper.instance().validate()
          .then(() => {
            expect(this.wrapper.instance().invalidFields.banana).to.exist;
          });
      });

      it('should pass validation after receiving a value', () => {
        const event = {
          type: 'change',
          target: {
            value: 'split'
          }
        };
        return this.wrapper.instance().getField('banana').handleChange(event)
          .then(() => {
            return this.wrapper.instance().validate()
              .then(() => {
                expect(this.wrapper.instance().state.valid).to.be.true;
              });
          });
      });
    });

    describe('with one checkbox field', () => {
      beforeEach(() => {
        this.event = {
          type: 'change',
          target: {
            checked: true,
            type: 'checkbox',
            value: 'on'
          }
        };
        this.wrapper = mount(
          <Form>
            <InputField name="pear" type="checkbox"/>
          </Form>
        );
      });

      it('should have a value that is a string', () => {
        return this.wrapper.instance().getField('pear').handleChange(this.event)
          .then(() => {
            let value = this.wrapper.instance().values().pear;
            expect(value).to.be.a.String;
          });
      });

      it('should have a single value', () => {
        return this.wrapper.instance().getField('pear').handleChange(this.event)
          .then(() => {
            let value = this.wrapper.instance().values().pear;
            expect(value).to.equal('on');
          });
      });

      it('should have no value if unchecked', () => {
        return this.wrapper.instance().getField('pear').handleChange(this.event)
          .then(() => {
            this.event.target.checked = false;
            return this.wrapper.instance().getField('pear').handleChange(this.event)
              .then(() => {
                let values = this.wrapper.instance().values();
                expect(values).to.deep.equal({});
              });
          });
      });
    });

    describe('with two checkbox fields with the same name', () => {
      beforeEach(() => {
        this.event1 = {
          type: 'change',
          target: {
            checked: true,
            type: 'checkbox',
            value: 'jam'
          }
        };
        this.event2 = {
          type: 'change',
          target: {
            checked: true,
            type: 'checkbox',
            value: 'juice'
          }
        };
        this.wrapper = mount(
          <Form>
            <InputField name="pear" type="checkbox" value="jam"/>
            <InputField name="pear" type="checkbox" value="juice"/>
          </Form>
        );
        this.clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        this.clock.restore();
      });

      it('should have a value that is an array', () => {
        return this.wrapper.instance().fields.pear[0].handleChange(this.event1)
          .then(() => {
            return this.wrapper.instance().fields.pear[1].handleChange(this.event2)
              .then(() => {
                let value = this.wrapper.instance().values().pear;
                expect(value).to.be.an.Array;
              });
          });
      });

      it('should have a two values', () => {
        return this.wrapper.instance().fields.pear[0].handleChange(this.event1)
          .then(() => {
            this.clock.tick(100);
            return this.wrapper.instance().fields.pear[1].handleChange(this.event2)
              .then(() => {
                let value = this.wrapper.instance().values().pear;
                expect(value).to.deep.equal(['juice', 'jam']);
              });
          });
      });

      it('should have a one value if one is unchecked', () => {
        return this.wrapper.instance().fields.pear[0].handleChange(this.event1)
          .then(() => {
            return this.wrapper.instance().fields.pear[1].handleChange(this.event2)
              .then(() => {
                this.event2.target.checked = false;
                return this.wrapper.instance().fields.pear[1].handleChange(this.event2)
                  .then(() => {
                    let value = this.wrapper.instance().values().pear;
                    expect(value).to.equal('jam');
                  });
              });
          });
      });
    });
  });

  describe('with an onSubmit handler', () => {
    beforeEach(() => {
      this.handleSubmit = sinon.spy();
      this.wrapper = mount(
        <Form onSubmit={this.handleSubmit}>
          <InputField name="banana" type="text"/>
        </Form>
      );
    });

    it('should validate on submit', () => {
      const event = {
        preventDefault: sinon.spy()
      };
      sinon.spy(this.wrapper.instance(), 'validate');
      this.wrapper.instance().handleSubmit(event);
      expect(this.wrapper.instance().validate).to.have.been.calledOnce;
    });

    it('should call the handler', () => {
      const event = {
        preventDefault: sinon.spy()
      };
      return this.wrapper.instance().handleSubmit(event)
        .then(() => {
          expect(this.handleSubmit).to.have.been.calledOnce;
        });
    });

    it('should receive an argument with the form data', () => {
      const event = {
        preventDefault: sinon.spy()
      };
      return this.wrapper.instance().handleSubmit(event)
        .then(() => {
          expect(this.handleSubmit).to.have.been.calledWith(
            event, {
              valid: true,
              values: {},
              invalidFields: {}
            });
        });
    });
  });

  describe('with initial field values', () => {
    beforeEach(() => {
      const initialValues = {
        banana: 'peel',
        pear: 'juice',
        fruits: ['mango', 'papaya'],
        colour: 'blue',
        colours: ['cyan', 'yellow']
      };
      this.wrapper = mount(
        <Form values={initialValues}>
          <InputField name="banana" type="text"/>
          <fieldset>
            <InputField name="pear" type="radio" value="jam"/>
            <InputField name="pear" type="radio" value="juice"/>
          </fieldset>
          <fieldset>
            <InputField name="fruits" type="checkbox" value="mango"/>
            <InputField name="fruits" type="checkbox" value="papaya"/>
          </fieldset>
          <SelectField name="colour" options={['red', 'green', 'blue']}/>
          <SelectField name="colours" options={['cyan', 'magenta', 'yellow']} multiple={true}/>
        </Form>
      );
    });

    it('should have the correct values', () => {
      expect(this.wrapper.instance().values()).to.deep.equal({
        banana: 'peel',
        pear: 'juice',
        fruits: ['mango', 'papaya'],
        colour: 'blue',
        colours: ['cyan', 'yellow']
      });
    });
  });

  describe('with initial field messages', () => {
    beforeEach(() => {
      const FormWithMessage = React.createClass({
        getInitialState() {
          return {
            messages: {banana: 'peel'}
          };
        },

        render() {
          return (
            <Form messages={this.state.messages} ref={form => { this.form = form; }}>
              <InputField name="banana" type="text"/>
            </Form>
          );
        }
      });
      this.wrapper = mount(<FormWithMessage/>);
      this.field = this.wrapper.instance().form.getField('banana');
    });

    it('should set the message on the field', () => {
      expect(findDOMNode(this.field).placeholder).to.equal('peel');
    });

    it('should set the message on the field after changing state', (done) => {
      expect(findDOMNode(this.field).placeholder).to.equal('peel');
      this.wrapper.instance().setState({
        messages: {banana: 'pie'}
      }, () => {
        expect(findDOMNode(this.field).placeholder).to.equal('pie');
        done();
      });
    });
  });
});
