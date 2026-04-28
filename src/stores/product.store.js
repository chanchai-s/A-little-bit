import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  apiGetCategories,
  apiGetAllProducts,
  apiGetProductsById,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiCreateImages,
} from "../api/apiMain.js";

const useProductStore = create()(
  persist(
    (set, get) => ({
      allProducts: [],
      allCategories: [],
      productById: [],
      productPage: 1,
      // productIdForAuction: null,
      setProductPage: (page) => set({ productPage: page }),

      getAllProducts: async () => {
        const resp = await apiGetAllProducts();
        console.log("getAllProducts", resp.data.responses);
        set({ allProducts: resp.data.responses });
      },
      getCategories: async () => {
        const resp = await apiGetCategories();
        // console.log("getCategories", resp.data.responses);
        set({ allCategories: resp.data.responses });
      },
      getProductsById: async (id) => {
        console.log('id-productbyid', id)
        const resp = await apiGetProductsById(id);
        console.log("getProductsById", resp.data.responses);
        set({ productById: resp.data.responses });
      },
      createProduct: async (body) => {
        const resp = await apiCreateProduct(body);
        set((state) => ({
          allProducts: [...state.allProducts, resp.data.responses], // Keep it an array
          // productIdForAuction: resp.data.responses.id,
        }));
        // console.log("allProductsAfterCreate", resp.data.responses.id);
        return resp.data.responses;
      },
      updateProduct: async (productId, body) => {
        const resp = await apiUpdateProduct(productId, body);
        set({ productById: resp.data.responses });
        return resp.data.responses;
      },
      // apiDeleteProduct
      createImages: async (imagesUrl) => {
        const resp = await apiCreateImages(imagesUrl)
        console.log('resp-createimages', resp.data.responses)
        return resp.data.responses
      },
      clearProductById: () => {
        set({productById:[]})
      }
    }),
    {
      name: "product-page-storage",
    },
  ),
);

export default useProductStore;
