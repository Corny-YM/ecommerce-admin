export const getProductSold = async (storeId: string, type?: string) => {
  const res = await fetch(`/api/${storeId}/orders/products?type=${type}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  return res.json();
};
