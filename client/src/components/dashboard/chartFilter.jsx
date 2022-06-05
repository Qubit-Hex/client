/**
 * 
 *  @file: chartFilter.jsx
 * 
 *  @desc: component for filtering the chart 
 * 
 */

import React from "react";
import {Chart} from "react-google-charts";

/**
 * 
 *  @component: FilterCharts
 * 
 *  @descriptions: This component is used to filter the chart. and configurable
 * 
 *  @parma: props
 * 
 *  props.index - index names of the values in the chart
 *  props.data - data of the chart
 *  props.controls - controls of the chart
 * 
 * 
 *  @return: JSX
 * 
 */

export const ChartFilter = (props) => {


    return (
 
            <Chart chartType={props.type} width="100%" height={"600px"}

                data={
                    [ 
                        [...props.names],
                        ...props.values
                    ]
                }

                chartEvents={props.chartEvents}
             
                chartPackages={
                    ["corechart", "controls", "table", "timeline", "orgchart", "treemap", "gantt", "calendar"]
                }


                controls={
                    [...props.controlOptions]
                }
                
                legendToggle={true}

                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 1px 2px rgba(0,0,0,.1)',
                    padding: '20px'
                }}
            />
    );
}
