/**
 * 
 *   @file: dashboardTemplate.jsx
 * 
 * 
 *   @description: This component is the template for the dashboard.
 *                 so its mostly a strictly ui component.
 * 
 */


import React from "react";
import { NavBar } from "./dashboard/navbar";


export const DashboardTemplate = (props) => {
    return (
        <div className='dashboard-container'>
            <NavBar>
                {/** some elements here */}
                <li className='m-4 hover:pointer hover:underline hover:underline-offset-8'>
                    <a href='/' className='m-3 '>
                      <span> Home</span> 
                      <i className='m-2 bi bi-house-fill'></i>
                    </a>
                </li>

                <li className='m-4 hover:pointer hover:underline hover:underline-offset-8'>
                    <a href='/charts/'> Charts </a>
                    {/** charts icon */}
                    <i className="m-2 bi bi-bar-chart-line-fill"></i>
                    
                </li>

                <li className="m-4 hover:pointer hover:underline hover:underline-offset-8">
                    <a href='/geo/'> Geo Data  </a>
                    {/** geo data icon */}
                    <i className="m-2 bi bi-globe"></i>
                </li>

                <li className='m-4 hover:pointer hover:underline hover:underline-offset-8'>
                    <a href='/tables/'> Tables </a>
                    <i className="m-2 bi bi-table"></i>    
                 </li>
            </NavBar>

            {props.children}
        </div>
    )
}   