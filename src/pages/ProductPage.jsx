import React, { useEffect, useState } from "react";
import useProductStore from "../stores/product.store.js";
import TimeCountdown from "../components/TimeCountdown.jsx";
import { ProductListByPages } from "../components/productPage/PageProducts.jsx";
import DisplayProducts from "../components/productPage/DisplayProducts.jsx";
import useAuctionStore from "../stores/auction.store.js"

const ProductPage = () => {
  // const {
  //   productPage,
  //   setProductPage,
  //   allProducts,
  //   allCategories,
  //   getAllProducts,
  //   getCategories,
  // } = useProductStore();

  const productPage = useProductStore((state)=>state.productPage)
  const setProductPage = useProductStore((state)=>state.setProductPage)
  const allProducts = useProductStore((state)=>state.allProducts)
  const allCategories = useProductStore((state)=>state.allCategories)
  const getAllProducts = useProductStore((state)=>state.getAllProducts)
  const getCategories = useProductStore((state)=>state.getCategories)
  const clearAuctionById = useAuctionStore((state)=>state.clearAuctionById)
  const clearProductById = useProductStore((state)=>state.clearProductById)
  // filter only active product
  // const {}
  const [selectCategoryId, setSelectCategoryId] = useState("");
  const [selectCategoryName, setSelectCategoryName] = useState("All");
  // const [productByCategory, setProductByCategory] = useState("");
  const [currentProducts, setCurrentProducts] = useState(allProducts);
  useEffect(() => {
    getAllProducts();
    getCategories();
    clearAuctionById()
    clearProductById()
  }, []);
  
  useEffect(() => {
    if (Array.isArray(allProducts)) {
      setCurrentProducts(allProducts);
    }
  }, [allProducts]);

  const hdlCategorySelect = (id, name) => {
    setSelectCategoryId(id);
    setProductPage(1);
    setSelectCategoryName(name);

    // Use the ID from the argument, NOT the state
    // This fixes the "one step slow" bug!
    let filtered;
    if (name === "All" || !id) {
      filtered = allProducts;
    } else {
      filtered = allProducts.filter((p) => p.categoryId === id);
    }
    setCurrentProducts(filtered);
    // Optional: Close dropdown by removing focus from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  const limit = 20;
  // 1. Calculate the slice indexes
  const startIndex = (productPage - 1) * limit;
  const endIndex = startIndex + limit;
  // 2. Slice the data for display
  console.log("currentProducts", currentProducts);
  // const filteredActiveProduct = currentProducts.filter((item)=>item.)
  const displayProducts = currentProducts.slice(startIndex, endIndex);
  console.log('displayProducts', displayProducts)

  // console.log("currentProducts", currentProducts);
  // console.log("allProducts", allProducts);

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-['Manrope'] min-h-screen">
      <main className="pt-12 pb-24 px-12 max-w-screen-2xl mx-auto">
        <section className="mb-20 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#800000] mb-4 block">
            Curated Selections
          </span>
          <div className="max-w-3xl mx-auto relative group">
            <input
              type="text"
              placeholder="Search by category or product details"
              className="w-full h-16 pl-16 pr-8 bg-[#f6f3f2] border-none rounded-full focus:ring-2 focus:ring-[#570000]/20 text-lg shadow-sm outline-none"
            />
          </div>
        </section>

        <div className="flex justify-between items-end mb-12 text-left">
          <div>
            <h2 className="text-4xl font-['Noto_Serif'] text-red">
              All Products
            </h2>
          </div>
          <div className="dropdown dropdown-center">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-dark-red text-white tracking-widest "
            >
              Categories
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-white text-dark-red rounded-box z-1 w-40 p-2 shadow-sm"
            >
              <li onClick={() => hdlCategorySelect(null, "All")}>
                <a className={selectCategoryId === null ? "active" : ""}>
                  All Products
                </a>
              </li>
              {allCategories.map((item) => (
                <li
                  key={item.id}
                  onClick={() => hdlCategorySelect(item.id, item.name)}
                >
                  <a className={selectCategoryId === item.id ? "active" : ""}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-l font-semibold uppercase tracking-widest text-stone-600 mb-1 block">
          Category : {selectCategoryName}
        </div>
        <div className="mt-2  text-primary ">
          <span className="text-gray-700 font-bold text-xl">
            {currentProducts.length}
          </span>
          <span className="text-gray-600 ml-2">Products in total</span>
          <p className="text-black mt-1">
            showing {startIndex + 1} - {endIndex}
          </p>
        </div>

        {/* Ongoing Auction Grid */}
        <section className="mt-10">
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <DisplayProducts
              displayProducts={displayProducts}
              allCategories={allCategories}
            />
          </div>
        </section>
      </main>
      <ProductListByPages allProducts={currentProducts} limit={limit} />
    </div>
  );
};

export default ProductPage;
