import React, { Suspense } from "react";
import MainLayout from "../layouts/mainLayout.jsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import UserProfilePage from "../pages/UserProfilePage.jsx";
import HomePage from "../pages/HomePage.jsx";
import AuctionPage from "../pages/AuctionPage.jsx";
import SellerUserListProduct from "../pages/SellerListProduct.jsx";
// import ProductPageForSeller from "../pages/ProductPageForSeller.jsx";
import AuctionBid from "../pages/AuctionBid.jsx";
import ProductPage from "../pages/ProductPage.jsx";
import AddProduct from "../pages/AddProduct.jsx";
import OrderList from "../pages/OrderList.jsx";
import Payment from "../pages/Payment.jsx";
import Complete from "../pages/Complete.jsx";
import Favorite from "../pages/Favorite.jsx";
import ActiveBid from "../pages/ActiveBid.jsx";
import LoginPage from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import RequestOTP from "../pages/RequestOTP.jsx";
import VerifyOTP from "../pages/VerifyOTP.jsx";
import ResetPassword from "../pages/Resetpassword.jsx";
import useUserStore from "../stores/user.store.js";

const guestRouter = createBrowserRouter([
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <Register /> },
  { path: "request-otp", element: <RequestOTP /> },
  { path: "verify-otp", element: <VerifyOTP /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "*", element: <HomePage /> },
]);

const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "user_profile", element: <UserProfilePage /> },
      // { path: "ongoing_auctions", element: <AuctionPage /> },
      { path: "seller_products", element: <SellerUserListProduct /> },
      { path: "auction_bid/:auctionId", element: <AuctionBid /> },
      { path: "products", element: <ProductPage /> },
      { path: "my_active_bids", element: <ActiveBid /> },
      { path: "add_product", element: <AddProduct /> },
      { path: "my_orders", element: <OrderList /> },
      // { path: "favorite", element: <Favorite /> },
      { path: "payment/:auctionId/:bidId", element: <Payment /> },
      { path: "complete", element: <Complete /> },
    ],
  },
  // prevent white screens on invalid URLs
  { path: "login", element: <Navigate to="/" replace /> },
  { path: "register", element: <Navigate to="/" replace /> },
  { path: "request-otp", element: <Navigate to="/" replace /> },
  { path: "verify-otp", element: <Navigate to="/" replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

function AppRouter() {
  const user = useUserStore((state) => state.user);
  // console.log('user', user)
  // const userRouter = user 
  return (
    <Suspense>
      {<RouterProvider router={userRouter}></RouterProvider>}
    </Suspense>
  );
}

export default AppRouter;
