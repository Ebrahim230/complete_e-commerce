import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { serverUrl, currency } from "../App"

const Orders = ({ token, userId }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllOrders = async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await axios.post(`${serverUrl}/api/order/list`, {}, { headers: { token } })
      if (res.data.success) setOrders(res.data.orders)
      else toast.error(res.data.message)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.post(`${serverUrl}/api/order/status`, { orderId, status }, { headers: { token } })
      if (res.data.success) setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      else toast.error(res.data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const cancelOrder = async (orderId) => {
    if (!token) return
    try {
      const res = await axios.post(`${serverUrl}/api/order/cancel`, { orderId, userId, role: "admin" }, { headers: { token } })
      if (res.data.success) setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "Cancelled" } : o))
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => { fetchAllOrders() }, [token])

  if (!token) return <div className="text-center text-gray-500 mt-10 text-lg">Please login to view orders.</div>
  if (loading) return <div className="text-center text-gray-500 mt-10 text-lg">Loading orders...</div>

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-semibold mb-8 text-gray-800 border-b pb-3">Admin Orders</h3>
      {orders.length === 0 ? <p className="text-gray-500 text-center mt-10 text-lg">No orders found.</p> :
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl shadow-md bg-white p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Order #{i + 1}</h4>
                <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="text-sm border rounded px-2 py-1 bg-gray-50">
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="text-sm text-gray-700 space-y-1 mb-3">
                {order.items.map((item, idx) => <p key={idx}>{item.name} × {item.quantity} [{item.size}]</p>)}
              </div>
              <div className="text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3">
                <p className="font-medium text-gray-800">{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state}, {order.address.country} {order.address.zipcode}</p>
                <p className="text-gray-500 mt-1">📞 {order.address.phone}</p>
              </div>
              <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-4 text-sm">
                <p className="text-gray-800 font-semibold">Total: {currency}{order.amount?.toFixed(2)}</p>
                {order.status !== "Cancelled" && <button onClick={() => cancelOrder(order._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Cancel</button>}
                {order.status === "Cancelled" && <span className="text-red-500 font-medium text-sm">Cancelled</span>}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default Orders;