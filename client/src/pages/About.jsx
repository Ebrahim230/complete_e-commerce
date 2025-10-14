import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
        <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img src={assets.about_img} className='w-full md:max-w-[450px] ' alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus laboriosam illo debitis, molestiae veniam tempora exercitationem magnam temporibus hic similique laborum nesciunt quidem, dolores nostrum nemo odit, dolorum quos consequatur.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae quidem temporibus molestias vitae minus inventore neque cumque aspernatur, ab est officiis accusamus quod quis sequi culpa soluta, nihil, error obcaecati.</p>
            <b className='text-gray-800'>Our Mission</b>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum doloribus culpa, reiciendis exercitationem totam asperiores quo id cumque commodi sit voluptatibus rem necessitatibus blanditiis dolores molestiae ratione ea corrupti similique.</p>
          </div>
        </div>
        <div className='text-xl py-4 '>
          <Title text1={'WHY'} text2={'CHOOSE US'}/>
        </div>
        <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores minima cupiditate recusandae optio tenetur maxime qui veritatis corrupti id est fugiat nam iste ratione minus, culpa inventore, ducimus libero at.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores minima cupiditate recusandae optio tenetur maxime qui veritatis corrupti id est fugiat nam iste ratione minus, culpa inventore, ducimus libero at.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores minima cupiditate recusandae optio tenetur maxime qui veritatis corrupti id est fugiat nam iste ratione minus, culpa inventore, ducimus libero at.</p>
          </div>        
        </div>
        <NewsletterBox/>
      </div>
    </div>
  )
}

export default About
