import React from 'react';
import { findDOMNode } from 'react-dom';
import { JSDOM } from 'jsdom';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Form from '../../src/form';
import Field from '../../src/field';
import { required } from '../validators';

Enzyme.configure({adapter: new Adapter()});

const dom = new JSDOM('<!DOCTYPE html><head></head><body></body></html>');
global.document = dom.window.document;

chai.use(sinonChai);

describe('Form', function() {
  describe('registration', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form></Form>
      );
      this.form = this.wrapper.instance();
    });

    it('should have no fields', () => {
      expect(Object.keys(this.form.fields)).to.have.length(0);
    })

    describe('after registering one field', () => {
      beforeEach(() => {
        this.field = {
          name: 'banana'
        };
        this.form.registerField(this.field);
      });

      it('should have one field', () => {
        expect(this.form.fields['banana']).to.have.length(1);
      });

      it('should have no fields after unregistering one field', () => {
        this.form.unregisterField(this.field);
        expect(this.form.fields['banana']).to.have.length(0);
      });
    });
  });

  describe('with a single field', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <h1>Test</h1>
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
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
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
          <Field>
            {() => <input name="mango" type="text"/>}
          </Field>
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
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
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
        let field = this.wrapper.instance().fields.banana[0];
        expect(this.wrapper.instance().getField('banana')).to.equal(field);
      });

      it('should return the most recently changed field', () => {
        const event = {
          type: 'change',
          target: {value: 'peel'},
          timeStamp: 1
        };

        let fields = this.wrapper.instance().fields.banana;
        this.wrapper.instance().fields.banana[0].handleChange(event);
        this.clock.tick(100);
        event.timeStamp = 2;
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
            <Field validators={[required()]}>
              {() => <input name="banana" type="text"/>}
            </Field>
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
            <Field>
              {() => <input name="pear" type="checkbox"/>}
            </Field>
          </Form>
        );
      });

      it('should have a value that is a string', () => {
        return this.wrapper.instance().getField('pear').handleChange(this.event)
          .then(() => {
            let value = this.wrapper.instance().values().pear;
            expect(value).to.be.a('string');
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
          timeStamp: 1,
          target: {
            checked: true,
            type: 'checkbox',
            value: 'jam'
          }
        };
        this.event2 = {
          type: 'change',
          timeStamp: 2,
          target: {
            checked: true,
            type: 'checkbox',
            value: 'juice'
          }
        };
        this.wrapper = mount(
          <Form>
            <Field>
              {() => <input name="pear" type="checkbox" value="jam"/>}
            </Field>
            <Field>
              {() => <input name="pear" type="checkbox" value="juice"/>}
            </Field>
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
                expect(value).to.be.an('array');
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
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
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
          expect(this.handleSubmit).to.have.been.calledWith({
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
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
          <fieldset>
            <Field>
              {() => <input name="pear" type="radio" value="jam"/>}
            </Field>
            <Field>
              {() => <input name="pear" type="radio" value="juice"/>}
            </Field>
          </fieldset>
          <fieldset>
            <Field>
              {() => <input name="fruits" type="checkbox" value="mango"/>}
            </Field>
            <Field>
              {() => <input name="fruits" type="checkbox" value="papaya"/>}
            </Field>
          </fieldset>
          <Field>
            {() =>
              <select name="colour">
                {['red', 'green', 'blue'].map(colour => {
                  return <option key={colour}>{colour}</option>;
                })}
              </select>
            }
          </Field>
          <Field>
            {() =>
              <select name="colours" multiple={true}>
                {['cyan', 'magenta', 'yellow'].map(colour => {
                  return <option key={colour}>{colour}</option>;
                })}
              </select>
            }
          </Field>
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
      class FormWithMessage extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            messages: {banana: 'peel'}
          };
        }

        render() {
          return (
            <Form messages={this.state.messages}>
              <Field>
                {state =>
                  <input name="banana" type="text" placeholder={state.message} ref={input => {this.input = input}} />
                }
              </Field>
            </Form>
          );
        }
      }
      this.wrapper = mount(<FormWithMessage/>);
    });

    it('should set the message on the field', () => {
      expect(this.wrapper.instance().input.placeholder).to.equal('peel');
    });

    it('should set the message on the field after changing state', (done) => {
      expect(this.wrapper.instance().input.placeholder).to.equal('peel');
      this.wrapper.instance().setState({
        messages: {banana: 'pie'}
      }, () => {
        expect(this.wrapper.instance().input.placeholder).to.equal('pie');
        done();
      });
    });
  });
});
