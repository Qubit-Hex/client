import React from "react";


/**
 * 
 *  @component: Home 
 * 
 *  @purpose:  This component is used to render the Home.
 * 
 */

export const Home = (props) => {
    return (

        <div className='p-10 m-10'>
            <h1 className='text-4xl font-bold'> Please Select one of the demos  </h1>
            <p className='m-2 font-bold hover:text-blue-700 hover:underline hover:underline-offset-4'> <a href='/charts/'> 1. Client Side general chart visualization </a></p>
            <p className='m-2 font-bold hover:text-blue-700 hover:underline hover:underline-offset-4'> <a href='/tables/'> 2. Client Side data table </a></p>
            <p className='m-2 font-bold hover:text-blue-700 hover:underline hover:underline-offset-4'> <a href='/geo/'> 3. Client Side Geo visualization</a></p>
        </div>
    );
}