import React, { useRef } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const BoxLineChart = () => {
  const chartRef = useRef(null);

  const options = {
    theme: "light2",
    animationEnabled: true,
    title: {
      text: "Box Line Chart"
    },
    axisX: {
      title: "X Axis",
      interval: 1,
      minimum: 0,
      maximum: 10
    },
    axisY: {
      title: "Y Axis",
      interval: 1,
      minimum: 0,
      maximum: 10
    },
    data: [
      {
        type: "line",
        name: "First Box (Blue)",
        showInLegend: true,
        color: "blue",
        dataPoints: [
          { x: 0, y: 5 },  // Start point
          { x: 2, y: 5 },  // Horizontal line
          { x: 2, y: 0 },  // Vertical line back down
   
        ]
      },
      {
        type: "line",
        name: "Second Box (Green)",
        showInLegend: true,
        color: "green",
        dataPoints: [
          { x: 0, y: 9 },  // Start point
          { x: 5, y: 9 },  // Horizontal line
          { x: 5, y: 0 },  // Vertical line back down
          
        ]
      }
    ]
  };

  return (
    <div>
      <CanvasJSChart options={options} onRef={ref => chartRef.current = ref} />
    </div>
  );
};

export default BoxLineChart;
