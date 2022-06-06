export const addGivenData = (inputs, data) => {
  return inputs.map((input) => {
    return Object.assign(input, data);
  });
};
