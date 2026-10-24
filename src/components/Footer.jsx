import React from 'react'

function Footer() {
    return (
        <div>
            <footer className="bg-stone-100 w-full p-16 grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-stone-200">
                <div className="md:col-span-1">
                    <span className="font-headline italic text-xl text-red">A Little Bid</span>
                    <p className="mt-6 text-stone-500 text-sm leading-relaxed">
                        The global digital salon for fine art and rare collection, connecting discerning collectors with timeless masterpieces.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <h5 className="text-red font-label uppercase tracking-widest text-[10px] font-bold mb-2">Corporate</h5>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">About Us</a>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">Press</a>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">Contact</a>
                </div>
                <div className="flex flex-col gap-3">
                    <h5 className="text-red font-label uppercase tracking-widest text-[10px] font-bold mb-2">Services</h5>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">Authentication Process</a>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">Shipping & Logistics</a>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">Private Sales</a>
                </div>
                <div className="flex flex-col gap-3">
                    <h5 className="text-red font-label uppercase tracking-widest text-[10px] font-bold mb-2">Legal</h5>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">Privacy Policy</a>
                    <a className="text-stone-500 text-sm hover:text-red transition-all">Terms of Service</a>
                    <p className="mt-4 text-stone-400 text-[10px] uppercase tracking-tighter">© 2024 A little Bid. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer