import React from "react";
import ReactApexChart from "react-apexcharts";
const ChartPage = () => {
  const generateRandomData = (count) => {
    const data = [];
    let basePrice = 6600;

    for (let i = 0; i < count; i++) {
      const open = basePrice + Math.random() * 10;
      const high = open + Math.random() * 10;
      const low = open - Math.random() * 10;
      const close = open + Math.random() * 5 - 2.5;

      data.push({
        x: new Date(1538778600000 + i * 86400000), // Each data point represents a day
        y: [open, high, low, close],
      });

      basePrice = close;
    }

    return data;
  };
  // const seriesData = [{
  //   data: [{
  //       x: new Date(1538778600000),
  //       y: [6629.81, 6650.5, 6623.04, 6633.33]
  //     },
  //   ],
  // }];

  const seriesData = [
    {
      data: generateRandomData(20),
    },
  ];

  const chartOptions = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "CandleStick Chart",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };
  return (
    <div id="chart" style={{ padding: "20px" }}>
      <ReactApexChart
        options={chartOptions}
        series={seriesData}
        type="candlestick"
        height={350}
      />
    </div>
  );
};
export default ChartPage;
