import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart, selectCartItems, selectCartSubtotal } from '../store/cartSlice';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const GST_RATE = 0.05; // 5% Canadian federal GST

export default function CartPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(selectCartItems);
  const subtotal  = useSelector(selectCartSubtotal);
  const gst       = subtotal * GST_RATE;
  const total     = subtotal + gst;

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
    toast(`"${item.title}" removed from cart.`, { icon: '🗑️' });
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast('Cart cleared.');
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 shadow-sm" style={{ backgroundColor: '#152b5e' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-orange-300 transition">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Continue Shopping</span>
          </Link>
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ShoppingCart size={20} />
            Your Cart
          </div>
          <div className="w-32" /> {/* spacer */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {items.length === 0 ? (
          /* ---- Empty state ---- */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <ShoppingCart size={36} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Browse our catalog and add courses you're interested in.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              <BookOpen size={16} /> Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ---- Item list ---- */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">{items.length} Course{items.length !== 1 ? 's' : ''} in Cart</h2>
                <button onClick={handleClear} className="text-xs text-red-500 hover:text-red-600 font-medium transition">
                  Clear all
                </button>
              </div>

              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-blue-100">
                    {item.img ? (
                      <img src={`/${item.img}`} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={22} className="text-blue-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.type}</p>
                  </div>

                  {/* Price + remove */}
                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-gray-900">{item.priceStr}</p>
                    <p className="text-xs text-gray-400">CAD</p>
                    <button
                      onClick={() => handleRemove(item)}
                      className="mt-2 text-red-400 hover:text-red-600 transition"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ---- Order summary ---- */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                <h3 className="font-bold text-gray-900 text-base mb-4">Order Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>${gst.toFixed(2)} CAD</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)} CAD</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  Secure payment powered by Stripe • Prices in CAD
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
