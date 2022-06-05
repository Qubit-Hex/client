import React from "react";
import { Dial } from '../lib/dial';

// sub imports
import { TableFilter } from './dashboard/TableFilter';



/**
 * 
 *  @function: fetchData
 * 
 * 
 *  @description: fetch the data via a get request in a configurable way.
 * 
 * 
 */


const fetchData = async (url) => {
    const api = new Dial();

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    return await api.get(url, headers)
}


/**
 * 
 *  @function: ChangeDataSet
 * 
 *  @descriptions: This function is used to change the data set of the chart.
 * 
 *  @parma: props
 */

const ChangeDataSet = (props) => {

    const [data, setData] = React.useState([]);
    const [chartValues, setChartValues] = React.useState([]);
    const [names, setNames] = React.useState([]);
    const [controlObject, setControlObject] = React.useState([]);


    React.useEffect(() => {
        // routes to fetch the data
        const datasetRoutes = { 
            eventsHourly: '/events/hourly',
            eventsDaily: '/events/daily',
            statsHourly: '/stats/hourly',
            statsDaily: '/stats/daily',
            poi: '/poi'
        }

        const reload = async () => {
            // we have to clear the state each time we change the data set
            // otherwise the chart will trigger an error when we try to change the data set

            setData([]);
            setChartValues([]);
            setNames([]);
            setControlObject([]);
            
            let data = await fetchData(datasetRoutes[props.dataset]);
            setData(data);   
            
            // dynamically set the chart labels so we dont have to worry 
            // label just pass object into this component

            let names = Object.keys(data[0]);
            setNames(names);
            // organize the data into an array of arrays
            let newData = data.map(element => {
                
                return Object.values(element);
            });

            setChartValues(newData);

            // next make the control objects
            let controlObject = names.map((name, index) => {
                return {
                    controlType: 'StringFilter',
                    options: {
                        filterColumnIndex: index,
                        ui: {
                            labelStacking: 'horizontal',
                            label: name,
                            caption: 'Filter by ' + name,
                            allowMultiple: true,
                        },   
                    }                      
                }
        });
            // put the information about
            setControlObject(controlObject);
        }

        reload();
    }, [props.dataset]);



    // check if the data is loaded and if the charts properties are correct and not a invalid format. 
    if (chartValues.length > 0 && names.length > 0 && names.length === chartValues[0].length) {

        return ( <TableFilter  type={props.chartType} names={names} values={[...chartValues]} data={[...data]} controlOptions={[...controlObject]} /> );
    } else {
        return (
            <div>
                Loading...
            </div>
        );
    }
}

/**
 * 
 *  @component: Table 
 * 
 *  @purpose:  This component is used to render the table.
 * 
 */

export const Table = (props) => {
    // charts to render 
    const [datasetPrimary, setDatasetPrimary] = React.useState('eventsHourly');

    return (
        <div className='mt-md-4'>

            <div className='flex flex-wrap justify-center mt-20'>
                <div>
                    <h1 className='text-2xl text-center font-bold'>
                        <p> Compare Metrics </p>
                        <p className='text-lg text-slate-700'> Compare your metrics and dataset and filter it. </p>
                    </h1>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row m-4 p-6 '>
                <div className='flex-1'>

                <div className="p-5">
                    <div>
                        <label htmlFor="Dataset" className='text-sm font-bold'> Choose a dataset </label>
                  
                        <select className='m-2 p-2' onClick={(e) => {
                            // update the start of the current component.
                            setDatasetPrimary(e.target.value);  
                            // hydrade the chart

                        }}>
                            <option value='eventsHourly'> Events Hourly</option>
                            <option value='eventsDaily'> Events Daily</option>
                            <option value='statsHourly'> Stats Hourly</option>
                            <option value='statsDaily'> Stats Daily</option>
                            <option value='poi'> POI</option>
                        </select>
                        
                    </div>

                    <ChangeDataSet dataset={datasetPrimary} />
                </div>

                </div>

        
            </div>
     </div>
    );
}