import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const { navigate, token, setCartItems, serverUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  const verifyPayment = async () => {
    try {
      if (!token) return;
      const res = await axios.post(`${serverUrl}/api/order/verifyStripe`, { success, orderId }, { headers: { token } });
      if (res.data.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        navigate('/cart');
      }
    } catch (err) {
      toast.error(err.message);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      {loading && <div className="text-center p-4 bg-white rounded shadow-md text-lg sm:text-xl">Verifying your payment...</div>}
    </div>
  );
};

export default Verify;