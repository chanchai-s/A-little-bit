import useUserStore from "../stores/user.store.js";
import axios from "axios";

export const mainApi = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

mainApi.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api Path connecting with backend using by zustand at stores
// Auth
export const apiOTP = (body) => mainApi.post("/auth/verift-otp",body)
// USERS
export const apiLogin = (body) => mainApi.post("/auth/login", body);
export const apiRegister = (body) => mainApi.post("/auth/register", body);
export const apiGetAllUser = () => mainApi.get("/users");
export const apiGetUserById = (userid) => mainApi.get(`/users/${userid}`);
export const apiDeleteUserById = (userid) => mainApi.delete(`/users/${userid}`);
export const apiEditUserAddressById = (userId, addressId, data) =>
  mainApi.patch(`/users/${userId}/addresses/${addressId}`, data);

export const apiEditUserProfileById = (userId, data) =>
  mainApi.patch(`/users/${userId}`, data);

// PRODUCTS
export const apiGetCategories = () => mainApi.get(`/products/categories`);
export const apiGetAllProducts = () => mainApi.get(`/products`);
export const apiGetProductsById = (productId) =>
  mainApi.get(`/products/${productId}`);
export const apiCreateProduct = (body) => mainApi.post(`/products`, body);
export const apiUpdateProduct = (productId, body) =>
  mainApi.patch(`/products/${productId}`, body);
export const apiDeleteProduct = (productId) =>
  mainApi.delete(`/products/${productId}`);
export const apiCreateImages = (imagesUrl) => mainApi.post(`/products/images`, imagesUrl)

// AUCTION
export const apiGetAllAuction = () => mainApi.get(`/auctions`);
export const apiCreateAuction = (body) => mainApi.post(`/auctions`, body);
export const apiGetAuctionById = (auctionId) =>
  mainApi.get(`/auctions/${auctionId}`);
export const apiGetAcutionByProductId = (productId) =>
  mainApi.get(`/auctions/product/${productId}`);
export const apiUpdateAuction = (auctionId) =>
  mainApi.patch(`/auctions/${auctionId}`);
export const apiDeleteAuction = (auctionId) =>
  mainApi.delete(`/auctions/${auctionId}`);
export const apiGetPopularAuction =()=> mainApi.get(`/auctions/popular`)

//BID
export const apiGetAllBid = () => mainApi.get(`/bids`);
export const apiGetBidById = (bidId) => mainApi.get(`/bids/${bidId}`);
