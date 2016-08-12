function EmailValidator() {}

Object.assign(EmailValidator.prototype, {
  validate(value) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },

  errorMessage() {
    return "Invalid email address";
  }
});

export default function() {
  return new EmailValidator();
};
