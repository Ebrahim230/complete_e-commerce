import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestSeller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestSeller', bestSeller)
      sizes.forEach(size => formData.append('sizes[]', size))
      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)
      const token = localStorage.getItem('token')
      const response = await axios.post(serverUrl + '/api/product/add', formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('')
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, i) => (
            <label key={i} htmlFor={`image${i + 1}`}>
              <img className='w-20' src={[image1, image2, image3, image4][i] ? URL.createObjectURL([image1, image2, image3, image4][i]) : assets.upload_area} alt="" />
              <input type="file" id={`image${i + 1}`} hidden onChange={(e) => setImage(e.target.files[0])} />
            </label>
          ))}
        </div>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input type="text" placeholder='Type here' className='w-full max-w-[500px] px-3 py-2' required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea placeholder='Write content here' className='w-full max-w-[500px] px-3 py-2' required value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select className='w-full px-3 py-2' value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub Category</p>
          <select className='w-full px-3 py-2' value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Product Price</p>
          <input type="Number" placeholder='24' className='w-full px-3 py-2 sm:w-[120px]' required value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}>
              <p className={`px-3 py-1 cursor-pointer ${sizes.includes(size) ? 'bg-black text-white' : 'bg-slate-200'}`}>{size}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex mt-2 gap-2'>
        <input type="checkbox" id='bestSeller' checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} />
        <label htmlFor="bestSeller" className='cursor-pointer'>Add to Best Seller</label>
      </div>
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white rounded cursor-pointer'>ADD</button>
    </form>
  )
}

export default Add;