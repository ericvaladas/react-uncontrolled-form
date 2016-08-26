export default function(compare) {
  return (value) => {
    let compareValue = compare;
    if (compare.constructor === Function) {
      compareValue = compare();
    }
    if (compareValue === value) {
      return true;
    }
    return "Value does not match";
  };
};
