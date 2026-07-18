export const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `Rs ${price}`;
  }
  if (typeof price === 'string' && price.startsWith('Rs')) {
    return price;
  }
  return `Rs ${price}`;
};
export default formatPrice;
