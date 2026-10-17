import React, { useEffect } from 'react';
import { Link } from 'react-router';
import usePaymentStore from '../stores/payment.store';

const OrderList = () => {
  const { myPayments, myPaymentsLoading, myPaymentsError, getMyPayments } = usePaymentStore();

  useEffect(() => {
    getMyPayments();
  }, [getMyPayments]);

  if (myPaymentsLoading) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center">
        <p className="text-[#59413e] font-bold uppercase tracking-widest text-xs animate-pulse">Loading acquisitions...</p>
      </div>
    );
  }

  if (myPaymentsError) {
    return (
      <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[#7a0009] font-bold">Error loading orders</p>
          <p className="text-sm text-[#59413e]">{myPaymentsError}</p>
          <button 
            onClick={() => getMyPayments()}
            className="text-xs font-bold uppercase tracking-widest underline decoration-[#e1bebb]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-['Manrope'] selection:bg-[#9e1b1b] selection:text-white">
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-8 py-16">
        {/* Page Header */}
        <header className="mb-16">
          <h1 className="text-5xl font-['Newsreader'] font-light mb-4">My Orders</h1>
          <p className="text-[#59413e] text-lg tracking-wide max-w-2xl">
            Manage and track your successful acquisitions from our global gallery network.
          </p>
        </header>

        {/* Order List */}
        <section className="flex flex-col gap-8">
          {myPayments.length === 0 ? (
            <div className="bg-white p-20 text-center border border-dashed border-[#e4e2df] rounded-sm">
              <p className="text-[#59413e] font-['Newsreader'] italic text-xl mb-6">No acquisitions yet</p>
              <Link 
                to="/auctions" 
                className="inline-block bg-[#7a0009] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#9e1b1b] transition-colors"
              >
                Browse Active Auctions
              </Link>
            </div>
          ) : (
            myPayments.map((auction) => {
              const winningBid = auction.bids[0]; 
              const latestPayment = auction.payments[0];
              const isPaid = auction.status === 'SOLD';
              const status = isPaid ? 'PAID' : (latestPayment?.status || 'WAITING FOR PAYMENT');
              
              return (
                <article key={auction.id} className="bg-white p-6 rounded-sm shadow-sm transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 aspect-square bg-[#e4e2df] rounded-sm overflow-hidden">
                      <img 
                        src={auction.product.images[0]?.imageUrl || '/placeholder.png'} 
                        alt={auction.product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[#59413e] text-xs font-bold uppercase tracking-widest mb-1 block">Lot #{auction.id}</span>
                          <h2 className="text-2xl font-['Newsreader'] italic">{auction.product.name}</h2>
                        </div>
                        <span className={`px-3 py-1 ${!isPaid ? 'bg-[#efeeeb] text-[#5f5e5e]' : 'bg-[#7a0009]/10 text-[#7a0009]'} text-[10px] font-bold tracking-[0.15em] uppercase rounded-sm`}>
                          {status}
                        </span>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 border-t border-[#e1bebb]/15 pt-6">
                        <div>
                          <p className="text-[10px] font-bold text-[#59413e] uppercase tracking-widest mb-1">Hammer Price</p>
                          <p className="text-xl font-['Newsreader'] text-[#4b3519]">
                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(winningBid?.amount || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#59413e] uppercase tracking-widest mb-1">Transaction Ref</p>
                          <p className="text-[10px] font-bold opacity-60 break-all">{latestPayment?.gatewayReference || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#59413e] uppercase tracking-widest mb-1">
                            {isPaid ? 'Paid On' : 'Won On'}
                          </p>
                          <p className={`text-sm font-bold`}>
                            {new Date(isPaid ? latestPayment.paidAt : auction.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex flex-wrap items-center gap-6 pt-4">
                        {!isPaid ? (
                          <Link 
                            to={`/payment/${auction.id}/${winningBid?.id}`}
                            className="bg-gradient-to-br from-[#7a0009] to-[#9e1b1b] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-[0.98]"
                          >
                            Complete Payment
                          </Link>
                        ) : (
                          <button className="bg-[#59413e] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-default">
                            Paid
                          </button>
                        )}
                        <a className="text-[#7a0009] text-xs font-bold uppercase tracking-widest hover:underline decoration-[#e1bebb]/50 transition-all" href="#">
                          View Auction Details
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}

          {myPayments.length > 0 && (
            <div className="flex justify-center mt-12">
              <button className="flex items-center gap-2 px-8 py-4 bg-[#efeeeb] hover:bg-[#eae8e5] text-[#59413e] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors rounded-sm">
                Load Historical Archives
                <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrderList;