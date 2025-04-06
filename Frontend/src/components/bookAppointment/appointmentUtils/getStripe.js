import { loadStripe } from "@stripe/stripe-js";
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      "pk_test_51Mv8i0KIIZgjDvpwQVYPZQfRS86MJlkT51L4WqPVBgghi90BYk3sm9Py77U92keOdhb37L1JX4aaHvRVSHFfOZfV00JpyJDugk"
    );
  }
  return stripePromise;
};
export default getStripe;
