import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  apiLogin,
  apiRegister,
  apiGetAllUser,
  apiGetUserById,
  apiDeleteUserById,
  apiEditUserAddressById,
  apiEditUserProfileById,
} from "../api/apiMain.js";
import { connectSocket, disconnectSocket } from "../socket/socketService.js";

const useUserStore = create()(
  persist(
    (set) => ({
      user: null,
      users: [],
      token: "",
      userAddresses: [],

      // Action to log in by Jammy
      login: async (body) => {
        console.log("login");
        const resp = await apiLogin(body);
        set({ token: resp.data.token, user: resp.data.user });
        // connect to socket
        connectSocket();
        return resp.data.user;
      },
      register: async (body) => {
        await apiRegister(body);
      },
      getAllUser: async () => {
        // console.log("getalluser")
        const resp = await apiGetAllUser();
        const responses = Array.isArray(resp.data.responses)
          ? resp.data.responses
          : [];
        // console.log('resp_getAllUser', resp)
        set({ users: responses });
        return responses;
      },
      getUserById: async (id) => {
        const resp = await apiGetUserById(id);
        const response = resp.data.responses ?? null;
        set({
          user: response,
          userAddresses: response?.addresses ?? [],
        });
        return response;
      },
      // Action to log out
      logout: () => {
        disconnectSocket();
        set({ user: null, token: "" });
      },
      deleteUser: async (userId) => {
        try {
          await apiDeleteUserById(userId);
        } catch (err) {
          console.error("Failed to delete user account", err);
          throw err;
        }
      },
      editUserProfile: async (userId, data) => {
        try {
          console.log('userId at store', userId)
          console.log('data at store', data)
          const resp = await apiEditUserProfileById(userId, data);
          console.log('resp', resp)
          set({ user: resp?.data.responses });
          return resp?.data.responses;
        } catch (error) {
          console.error("error", error);
          throw error;
        }
      },

      editUserAddress: async (userId, addressId, data) => {
        try {
          const resp = await apiEditUserAddressById(userId, addressId, data);
          set((state) => ({
            userAddresses: state.userAddresses.map((e) =>
              e.id === addressId ? resp.data.responses : e,
            ),
          }));
          return resp.data.responses;
        } catch (error) {
          console.error("error", error);
          throw error;
        }
      },
    }),
    {
      name: "userProfile-storage",
    },
  ),
);

export default useUserStore;
