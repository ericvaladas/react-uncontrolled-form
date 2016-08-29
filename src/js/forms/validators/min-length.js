export default function(minLength) {
  return (value) => {
    if (value && value.length >= minLength) {
      return true;
    }
    return `Must be at least ${minLength} characters`
  };
}
