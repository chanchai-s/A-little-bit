import { io } from 'socket.io-client'
import useUserStore from '../stores/user.store.js'
import useBidStore from '../stores/bid.store.js'

let socket = null

export const connectSocket = () => {
  if (socket?.connected) return

  socket = io('http://localhost:3000', {
       auth: { token: useUserStore.getState().token },
     reconnection: true
  })

  socket.on('connect', () => {
    useBidStore.getState().setConnected(true);
    console.log('socket', 'socket is connected')
  })

    socket.on('newest_bid', (bid) => {
      console.log('newest bid socket socket', socket)
    useBidStore.getState().addBid(bid);
    console.log('bid from backend received', bid)
  })

  socket.on('auction_ended', (winner) => {
    console.log('winnerrrrrrrrrr', winner)
    useBidStore.getState().setWinner(winner)
    // modal tell user that winner
  })

  socket.on('disconnect', () => {
    useBidStore.getState().setConnected(false);
  })
}

export const joinAuctionRoom = (auctionId) => {
  if (!socket) return
  socket.emit('join_auction', auctionId)
}

export const leaveAuctionRoom = (auctionId) => {
  if (!socket) return
  socket.emit('leave_auction', { auctionId })

  // socket.off('newest_bid')
  // socket.off('auction_ended')

  useBidStore.getState().reset()
}

export const placeBid = (amount, auctionId) => {
    console.log('ting socket', socket)
  socket?.emit('send_bid', { amount: amount, auctionId: auctionId });
}

export const disconnectSocket = () => {
  socket?.disconnect()
  socket = null
}