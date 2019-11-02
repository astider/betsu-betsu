import { useState } from 'react';

export default function useDiscount(rate: number, cap = 0) {
  const [discountRate, setDiscountRate] = useState<DiscountRate>({ rate, cap });
  const calcualteDiscount = (sum: number, isConstant = false) => {
    if (!isConstant && discountRate.rate === 0) return sum;
    const discounted = Math.round((sum * (1 - (discountRate.rate / 100))) * 100) / 100;
    if (discountRate.cap !== 0 && discounted > discountRate.cap) return sum - discountRate.cap;
    return discounted;
  };
  const setDiscount = (type: string, value: string) => {
    const newDiscount = type === 'rate'
      ? { rate: Number(value), cap: discountRate.cap }
      : { rate: discountRate.rate, cap: Number(value) }
    setDiscountRate(newDiscount);
  };
  return {
    setDiscount,
    discount: discountRate,
    getDiscountedPrice: calcualteDiscount,
  }
};
