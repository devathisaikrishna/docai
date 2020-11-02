import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";

const LineChart=((props)=>{
return(
        <>
        <div>
        <Chart
            // width={'1000px'}
            height={'300px'}
            chartType="LineChart"
            loader={<div className="loading_chart_box">Loading Chart</div>}
            data={props.data}
            options={props.options}
            rootProps={{ 'data-testid': '2' }}
        />
        </div>
        </>
    );
});
LineChart.defaultProps = {
    data:[
        ['x', 'Dogs', 'Cats', 'Cow'],
        [0, 0, 0 , 0],
        [1, 10, 5, 10],
        [2, 23, 15, 20],
        [3, 17, 9, 17],
        [4, 18, 10, 18],
        [5, 9, 5, 9],
        [6, 11, 3, 11],
        [7, 27, 19, 27],
    ],
    options:{
        hAxis: {
        title: 'Time',
        },
        vAxis: {
        title: 'No of api hitting',
        viewWindowMode: "explicit",
        viewWindow: {
            min: 0
        }
        },
        series: {
        1: { curveType: 'function' },
        },
    }
  };
export default LineChart;