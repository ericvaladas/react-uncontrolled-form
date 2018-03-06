import React from 'react';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Form from '../../src/form';
import Field from '../../src/field';
import { required, minLength } from '../validators';

Enzyme.configure({ adapter: new Adapter() });

const dom = new JSDOM('<!DOCTYPE html><head></head><body></body></html>');
global.document = dom.window.document;

describe('Field', function() {
  describe('registration', () => {
    beforeEach(() => {
      const wrapper = mount(
        <Form>
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
        </Form>
      );
      this.form = wrapper.instance();
      this.field = this.form.getField('banana');
    });

    it('should call registerField on the form after mounting', () => {
      expect(this.form.fields['banana']).to.have.length(1);
      sinon.spy(this.field.props.form, 'registerField');
      this.field.componentDidMount();
      expect(this.field.props.form.registerField).to.have.been.calledOnce;
    });

    it('should call unregisterField on the form after unmounting', () => {
      expect(this.form.fields['banana']).to.have.length(1);
      sinon.spy(this.field.props.form, 'unregisterField');
      this.field.componentWillUnmount();
      expect(this.field.props.form.unregisterField).to.have.been.calledOnce;
      expect(this.form.fields['banana']).to.have.length(0);
    });
  });

  describe('with a value prop', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <Field>
            {() => <input name="colour" type="checkbox" value="red"/>}
          </Field>
        </Form>
      );
      this.field = this.wrapper.instance().getField('colour');
      this.children = this.field.render();
    });

    it('should not retain the prop', () => {
      expect(this.children[0].props.value).to.not.exist;
    });

    it('should set defaultValue to the value', () => {
      expect(this.children[0].props.defaultValue).to.equal('red');
    });
  });

  describe('without validators', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <Field>
            {() => <input name="banana" type="text"/>}
          </Field>
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
          <Field validators={[required()]}>
            {state =>
              <input
                name="banana"
                type="text"
                placeholder={state.message}
                ref={el => {this.banana = el}}
              />
            }
          </Field>
        </Form>
      );
      this.field = this.wrapper.instance().getField('banana');
    });

    it('should be invalid without a value', () => {
      expect(this.field.validate()).to.be.false;
    });

    it('should have an error message', () => {
      sinon.spy(this.field, 'validate');
      return this.wrapper.instance().validate().then(() => {
        expect(this.field.validate).to.have.been.calledOnce;
        expect(this.field.state.message).to.equal('Required');
      });
    });

    it('should display an error message', () => {
      sinon.spy(this.field, 'validate');
      return this.wrapper.instance().validate().then(() => {
        expect(this.field.validate).to.have.been.calledOnce;
        expect(this.banana.placeholder).to.equal('Required');
      });
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
        banana: 'peel',
        grape: true,
        fruit: 'pear',
        colour: 'green',
        colours: ['cyan', 'yellow']
      };
      this.wrapper = mount(
        <Form values={initialValues}>
          <Field>
            {() => <input name="banana" type="text" ref={el => {this.banana = el}}/>}
          </Field>
          <Field>
            {() => <input name="grape" type="checkbox" ref={el => {this.grape = el}}/>}
          </Field>
          <Field>
            {() => <input name="fruit" type="checkbox" value="pear" ref={el => {this.fruit = el}}/>}
          </Field>
          <Field>
            {() =>
              <select name="colour" ref={el => {this.colour = el}}>
                {['red', 'green', 'blue'].map(colour => {
                  return <option key={colour}>{colour}</option>;
                })}
              </select>
            }
          </Field>
          <Field>
            {() =>
              <select name="colours" ref={el => {this.colours = el}} multiple={true}>
                {['cyan', 'magenta', 'yellow'].map(colour => {
                  return <option key={colour}>{colour}</option>
                })}
              </select>
            }
          </Field>
        </Form>
      );
    });

    it('should have an initial value', () => {
      expect(this.banana.value).to.equal('peel');
      expect(this.colour.value).to.equal('green');
    });

    it('should be checked', () => {
      expect(this.grape.checked).to.be.true;
      expect(this.fruit.checked).to.be.true;
    });

    it('should have an array if multiple is true', () => {
      let values = [];
      Array.from(this.colours.options).forEach(option => {
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
          <Field>
            {() => <input name="grape" type="checkbox" ref={el => {this.grape = el}}/>}
          </Field>
        </Form>
      );
      this.field = this.wrapper.instance().getField('grape');
    });

    it('should not be initially checked', () => {
      expect(this.grape.checked).to.be.false;
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
          <Field>
            {() => <input name="grape" type="radio" value="grape"/>}
          </Field>
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
            <Field>
              {() =>
                <select name="fruit">
                  {['apple', 'banana', 'cranberry'].map(fruit => {
                    return <option key={fruit}>{fruit}</option>;
                  })}
                </select>
              }
            </Field>
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
            <Field>
              {() =>
                <select name="fruits" multiple={true} ref={el => {this.fruits = el}}>
                  {['apple', 'banana', 'cranberry'].map(fruit => {
                    return <option key={fruit}>{fruit}</option>;
                  })}
                </select>
              }
            </Field>
          </Form>
        );
        this.field = this.wrapper.instance().getField('fruits');
        this.options = this.fruits.options;

        // For some reason the first option is selected.
        // Set selected to false for each option.
        Array.from(this.options).forEach(option => option.selected = false);
      });

      it('should not have a value', () => {
        expect(this.field.state.value).to.be.undefined;
      });

      it('should have a value after being changed', () => {
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

  describe('of type file', () => {
    beforeEach(() => {
      this.wrapper = mount(
        <Form>
          <Field>
            {() => <input name="file" type="file"/>}
          </Field>
        </Form>
      );
      this.field = this.wrapper.instance().getField('file');
    });

    it('should not have a value', () => {
      expect(this.field.state.value).to.be.undefined;
    });

    describe('after selecting a file', () => {
      it('should have a value', () => {
        const event = {
          type: 'change',
          target: {
            type: 'file',
            files: {
              0: 'fakefile'
            }
          }
        };
        return this.field.handleChange(event)
          .then(() => {
            expect(this.field.state.value).to.deep.equal({0: 'fakefile'});
          });
      });
    });
  });

  describe('nested inside a component', () => {
    beforeEach(() => {
      this.wrapper = undefined;
    });

    describe('with the form prop', () => {
      it('should not throw an error', () => {
        class SomeComponent extends React.Component {
          render() {
            return (
              <Field form={this.props.form}>
                {() => <input name="pasta"/>}
              </Field>
            );
          }
        }

        this.wrapper = mount(
          <Form>
            <SomeComponent/>
          </Form>
        );

        expect(this.wrapper).to.exist;
      });
    });

    describe('without the form prop', () => {
      it('should throw an error', () => {
        class SomeComponent extends React.Component {
          render() {
            return (
              <Field>
                {() => <input name="pasta"/>}
              </Field>
            );
          }
        }

        try {
          this.wrapper = mount(
            <Form>
              <SomeComponent/>
            </Form>
          );
        }
        catch(error) {
          expect(error).to.exist;
        }

        expect(this.wrapper).to.not.exist;
      });
    });
  });

  describe('handling a custom event', () => {
    it('should set the value to event', () => {
      this.wrapper = mount(
        <Form>
          <Field>
            {() => <input name="guava"/>}
          </Field>
        </Form>
      );

      const field = this.wrapper.instance().getField('guava');
      field.handleChange('juice');
      expect(field.state.value).to.equal('juice');
    });
  });

  describe('with a transform prop', () => {
    it('should transform the field\'s value', () => {
      this.wrapper = mount(
        <Form>
          <Field transform={value => value.toUpperCase()}>
            {() => <input name="fruit"/>}
          </Field>
        </Form>
      );

      const field = this.wrapper.instance().getField('fruit');
      field.handleChange({
        target: {value: 'peach'}
      });
      expect(field.state.value).to.equal('PEACH');

    });
  });

  describe('handling an additional onChange', () => {
    it('should call onChange after handling the event', () => {
      this.onChange = sinon.spy();
      this.wrapper = mount(
        <Form>
          <Field>
            {() => <input name="guava" onChange={e => this.onChange(e)}/>}
          </Field>
        </Form>
      );

      const field = this.wrapper.instance().getField('guava');
      field.handleChange({
        type: 'change',
        target: {value: 'peel'}
      });
      expect(field.state.value).to.equal('peel');
      expect(this.onChange).to.have.been.calledWith({
        type: 'change',
        target: {value: 'peel'}
      });
    });
  });

  describe('using a component as an input', () => {
    it('should retain the `value` prop', () => {
      class SomeComponent extends React.Component {
        render() {
          return <div>{this.props.value}</div>;
        }
      }

      this.wrapper = mount(
        <Form>
          <Field>
            {() => <SomeComponent name="pasta" value="penne"/>}
          </Field>
        </Form>
      );

      this.field = this.wrapper.instance().getField('pasta');
      this.children = this.field.render();

      expect(this.children[0].props.value).to.equal('penne');
    });
  });
});
