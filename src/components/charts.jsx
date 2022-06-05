import React from "react";
import { Dial } from '../lib/dial';

import { ChartFilter } from "./dashboard/chartFilter";


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

         
            setChartValues([]);
            setNames([]);
            setControlObject([]);

            
            let data = await fetchData(datasetRoutes[props.dataset]);
        
            
            // dynamically set the chart labels so we dont have to worry 
            // label just pass object into this component

            let names = Object.keys(data[0]);
            setNames(names);
            // organize the data into an array of arrays
            let newData = data.map(element => {
                if (element.date)  {
                    element.date = new Date(element.date);
                }
                // convert the Object.values array to an (Number) using typecast
                let arrayOfNumbers = Object.values(element).map(Number);
                // convert the date to a human readable format
                arrayOfNumbers[0] = new Date(arrayOfNumbers[0]);
                return arrayOfNumbers;
            });

            setChartValues(newData);

            // next make the control objects
            let controlObject = names.map((name, index) => {
                return {
                    controlType: 'CategoryFilter',
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

        return ( <ChartFilter type={props.chartType} names={names} values={[...chartValues]} controlOptions={[...controlObject]} /> );
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
 *  @component: Charts 
 * 
 *  @purpose:  This component is used to render the Charts. this is for the client side chart visualization. in question 2.
 * 
 * 
 */

export const Charts = (props) => {

    // charts to render 
    const [datasetPrimary, setDatasetPrimary] = React.useState('eventsHourly');
    const [datasetSecondary, setDatasetSecondary] = React.useState('eventsHourly');

    const [primaryChartType, setPrimaryChartType] = React.useState('Bar');
    const [secondaryChartType, setSecondaryChartType] = React.useState('Bar');



    return (
        <div className='mt-md-4'>
            <div className='flex flex-wrap justify-center'>
                <div>
                    <div className='p-10 m-10'>
                        <h1 className='text-4xl font-bold'>
                            <span> Charts Stats </span>
                            <i className='bi bi-chart'></i>    
                        </h1>
                    </div>
                </div>
            </div>

            <div className='flex flex-wrap justify-center'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        <span> Compare Metrics </span>
                        <span className='text-lg text-slate-700'> Compare your metrics and dataset and filter it. </span>
                    </h1>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row m-4 p-6'>
                <div className='flex-1'>

                <div className="p-5 shadow-lg rounded-sm">
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
                        </select>


                        <label htmlFor="ChartType" className='text-sm font-bold'> Choose a chart type </label>

                        {/** chart type  */}
                        <select className='m-2 p-2' onClick={(e) => {
                            // update the start of the current component.
                            setPrimaryChartType(e.target.value);
                        }}>
                              <option value='AreaChart'> Area Chart</option>
                                <option value='Bar'> Bar</option>
                                <option value='BarChart'> Bar Chart</option>
                                <option value='ColumnChart'> Column Chart</option>
                                <option value='Line'> Line</option>
                                <option value='Scatter'> Scatter</option>
                                <option value='ScatterChart'> Scatter Chart </option>
                        </select>
                    </div>

                    <ChangeDataSet dataset={datasetPrimary} chartType={primaryChartType}/>
                </div>

                </div>

                <div className='flex-1'>

                    <div className="p-5 shadow-lg rounded-sm">
                        <div>
                            <label htmlFor="Dataset" className='text-sm font-bold'> Choose a dataset </label>

                            <select className='m-2 p-2' onClick={(e) => {
                                // update the start of the current component.
                                setDatasetSecondary(e.target.value);  
                                // hydrade the chart

                            }}>
                                <option value='eventsHourly'> Events Hourly</option>
                                <option value='eventsDaily'> Events Daily</option>
                                <option value='statsHourly'> Stats Hourly</option>
                                <option value='statsDaily'> Stats Daily</option>
                            
                            </select>


                            <label htmlFor="ChartType" className='text-sm font-bold'> Choose a chart type </label>

                            {/** chart type  */}
                            <select className='m-2 p-2' onClick={(e) => {
                                // update the start of the current component.
                                setSecondaryChartType(e.target.value);
                            }}>
                                <option value='AreaChart'> Area Chart</option>
                                <option value='Bar'> Bar</option>
                                <option value='BarChart'> Bar Chart</option>
                                <option value='ColumnChart'> Column Chart</option>
                                <option value='Line'> Line</option>
                                <option value='Scatter'> Scatter</option>
                                <option value='ScatterChart'> Scatter Chart </option>
                             
                            </select>
                        </div>

                        <ChangeDataSet dataset={datasetSecondary} chartType={secondaryChartType}/>
                    </div>
                </div>
            </div>
     </div>
    )
}
