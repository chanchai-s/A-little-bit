import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useUserStore from "../../stores/user.store.js";

function EditUserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const editUserProfile = useUserStore((state) => state.editUserProfile);
  const getUserById = useUserStore((state) => state.getUserById);
  const { register, handleSubmit, reset, watch, setValue, formState } = useForm(
    {
      // resolver: zodResolver(editProfileSchema),
      mode: "onSubmit",
    },
  );

  useEffect(() => {
    getUserById(user.id);
  }, []);

  const onSubmit = async (data) => {
    console.log("dataaa", data);
    setIsLoading(true);
    try {
      console.log('data from edit front-end', data)
      const resp = await editUserProfile(user.id, data);
      console.log('resp in modal', resp)
      Swal.fire({
        title: "Profile Updated",
      });
      
    } catch (error) {
      console.log('error', error)
      Swal.fire({
        title: "Profile Update failed",
      });
    }finally{

      document.getElementById("openeditprofile-modal").close();
    }
  };

  const hdlCloseModal = () => {
    reset({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });
    document.getElementById("openeditprofile-modal").close();
  };
  return (
    <div>
      <div className="text-center mb-10 font-headline uppercase text-dark-red tracking-wider text-2xl">
        Edit Profile
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              First Name
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              defaultValue={user.firstname}
              {...register("firstname")}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Last Name
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              defaultValue={user.lastname}
              {...register("lastname")}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Username
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="text"
              defaultValue={user.username}
              {...register("username")}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Email Address
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="email"
              defaultValue={user.email}
              {...register("email")}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Phone Number
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-outline/30 py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors font-body"
              type="tel"
              defaultValue={user.phone}
              {...register("phone")}
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

export default EditUserProfile;
