import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useUserStore from "../../stores/user.store";

function EditUserAddress({ defaultAddress }) {
  // console.log("addressesmodal", defaultAddress);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState } = useForm(
    {
      // resolver: zodResolver(editProfileSchema),
      mode: "onSubmit",
      defaultValues: defaultAddress, // initialize with prop
    },
  );

  useEffect(() => {
    if (defaultAddress) {
      reset(defaultAddress);
      // console.log("useEffect", defaultAddress);
    }
  }, [defaultAddress, reset]);

  const user = useUserStore((state) => state.user);
  // console.log('useredit', user)
  const userAddresses = useUserStore((state) => state.userAddress);
  // console.log('useraddressesedit', userAddresses)
  const editUserAddress = useUserStore((state) => state.editUserAddress);
  const onSubmit = async (body) => {
    setIsLoading(true);
    try {
      const resp = await editUserAddress(user.id, defaultAddress.id, body);
      setIsLoading(false);
      Swal.fire({ title: "Address Updated" });
      document.getElementById("openeditaddress-modal").close();
    } catch (error) {
      Swal.fire({
        title: "Error",
      });
    }
  };

  const hdlCloseModal = () => {
    if (defaultAddress) {
      reset(defaultAddress);
    }
    document.getElementById("openeditaddress-modal").close();
  };

  return (
    <div>
      <div className="text-center mb-10 font-headline uppercase text-dark-red tracking-wider text-2xl">
        Edit Address
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Label
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              //   defaultValue={defaultAddress?.label}
              {...register("label")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Street
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              //   defaultValue={defaultAddress?.street}
              {...register("street")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              City
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              //   defaultValue={defaultAddress?.city}
              {...register("city")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              State
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              //   defaultValue={defaultAddress?.state}
              {...register("state")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Postal Code
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              //   defaultValue={defaultAddress?.postalCode}
              {...register("postalCode")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Country
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              //   defaultValue={defaultAddress?.country}
              {...register("country")}
            />
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <button
            type="button"
            className="text-label bg-gray-400 w-20 py-1 rounded-sm text-white font-label"
            onClick={hdlCloseModal}
          >
            Cancle
          </button>
          <button className="text-label bg-primary w-20 py-1 rounded-sm text-white font-label">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUserAddress;
