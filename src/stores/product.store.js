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
      productById: null,
      productPage: 1,
      // productIdForAuction: null,
      setProductPage: (page) => set({ productPage: page }),

      getAllProducts: async () => {
        const resp = await apiGetAllProducts();
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        console.log("getAllProducts", resp.data.responses);
        set({ allProducts: responses });
      },
      getCategories: async () => {
        const resp = await apiGetCategories();
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        // console.log("getCategories", resp.data.responses);
        set({ allCategories: responses });
      },
      getProductsById: async (id) => {
        console.log('id-productbyid', id)
        const resp = await apiGetProductsById(id);
        const response = resp.data.responses ?? null;
        console.log("getProductsById", resp.data.responses);
        set({ productById: response });
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
        const response = resp.data.responses ?? null;
        set({ productById: response });
        return response;
      },
      // apiDeleteProduct
      createImages: async (imagesUrl) => {
        const resp = await apiCreateImages(imagesUrl)
        console.log('resp-createimages', resp.data.responses)
        return resp.data.responses
      },
      clearProductById: () => {
        set({productById:null})
      }
    }),
    {
      name: "product-page-storage",
    },
  ),
);

export default useProductStore;
