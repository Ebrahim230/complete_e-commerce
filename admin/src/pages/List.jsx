import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { serverUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/product/list`)
      if (res.data.success) {
        setList(res.data.products)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }
  const removeProduct = async (id) => {
    try {
      const res = await axios.post(serverUrl + '/api/product/remove', { id }, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  }
  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        All Products List
      </h2>

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 bg-gray-100 border text-sm font-semibold text-gray-700 rounded-md">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product Rows */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 py-2 px-3 border rounded-md hover:shadow transition duration-200 text-sm bg-white"
            >
              <img
                className="w-12 h-12 object-cover rounded-md border"
                src={item.image[0]}
                alt={item.name}
              />
              <p className="font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-gray-600">{item.category}</p>
              <p className="text-gray-800 font-semibold">
                {currency}
                {item.price}
              </p>
              <p onClick={() => removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-red-500 hover:text-red-700 text-lg font-bold">
                ×
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">No products found</p>
        )}
      </div>
    </div>
  )
}

export default List;