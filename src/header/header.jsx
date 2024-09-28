import React from 'react'
import Logo from '../../public/Logo.png';

const Header = () => {
    return (
        <div className=' h-[70px] shadow-lg flex items-center'>
            <img src={ Logo } className=' object-cover w-[86.9px] ml-8  h-[40px]  ' alt="Logo" />
        </div>
    )
}

export default Header