import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import TextField from '../../../src/js/components/fields/text-field';
import MinLengthValidator from '../../../src/js/validators/min-length';

describe('TextField', () => {
  describe('validate', () => {
    it('should return false if the condition is not met', () => {
      const wrapper = shallow(<TextField validators={[MinLengthValidator(1)]}/>);
      wrapper.instance().componentDidMount();
      expect(wrapper.instance().validate()).to.be.false;
    });

    it('should return true if the condition is met', () => {
      const changeEvent = {
        target: {
          value: 'a'
        }
      };
      const wrapper = shallow(<TextField validators={[MinLengthValidator(1)]}/>);
      wrapper.instance().componentDidMount();
      wrapper.instance().handleChange(changeEvent);
      expect(wrapper.instance().validate()).to.be.true;
    });
  });

  describe('rendering', () => {
    it('should render with the correct className with no validators', () => {
      const wrapper = shallow(<TextField/>);
      expect(wrapper.hasClass('form-row')).to.be.true;
    });

    it('should render with the correct className when valid', () => {
      const changeEvent = {
        target: {
          value: 'a'
        }
      };
      const wrapper = shallow(<TextField validators={[MinLengthValidator(1)]}/>);
      wrapper.instance().componentDidMount();
      wrapper.instance().handleChange(changeEvent);
      expect(wrapper.hasClass('form-row')).to.be.true;
    });

    it('should render with the correct className when invalid', () => {
      const wrapper = shallow(<TextField validators={[MinLengthValidator(1)]}/>);
      wrapper.instance().componentDidMount();
      wrapper.instance().validate();
      wrapper.update();
      expect(wrapper.hasClass('form-row invalid')).to.be.true;
    });
  });
});
