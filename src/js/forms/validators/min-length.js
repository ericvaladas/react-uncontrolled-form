function MinLengthValidator(minLength) {
  this.minLength = minLength;
}

Object.assign(MinLengthValidator.prototype, {
  validate(value) {
    return value.length >= this.minLength;
  },

  errorMessage() {
    return `Must be at least ${this.minLength} characters`
  }
});

export default function(minLength) {
  return new MinLengthValidator(minLength);
};
