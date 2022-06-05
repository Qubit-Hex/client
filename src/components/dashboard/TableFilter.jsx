/**
 * 
 *  @file: TableFilter.jsx
 * 
 *  @description: This file is used to filter the table data.
 * 
 * 
 */
 import React from "react";







/** 
 * 
 *  @function: handleSearch
 *  
 *  @description: This function is used to filter the table data, and handle the searching the data. from the api's
 *  
 */



const handleSearch = async (e) => {

    const search = e.target.value;
    const table = document.getElementById('tableContainer').querySelector('tbody');

    // search for the search term in the table.
      const searchTable = (search, table) => {
          const rows = table.querySelectorAll('tr');
          let count = 0;
          for (let i = 0; i < rows.length; i++) {
              if (rows[i].innerText.toLowerCase().includes(search.toLowerCase()) && search !== '') {
                  rows[i].style.display = '';
                  rows[i].classList.add('bg-green-50');
                  count++;
                  // highlight the child nodes of the row.
                  for (let j = 0; j < rows[i].childNodes.length; j++) {
                      if (rows[i].childNodes[j].innerText.toLowerCase().includes(search.toLowerCase())) {
                          rows[i].childNodes[j].classList.add('bg-green-50');
                      } else {
                          rows[i].childNodes[j].classList.add('bg-red-50');
                      }
                  }
              } else {
                  rows[i].style.display = 'none';
                  rows[i].classList.remove('bg-green-50');
              }     
          }

          // clear the table and update the number of results.
          for (let i = 0; i < rows.length; i++) {
              if (search === '' ) {
                  rows[i].style.display = '';
                  rows[i].classList.remove('bg-green-50');
                  // remove the child node colors
                  for (let j = 0; j < rows[i].childNodes.length; j++) {
                      rows[i].childNodes[j].classList.remove('bg-green-50');
                      rows[i].childNodes[j].classList.remove('bg-red-50');
                  }
              }
          }

          return count;

      }

      return searchTable(search, table);
}





 export const TableFilter = (props) => {

    const [numResults, setNumResults] = React.useState(0);

    return (
        <div>
            <div className='flex flex-wrap justify-center mt-4'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        <p className='font-normal'> Search For Metrics </p>
                        <p className='text-lg text-slate-700 font-normal text-sm'> Search for metrics and filter it. </p>
                        {/** make legends for colors green partial match red no match and no */}
                        <p className='text-green-500 font-normal text-sm'> { numResults } </p>
                    </h1>

                    <input type='text' className="mt-4 p-2 border border-slate-200 rounded-sm" onChange={(e) => { 
                        handleSearch(e).then((response) => {
                            setNumResults(response);
                        })                          
                         }} placeholder='Search for metrics' />
                </div>
            </div>

            <table className='table mt-4' id='tableContainer'>
                <thead>
                    <tr>
                        {
                            props.names.map((name, index) => {
                                return <th key={index}>{name}</th>
                            })
                        }
                    </tr>
                </thead>

                <tbody>
                    {
                        props.values.map((value, index) => {
                            return <tr key={index}>
                                {
                                    value.map((value, index) => {
                                        return <td key={index}>{value}</td>
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
 }