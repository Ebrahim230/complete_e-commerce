import React, { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import axios from "axios"
import { toast } from "react-toastify"

const Orders = () => {
  const { serverUrl, token, currency, userId } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])
  const [statusMap, setStatusMap] = useState({})

  const loadOrderData = async () => {
    try {
      if (!token) return
      const res = await axios.post(`${serverUrl}/api/order/userorders`, { userId }, { headers: { token } })
      if (res.data.success) {
        let allOrderItem = []
        res.data.orders.forEach(order => {
          order.items.forEach(item => {
            item.orderId = order._id
            item.status = order.status?.trim()
            item.payment = order.payment
            item.paymentMethod = order.paymentMethod
            item.date = order.date
            allOrderItem.push(item)
          })
        })
        const reversed = allOrderItem.reverse()
        setOrderData(reversed)
        const map = {}
        reversed.forEach((item, idx) => { map[idx] = item.status })
        setStatusMap(map)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const cancelOrder = async (orderId, idx, status) => {
    if (!status || status.toLowerCase() !== "order placed") return toast.error("Cannot cancel this order")
    try {
      const res = await axios.post(`${serverUrl}/api/order/cancel`, { orderId, userId, role: "user" }, { headers: { token } })
      if (res.data.success) {
        setStatusMap(prev => ({ ...prev, [idx]: "Cancelled" }))
        toast.success(res.data.message)
      } else toast.error(res.data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const trackOrder = async (idx) => {
    try {
      if (!token) return
      await loadOrderData()
      toast.info("Status updated from server")
    } catch (err) {
      toast.error("Failed to refresh status")
    }
  }

  useEffect(() => { loadOrderData() }, [token])

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>
      <div>
        {orderData.map((item, idx) => (
          <div key={idx} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-6 text-sm">
              <img src={item.image[0]} className="w-16 sm:w-20" alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1">Date: <span className="text-gray-400">{new Date(item.date).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</span></p>
                <p className="mt-1">Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{statusMap[idx]}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => trackOrder(idx)} className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer">Track Order</button>
                {statusMap[idx]?.toLowerCase() === "order placed" &&
                  <button onClick={() => cancelOrder(item.orderId, idx, statusMap[idx])} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">Cancel</button>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders;