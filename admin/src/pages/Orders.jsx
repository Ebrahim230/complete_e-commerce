import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl, currency } from '../App'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllOrders = async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await axios.post(serverUrl + '/api/order/list', {}, { headers: { token } })
      if (res.data.success) {
        setOrders(res.data.orders)
      } else {
        toast.error(res.data.message || 'Failed to fetch orders.')
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  if (!token) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        Please login to view orders.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        Loading orders...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-semibold mb-8 text-gray-800 border-b pb-3">
        Admin Orders
      </h3>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 text-lg">No orders found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition bg-white p-6 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src={assets.parcel_icon} alt="parcel" className="w-6 h-6" />
                  <h4 className="text-lg font-semibold text-gray-800">
                    Order #{i + 1}
                  </h4>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status || 'Pending'}
                </span>
              </div>

              {/* Items */}
              <div className="text-sm text-gray-700 space-y-1 mb-3">
                {order.items.map((item, idx) => (
                  <p key={idx} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                      <span className="text-gray-400 ml-1">[{item.size}]</span>
                    </span>
                  </p>
                ))}
              </div>

              {/* Address */}
              <div className="text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3 leading-relaxed">
                <p className="font-medium text-gray-800">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.country}{' '}
                  {order.address.zipcode}
                </p>
                <p className="text-gray-500 mt-1">📞 {order.address.phone}</p>
              </div>

              {/* Payment + Total + Date */}
              <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-4 text-sm">
                <div>
                  <p className="text-gray-700">
                    <strong>Payment:</strong> {order.paymentMethod}
                  </p>
                  <p className="text-gray-800 font-semibold mt-1">
                    <strong>Total:</strong> {currency}
                    {order.amount?.toFixed(2)}
                  </p>
                </div>
                <p className="text-gray-500 text-right">
                  <span className="font-medium text-gray-700">Date:</span>{' '}
                  {new Date(order.date).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders;