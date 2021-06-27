import React, { Component } from "react";
import { Line } from "react-chartjs-2";

// eslint-disable-next-line no-sparse-arrays
const data = [7, 8, 7, 8, 10, 8, 6, 5, 5, 3];

const chartData = {
    labels: data,
    datasets: [
        {
            label: "Population",
            cubicInterpolationMode: "monotone",
            tension: 0.0,
            data: data,
            fill: "origin",
            borderColor: "rgb(187, 171, 222)",
            backgroundColor: "rgb(233, 228, 247)",
        },
    ],
};

const config = {
    type: "line",
    data: chartData,
    options: {
        responsive: true,
        layout: {
            padding: {
                top: 4
            }
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    },
};

class Chart extends Component {
    render() {
        return <Line {...config} />;
    }
}

export default Chart;
