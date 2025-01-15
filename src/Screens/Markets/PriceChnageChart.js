import React from "react";
import ReactApexChart from "react-apexcharts";
 
const PriceChnageChart = () => {
  const options = {
    chart: {
      type: 'bar', // Change to 'bar' for vertical bars
      height: 150,
    },
    plotOptions: {
      bar: {
        horizontal: false, // Set to false for vertical bars
        columnWidth: '50%', // Adjust the width of the bars as needed
        endingShape: 'rounded', // You can change this to 'flat' for flat ends
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['>10%','7-10%','March','April','May','june','july','August','september'],
    },
    yaxis: {
      title: {
        text: 'Percentage', // Add a y-axis title if needed
      },
    },
    colors: ['#ad3931'], // Change the color of the bars as needed
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return val + "%"; // Add a percentage symbol to the tooltip value
        }
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const category = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex] + "%";
        return `
          <div class="tooltip-custom">
            <div class="tooltip-label">${category}</div>
            <div class="tooltip-value">${value}</div>
          </div>
        `;
      },
    },
  };
 
  const series = [{
    data: [99, 87, 75, 63, 45, 70,65,81,97],
  }];
 
  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={450} />
    </div>
  );
};
 
export default PriceChnageChart;