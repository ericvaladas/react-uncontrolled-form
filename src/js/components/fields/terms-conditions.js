import React from 'react';
import RequiredValidator from '../../forms/validators/email';

export default React.createClass({

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="input input--textarea input--textarea-legal">
            <div className="input__label-container">
              <label htmlFor="terms-copy" className="label">Legal Terms &amp; Conditions</label>
            </div>
            <textarea id="terms-copy" name="terms-copy" rows="12" readOnly="readOnly" data-audit-required="true" data-audit-error-message="Please read and agree to the terms and conditions" defaultValue="Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit. Sed ut imperdiet nisi. Proin condimentum fermentum nunc. Etiam pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Suspendisse in orci enim."/>
            <div className="input__meta">
              <div className="checkbox">
                <input type="checkbox" id="terms--agree" name="terms" value="true" data-audit-required="true" data-audit-error-message="Please read and agree to the terms and conditions" data-audit-multiple="terms" onChange={this.props.handleChange}/>
                <label className="label" htmlFor="terms--agree">I have read, understood and agree to be bound by terms and conditions therein</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
