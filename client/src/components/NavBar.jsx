import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const NavBar = () => {
  const [visible, setVisible] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext)
  const navigate = useNavigate()

  const logoutHandler = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setShowDropdown(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='flex items-center justify-between py-5 font-medium relative px-4 sm:px-8'>
      <Link to='/'><img src={assets.logo} className='w-36' alt='Logo'/></Link>

      {/* Desktop Menu */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'><p>HOME</p><hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/></NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'><p>COLLECTION</p><hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/></NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'><p>ABOUT</p><hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/></NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'><p>CONTACT</p><hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/></NavLink>
      </ul>

      {/* Right Icons */}
      <div className='flex items-center gap-6'>
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt='Search'/>
        <div className='relative' ref={dropdownRef} onMouseEnter={() => window.innerWidth >= 640 && setShowDropdown(true)} onMouseLeave={() => window.innerWidth >= 640 && setShowDropdown(false)}>
          <img onClick={() => {if(token)setShowDropdown(!showDropdown);else navigate('/login')}} src={assets.profile_icon} className='w-5 cursor-pointer' alt='Profile'/>
          {token && showDropdown && (
            <div className='absolute right-0 pt-4 z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow-lg'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => {navigate('/orders'); setShowDropdown(false)}} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logoutHandler} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='Cart'/>
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>
        {/* Mobile Menu Icon */}
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt='Menu'/>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full bg-white transition-transform duration-300 z-50 ${visible ? 'translate-x-0' : 'translate-x-full'} w-3/4 max-w-xs shadow-lg`}>
        <div className='flex flex-col text-gray-600 h-full'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer border-b'>
            <img src={assets.dropdown_icon} className='h-4 rotate-180' alt='Back'/>
            <p>Back</p>
          </div>
          <nav className='flex flex-col mt-4 gap-2'>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/'>HOME</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/about'>ABOUT</NavLink>
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/contact'>CONTACT</NavLink>
          </nav>
        </div>
      </div>
      {/* Overlay */}
      {visible && <div onClick={() => setVisible(false)} className='fixed inset-0  bg-opacity-30 z-40 sm:hidden'></div>}
    </div>
  )
}

export default NavBar;