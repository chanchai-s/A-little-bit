import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io } from 'socket.io-client'
import useUserStore from "./user.store.js";

// const socketInstance = io("http://localhost:3000", {
//   autoConnect: false, // คุมการเชื่อมต่อเอง
//   reconnection: true,
//   reconnectionAttempts: 5,
// });

const useSocketStore = create(persist((set, get) => ({
    socket: null,
    connect:  (token) => {
        if (get().socket?.connected) return;
        console.log('sockettes')
        const newSocket =  io('http://localhost:3000', {
            auth: { token: useUserStore.getState().token },
            reconnection: true
        });
        console.log('newSocket', newSocket)
        newSocket.on('connect', () => {
            console.log('Connected');
            console.log('newSocket', newSocket)
            set({ socket: newSocket });
        });
    },
    disconnect: () => {
        // console.log('sockettesttttttt', get().socket)
        try {
            const socket = get().socket
            // console.log('disconnectingsocket')
            if (socket) {
                socket.off()
                socket.disconnect()
                set({ socket: null })
            }
        } catch (error) {
            console.log('error', error)
            console.log("Logout failed")
        }
    },
    joinAuction: (auctionId) => {
        try {
            const socket = get().socket
            if (socket) {
                socket.emit('join_auction', auctionId);
            }
            // alert("join successful")
        } catch (error) {
            console.log("join auction failed")
        }
    },
    leaveAuction: (auctionId) => {
        try {
            const socket = get().socket
            if (socket) {
                socket.emit('leave_auction', auctionId);
            }
            console.log("leave auction")
        } catch (error) {
            console.log("error",error.message)
        }
    }
}),
    {
        name: 'socket-storage',
        //🔥 เพิ่มส่วนนี้เพื่อกรองเอา socket ออกจากการเซฟลง LocalStorage
        partialize: (state) =>
            Object.fromEntries(
                Object.entries(state).filter(([key]) => !['socket'].includes(key))
            ),
    }
))

export default useSocketStore