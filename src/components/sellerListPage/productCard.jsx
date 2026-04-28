import React, { useState } from "react";
import useProductStore from "../../stores/product.store.js";
import useUserStore from "../../stores/user.store.js";
import ProductImageSlide from "../productPage/ProductImageSlide.jsx";

function ProductSellerCard() {
  const { allProducts, allCategories } = useProductStore();
  const { user } = useUserStore();
  const [userProduct, setUserProduct] = useState("");
  const filterUserProduct = allProducts.filter(
    (item) => item.sellerId === user.id,
  );
  console.log('user', user)
  console.log('allProducts', allProducts)
  console.log('filterUserProduct', filterUserProduct)

  return (
    <>
      {filterUserProduct.map((item) => {
        const category = allCategories.find((cat) => cat.id === item.categoryId);
        return (
          <div
            key={item.id}
            className="group flex flex-col bg-white rounded-sm transition-all duration-500 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/5] bg-[#e4e2df] overflow-hidden rounded-sm">
              {item.images && item.images.length > 0 && (
                // <ProductImageSlide images={item.images} />
                 <img
                src={item.images[0].imageUrl}
                className="w-full h-full object-cover"
              />
              )}

              {item.status && (
                <div
                  className={`absolute top-4 left-4 ${item.statusColor || "bg-[#7a0009]"} text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest`}
                >
                  {item.status}
                </div>
              )}
            </div>
            <div className="pt-6 pb-4 px-1">
              <div>
                <h3 className="text-lg font-['Newsreader'] italic mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#59413e] uppercase tracking-tighter mb-4">
                  {category.name}
                </p>
              </div>

              <div className="flex justify-between items-end border-t border-[#e1bebb]/15 pt-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-[#59413e]">
                    {item.priceLabel}
                  </span>
                  <span className="text-xl font-['Newsreader'] text-[#7a0009]">
                    {item.price}
                  </span>
                </div>
              </div>
              <button className="text-xs font-bold uppercase tracking-widest hover:text-[#7a0009] transition-colors flex items-center gap-1">
                Edit
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ProductSellerCard;
