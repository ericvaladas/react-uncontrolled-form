export default function(minLength) {
  return (value) => {
    if (value.length >= minLength) {
      return true;
    }
    return `Must be at least ${minLength} characters`
  };
}
