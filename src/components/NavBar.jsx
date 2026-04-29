import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router";
import {
  BagIcon,
  BlackCartIcon,
  BlackHeartIcon,
  LogoutIcon,
  UserIcon,
  UserIconNoCircle,
} from "../icons";
import useUserStore from "../stores/user.store.js";
import Avatar from "./Avatar.jsx";

const NavBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  // const [isSeller, setIsSeller] = useState(false);
  const lastScrollY = useRef(0);
  const { user, logout } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Handle potential negative scroll (iOS bounce)
      if (currentScrollY <= 0) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Add a small delta to prevent jitter
      const diff = currentScrollY - lastScrollY.current;
      if (Math.abs(diff) < 10) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hdlDropDownSelect = () => {
    // Optional: Close dropdown by removing focus from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-black font-medium hover:text-red transition-colors duration-300 font-label uppercase tracking-widest text-[12px] ${
      isActive
        ? "text-red border-b-2 border-red font-bold"
        : "text-[#5f5e5e] font-medium"
    }`;

  const isSeller = user?.role === "SELLER";

  return (
    <nav
      className={`sticky top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 mx-auto bg-surface/70 backdrop-blur-md border-b-[0.5px] border-outline-variant/20 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link to="/">
        <div className="font-headline italic text-2xl text-red">
          A Little Bid
        </div>
      </Link>

      <div className="hidden md:flex gap-12">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
        {/* <NavLink to="/ongoing_auctions" className={navLinkClass}>
          Auctions
        </NavLink> */}
        <NavLink to="/products" className={navLinkClass}>
          Products
        </NavLink>
        <NavLink to="/my_active_bids" className={navLinkClass}>
          Active Bid
        </NavLink>
      </div>

      <div className="flex items-center gap-6">
        <NavLink
          to=""
          className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors w-6"
        >
          <BlackHeartIcon />
        </NavLink>
        <NavLink
          to="/my_orders"
          className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors w-6"
        >
          <BlackCartIcon />
        </NavLink>

        {/* ส่วนแสดง User หรือปุ่ม Login */}
        {user ? (
          <div className="dropdown dropdown-end">
            {/* Trigger: กด Avatar เพื่อเปิดเมนู */}
            <div
              tabIndex={0}
              role="button"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 duration-200 cursor-pointer overflow-hidden border border-gray-300 bg-blue-300"
            >
              <Avatar user={user} />
            </div>

            {/* Menu */}
            <ul
              onClick={() => hdlDropDownSelect()}
              tabIndex={0}
              className="dropdown-content menu bg-surface-container-lowest rounded-box z-10 w-50 p-2 shadow-sm border border-outline-variant mt-2"
            >
              <li>
                <NavLink
                  to="/user_profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-high transition-colors rounded-lg"
                >
                  <UserIconNoCircle className="w-5" />
                  <span className="font-label text-[12px] uppercase tracking-widest text-primary">
                    My Profile
                  </span>
                </NavLink>
              </li>
              {isSeller && (
                <li>
                  <NavLink
                    to="/seller_products"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-high transition-colors rounded-lg"
                  >
                    <BagIcon />
                    <span className="font-label text-[12px] uppercase tracking-widest text-primary">
                      My products
                    </span>
                  </NavLink>
                </li>
              )}
              <li>
                <button
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors rounded-lg text-primary"
                  onClick={logout}
                >
                  <LogoutIcon className="w-5" />
                  <span className="font-label text-[12px] uppercase tracking-widest">
                    Log out
                  </span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          /* ถ้ายังไม่ Login ให้แสดงปุ่ม LOGIN */
          <Link
            to="/login"
            className="text-[12px] font-bold uppercase hover:text-red transition-colors"
          >
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
