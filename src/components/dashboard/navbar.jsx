/** 
 *   
 *  @file: navbar.jsx
 * 
 * 
 *  @description: This component is the navbar for the dashboard.
 * 
 */

import React from "react";

export const  NavBar = (props) => {
    return (
        <nav className='navbar'>
            {/** nav bar using tailwind css */}
            <ul className='flex items-center flex-wrap bg-blue-500 p-6 bg-blue-800 text-white font-bold'>
                {props.children}
            </ul>
        </nav>
    );
}