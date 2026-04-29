import { NavLink, useNavigate } from "react-router";
import { LogoutIcon } from "../icons";
import EditUserProfile from "../components/userPage/EditUserProfile";
import EditUserAddress from "../components/userPage/EditUserAddress";
import useUserStore from "../stores/user.store.js";
import { useEffect, useMemo } from "react";
import Avatar from "../components/Avatar"
import Swal from "sweetalert2";

const UserProfilePage = () => {
  const { logout, getUserById } = useUserStore();
  const user = useUserStore((state) => state.user);
  console.log("userprofile", user);

  const userAddresses = useUserStore((state) => state.userAddresses);
  const navigate = useNavigate();
  const {
    id,
    username,
    email,
    firstname,
    lastname,
    name,
    avatarUrl,
    phone,
    role,
  } = user;
  useEffect(() => {
    if (id) {
      getUserById(id);
    }
  }, [id, getUserById]);

  const defaultAddress = useMemo(() => {
    return userAddresses?.find((item) => item.isDefault === true);
  }, [userAddresses]);

  if (!user) return <div>Loading...</div>;

  const showName = firstname || name?.split(" ")[0] || "n/a";
  const showLastname = lastname || name?.split(" ")[1] || "n/a";
  const showUsername = username || name?.split(" ")[1] || "n/a";

  // console.log('defaultAddress', defaultAddress)

  const isSeller = user?.role === "SELLER";

  const hdlOpenEditProfileModal = () => {
    try {
      document.getElementById("openeditprofile-modal").showModal();
    } catch (error) {
      Swal.fire({
        title: "Cannot Open Modal",
      });
    }
  };

  const hdlOpenEditAddressModal = () => {
    try {
      document.getElementById("openeditaddress-modal").showModal();
    } catch (error) {
      Swal.fire({
        title: "Cannot Open Modal",
      });
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-primary-container selection:text-white">
      <main className="pt-12 pb-20 max-w-screen-2xl mx-auto px-8 flex gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-2">
            <nav className="flex flex-col gap-1">
              <NavLink className="flex items-center gap-3 px-4 py-3 text-[#7a0009] font-semibold border-l-2 border-[#7a0009] bg-surface-container-low transition-all duration-300">
                <span className="text-sm tracking-wide uppercase font-medium">
                  Profile
                </span>
              </NavLink>
              <NavLink
                to="/my_active_bids"
                className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-surface-container-low transition-all duration-300"
              >
                <span className="text-sm tracking-wide uppercase font-medium">
                  Bidding Activity
                </span>
              </NavLink>
              <NavLink
                to="/favorite"
                className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-surface-container-low transition-all duration-300"
                href="#"
              >
                <span className="text-sm tracking-wide uppercase font-medium">
                  Watchlist
                </span>
              </NavLink>
              {isSeller && (
                <NavLink
                  to="/seller_list_product"
                  className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-surface-container-low transition-all duration-300"
                  href="#"
                >
                  <span className="text-sm tracking-wide uppercase font-medium">
                    Consignments
                  </span>
                </NavLink>
              )}

              <div className="pt-8 mt-8 border-t border-outline-variant/30 flex">
                <button
                  onClick={logout}
                  type="button"
                  className="text-label uppercase items-center gap-3 px-4 py-3 text-stone-400 hover:text-dark-red transition-all duration-300 flex"
                >
                  <LogoutIcon className="w-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <section className="flex-grow space-y-16">
          {/* Hero Profile Section */}
          <div className="flex items-start justify-between border-b border-outline-variant/20 pb-12">
            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 overflow-hidden bg-surface-variant shadow-sm">
                  <Avatar user={user} />
                </div>
                <button className="bg-gray-300  text-grey/60 shadow-lg hover:bg-white transition-transform w-full">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-serif italic text-red font-headline">
                      {showName} {showLastname}
                    </h1>

                    {/* Status Buyer */}

                    <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm">
                      {role}
                    </span>
                  </div>

                  <p className="text-stone-500 font-light tracking-wide italic">
                    Member since November 2019 • London, UK
                  </p>
                </div>
                <div className="flex gap-12">
                  <div className="text-center">
                    <span className="block text-3xl font-serif text-primary font-headline">
                      12
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Active Bids
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-3xl font-serif text-primary font-headline">
                      47
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Won Items
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Personal Details Card */}
            <div className="bg-surface-container-lowest p-8 rounded-sm space-y-8">
              <div className="flex justify-between items-baseline">
                <h2 className="text-xl font-serif italic font-headline text-on-surface text-dark-red">
                  Personal Details
                </h2>
                <button
                  type="button"
                  className="text-xs uppercase tracking-widest text-primary font-bold hover:underline decoration-1 underline-offset-4"
                  onClick={hdlOpenEditProfileModal}
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    First Name
                  </label>
                  <p
                    className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
                    defaultValue=""
                  >
                    {showName}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Last Name
                  </label>
                  <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                    {showLastname}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Username
                  </label>
                  <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                    {showUsername}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Email Address
                  </label>
                  <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                    {email}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Phone Number
                  </label>
                  <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                    {phone}
                  </p>
                </div>
              </div>

              {/* Address form */}
              <div className="">
                <div className="flex justify-between items-baseline w-full my-10">
                  <h2 className="text-xl font-serif italic font-headline text-on-surface text-dark-red">
                    Address
                  </h2>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-widest text-primary font-bold hover:underline decoration-1 underline-offset-4"
                    onClick={hdlOpenEditAddressModal}
                  >
                    Edit Address
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Label
                    </label>
                    <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                      {defaultAddress?.label}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Street
                    </label>
                    <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                      {defaultAddress?.street}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      City
                    </label>
                    <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                      {defaultAddress?.city}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      State
                    </label>
                    <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                      {defaultAddress?.state}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Postal Code
                    </label>
                    <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                      {defaultAddress?.postalCode}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Country
                    </label>
                    <p className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body">
                      {defaultAddress?.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              {/* Auction Preferences */}
              <div className="bg-surface-container-low p-8 rounded-sm space-y-6">
                <h2 className="text-xl font-serif italic font-headline text-on-surface">
                  Auction Preferences
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-sm font-medium">
                        Outbid Notifications
                      </span>
                      <span className="block text-xs text-on-surface-variant">
                        Instant alerts when you are no longer the highest bidder
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Preferred Currency
                    </label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 py-3 px-4 text-sm pr-10 focus:ring-0 focus:border-primary">
                        <option>GBP (£) - British Pound Sterling</option>
                        <option>USD ($) - US Dollar</option>
                        <option>EUR (€) - Euro</option>
                        <option>CHF (Fr) - Swiss Franc</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <dialog
          className="modal"
          id="openeditprofile-modal"
          onClose={() => navigate("/user_profile")}
        >
          <div className="modal-box">
            <EditUserProfile />
          </div>
        </dialog>

        {/* <dialog
          className="modal"
          id="openeditaddress-modal"
          onClose={() => navigate("/user_profile")}
        >
          {addresses?.map((e, i) => (
            <div className="modal-box">
              <EditUserAddress key={i} data={e} />
            </div>
          ))}
        </dialog> */}

        <dialog
          className="modal"
          id="openeditaddress-modal"
          onClose={() => navigate("/user_profile")}
        >
          <div className="modal-box">
            <EditUserAddress defaultAddress={defaultAddress} />
          </div>
        </dialog>
      </main>
      {/* Footer */}
    </div>
  );
};

export default UserProfilePage;
