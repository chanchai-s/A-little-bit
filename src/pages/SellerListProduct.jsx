import React from "react";
import {NavLink, useNavigate } from "react-router";
import ProductSellerCard from "../components/sellerListPage/productCard.jsx";
import useProductStore from "../stores/product.store.js";
import useUserStore from "../stores/user.store.js";

const SellerUserListProduct = () => {
  const { allProducts} = useProductStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const hdlAddProduct = () => {
    navigate(`/add_product`);
  };
    const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-sm transition-all ${
                  isActive
                    ? "bg-white font-bold shadow-sm"
                    : "text-[#59413e] hover:bg-[#efeeeb]"
                }`;

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-['Manrope']">
      <main className="max-w-[1440px] mx-auto flex min-h-screen">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col gap-4 p-6 bg-[#f5f3f0] w-64 border-r border-[#efeeeb] sticky top-[73px] h-[calc(100vh-73px)]">
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-[#9e1b1b] font-bold">
              Inventory
            </h2>
            <p className="text-xs text-[#59413e]/60 mt-1">
              Curating your collection
            </p>
          </div>
          <nav className="flex flex-col gap-2">
            {[
              { label: "All" },
              { label: "Active Lots" },
              { label: "Sold" },
              // { label: 'Collectibles', icon: 'auto_awesome' }
            ].map((nav) => (
              <a
                key={nav.label}
                href="#"
                className={`${navLinkClass}`}
              >
                <span
                  className={`material-symbols-outlined`}
                >
                  {nav.icon}
                </span>
                <span className="text-xs uppercase tracking-widest">
                  {nav.label}
                </span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Canvas */}
        <section className="flex-1 px-8 py-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <h1 className="text-5xl font-['Newsreader'] tracking-tight">
                Curated Inventory
              </h1>
              <p className="text-[#59413e] mt-4 max-w-md">
                Manage your listed items, adjust valuations, and monitor active
                bidding status across your private gallery.
              </p>
            </div>
            <button onClick={hdlAddProduct} className="bg-gradient-to-br from-[#7a0009] to-[#9e1b1b] text-white flex items-center gap-3 px-8 py-4 rounded-sm shadow-xl shadow-[#7a0009]/10 active:scale-[0.98] transition-all uppercase tracking-widest text-xs font-bold">
              <span className="material-symbols-outlined">add</span>
              Add New Product
            </button>
          </div>

          {/* Bento Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-[#f5f3f0] p-4 flex items-center justify-between rounded-sm cursor-pointer">
              <span className="text-xs font-bold uppercase tracking-widest text-[#59413e]">
                Sort By
              </span>
              <span className="material-symbols-outlined text-lg text-[#59413e]">
                filter_list
              </span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <ProductSellerCard />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#efeeeb] w-full py-12 px-8 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-[1440px] mx-auto">
          <div>
            <span className="text-lg font-['Newsreader']">
              The Digital Curator
            </span>
            <p className="text-xs uppercase tracking-tighter text-[#59413e] mt-2">
              © 2024 The Digital Curator. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              "Privacy Policy",
              "Terms of Sale",
              "Appraisal Services",
              "Contact Us",
            ].map((link) => (
              <a
                key={link}
                className="text-xs uppercase tracking-tighter text-[#59413e] hover:text-[#9e1b1b] transition-colors"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerUserListProduct;
