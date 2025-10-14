import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    useEffect(()=>{
        if(products.length>0){
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((i)=>category===i.category);
            productsCopy = productsCopy.filter((i)=>subCategory===i.subCategory);
            setRelated(productsCopy.slice(0,5));
        }
    },[products])
    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={'RELATED'} text2={'PRODUCTS'}/>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 '>
                {
                    related.map((i,j)=>(
                        <ProductItem key={j} id={i._id} name={i.name} price={i.price} image={i.image}/>
                    ))
                }
            </div>
        </div>
    )
}

export default RelatedProducts
