import { useState } from "react";
import useProductStore from "../../stores/product.store.js";

export const ProductListByPages = ({ allProducts,limit}) => {
  const productPage = useProductStore((state) => state.productPage);
  const setProductPage = useProductStore((state) => state.setProductPage);
  const totalPages = Math.ceil(allProducts.length / limit);
  

  return (
    <div>
      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4 justify-center">
        <button
          disabled={productPage === 1}
          onClick={() => setProductPage(Number(productPage) - 1)}
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="py-2">
          Page {productPage} of {totalPages}
        </span>

        <button
          disabled={productPage === totalPages}
          onClick={() => setProductPage(Number(productPage) + 1)}
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          Next
          {/* {console.log("productPage",productPage)} */}
        </button>
      </div>
    </div>
  );
};
