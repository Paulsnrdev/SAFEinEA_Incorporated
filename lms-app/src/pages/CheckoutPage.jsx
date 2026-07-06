import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartSubtotal, clearCart } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShieldCheck, ExternalLink, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const GST_RATE = 0.05;

export default function CheckoutPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, profile } = useAuth();
  const items     = useSelector(selectCartItems);
  const subtotal  = useSelector(selectCartSubtotal);
  const gst       = subtotal * GST_RATE;
  const total     = subtotal + gst;

  const [form, setForm] = useState({
    firstName:    profile?.firstName ?? '',
    lastName:     profile?.lastName  ?? '',
    email:        user?.email ?? '',
    phone:        '',
    organization: '',
  });
  const [paidIds, setPaidIds] = useState(new Set());

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-orange-500 font-semibold hover:underline">Browse Courses</Link>
        </div>
      </div>
    );
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  const handlePayForItem = (item) => {
    if (!form.firstName.trim() || !form.email.trim()) {
      toast.error('Please fill in your name and email first.');
      return;
    }

    if (!item.stripeLink) {
      toast.error('Payment link not configured yet. Please contact us.', { duration: 5000 });
      return;
    }

    // Append prefill params to the Stripe Payment Link so customer info is pre-filled
    const url = new URL(item.stripeLink);
    url.searchParams.set('prefilled_email', form.email.trim());
    window.open(url.toString(), '_blank', 'noopener,noreferrer');

    // Mark this item as "payment initiated"
    setPaidIds((prev) => new Set([...prev, item.id]));
  };

  const handleAllPaid = () => {
    dispatch(clearCart());
    toast.success('Thank you for your purchase! Check your email for access details.', { duration: 6000 });
    navigate('/');
  };

  const allInitiated = items.every((i) => paidIds.has(i.id));

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 shadow-sm" style={{ backgroundColor: '#152b5e' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-white hover:text-orange-300 transition text-sm font-medium">
            <ArrowLeft size={18} /> Back to Cart
          </Link>
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ShieldCheck size={20} /> Secure Checkout
          </div>
          <div className="w-32" />
        </div>
      </div>

      {/* Progress steps */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs font-medium">
          <Link to="/cart" className="text-gray-400 hover:text-gray-600">Cart</Link>
          <span className="text-gray-300">›</span>
          <span className="text-orange-500">Checkout</span>
          <span className="text-gray-300">›</span>
          <span className="text-gray-400">Payment</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ---- Left: Contact info + Payment ---- */}
          <div className="lg:col-span-3 space-y-5">

            {/* Contact information */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4 text-base">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First name *</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" {...field('firstName')} placeholder="Jane" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last name *</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" {...field('lastName')} placeholder="Smith" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email address *</label>
                  <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" {...field('email')} placeholder="jane@company.ca" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
                  <input type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" {...field('phone')} placeholder="+1 (204) 000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Organization / Company</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" {...field('organization')} placeholder="Your company name (optional)" />
                </div>
              </div>
            </div>

            {/* Payment section */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-1 text-base">Payment</h2>
              <p className="text-xs text-gray-500 mb-4">
                Click <strong>Pay Now</strong> for each course below. You'll be redirected to Stripe's secure checkout page. After paying, return here and confirm.
              </p>

              {items.length > 1 && (
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 mb-4">
                  <AlertCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Each course has a separate payment link. Complete payment for each one using the buttons below.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {items.map((item) => {
                  const paid = paidIds.has(item.id);
                  return (
                    <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border transition ${paid ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                      {/* Thumb */}
                      <div className="w-12 h-10 rounded-md overflow-hidden shrink-0 bg-blue-100">
                        {item.img ? (
                          <img src={`/${item.img}`} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><BookOpen size={16} className="text-blue-300" /></div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.priceStr} CAD</p>
                      </div>
                      {/* Pay button */}
                      {paid ? (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold shrink-0">
                          <CheckCircle size={16} /> Payment opened
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePayForItem(item)}
                          className="shrink-0 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                        >
                          Pay Now <ExternalLink size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Confirm all paid */}
              {paidIds.size > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleAllPaid}
                    className={`w-full py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                      allInitiated
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!allInitiated}
                  >
                    <CheckCircle size={16} />
                    {allInitiated ? 'I\'ve Completed All Payments' : `Complete remaining ${items.length - paidIds.size} payment(s) above`}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    Only click after all Stripe payment pages have been completed.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ---- Right: Order summary ---- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-base">Order Summary</h3>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2 flex-1">{item.title}</span>
                    <span className="text-gray-800 font-medium shrink-0">{item.priceStr}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (5%)</span><span>${gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                  <span>Total</span><span>${total.toFixed(2)} CAD</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={13} className="text-green-500" />
                Secured by Stripe · 256-bit SSL
              </div>

              {/* Stripe badge placeholder */}
              <div className="mt-3 flex justify-center">
                <div className="px-3 py-1.5 rounded border border-gray-200 bg-gray-50 text-[10px] text-gray-400 font-medium tracking-wide flex items-center gap-1.5">
                  <span className="text-indigo-600 font-black text-xs">S</span> Powered by Stripe
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
