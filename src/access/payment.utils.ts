export const symulatePayment = (): Promise<boolean> => {
  return new Promise(resolve => setTimeout(resolve, 5000))
    .then(() => {
      return true;
    })
    .catch(err => {
      return false;
    });
};
