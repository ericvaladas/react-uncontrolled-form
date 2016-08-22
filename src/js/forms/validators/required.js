function RequiredValidator() {}

Object.assign(RequiredValidator.prototype, {
  validate(value) {
    return !!value === true;
  },

  errorMessage() {
    return "Required";
  }
});

export default function() {
  return new RequiredValidator();
};
