import React, { useRef } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const GraphswithMultipleAxes = () => {
  const chartRef = useRef(null);

  const initalData = [
    {
      "clientName": "Tata Motars",
      "vehicleName": "Nixon",
      "varient": "10.28.30",
      "fileName": "DTVS _2024_400",
      "timeLine": "0",
      "speed": "0.25",
      "noxppm": "-0.02",
      "noxgs": "0.04",
      "coppm": "0.1",
      "cogs": "0",
      "thcppm": "0",
      "thcgs": "-0.09",
      "opacity": "0"
    },
    {
      "clientName": "Tata Motars",
      "vehicleName": "Nixon",
      "varient": "10.28.30",
      "fileName": "DTVS _2024_400",
      "timeLine": "0.1",
      "speed": "0.23",
      "noxppm": "-0.02",
      "noxgs": "0.04",
      "coppm": "1.5",
      "cogs": "0",
      "thcppm": "0",
      "thcgs": "-0.09",
      "opacity": "0"
    },
    {
      "clientName": "Tata Motars",
      "vehicleName": "Nixon",
      "varient": "10.28.30",
      "fileName": "DTVS _2024_400",
      "timeLine": "0.2",
      "speed": "0.23",
      "noxppm": "-0.02",
      "noxgs": "0.04",
      "coppm": "0.6",
      "cogs": "0",
      "thcppm": "0",
      "thcgs": "-0.09",
      "opacity": "5"
    },
    {
      "clientName": "Tata Motars",
      "vehicleName": "Nixon",
      "varient": "10.28.30",
      "fileName": "DTVS _2024_400",
      "timeLine": "0.3",
      "speed": "0.23",
      "noxppm": "-0.02",
      "noxgs": "0.04",
      "coppm": "1.6",
      "cogs": "0",
      "thcppm": "0",
      "thcgs": "-0.09",
      "opacity": "0"
    },
    {
      "clientName": "Tata Motars",
      "vehicleName": "Nixon",
      "varient": "10.28.30",
      "fileName": "DTVS _2024_400",
      "timeLine": "0.4",
      "speed": "0.23",
      "noxppm": "-0.02",
      "noxgs": "0.04",
      "coppm": "1.2",
      "cogs": "0",
      "thcppm": "0",
      "thcgs": "-0.09",
      "opacity": "0"
    }
  ];

  const toggleDataSeries = (e) => {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chartRef.current.render();
  };

  const options = {
    theme: "light9",
    animationEnabled: true,
    zoomEnabled: true,
		    title: {
      text: "Speed vs CO ppm"
    },
    axisX: {
      title: "Timeline",
      valueFormatString: "##0.##",
      crosshair: {
        enabled: true
      }
    },
    axisY: {
      title: "Speed",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC"
    },
    axisY2: {
      title: "CO ppm",
      titleFontColor: "#C0504E",
      lineColor: "#C0504E",
      labelFontColor: "#C0504E",
      tickColor: "#C0504E"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries
    },
    data: [
      {
        type: "spline",
        name: "Speed",
        showInLegend: true,
        xValueFormatString: "##0.##",
        yValueFormatString: "#,##0.## km/h",
        dataPoints: initalData.map(item => ({
          x: parseFloat(item.timeLine),
          y: parseFloat(item.speed)
        }))
      },
      {
        type: "spline", // line
        name: "CO ppm",
        axisYType: "secondary",
        showInLegend: true,
        xValueFormatString: "##0.##",
        yValueFormatString: "#,##0.## ppm",
        dataPoints: initalData.map(item => ({
          x: parseFloat(item.timeLine),
          y: parseFloat(item.coppm)
        }))
      }
    ]
  };

  return (
    <div>
      <CanvasJSChart options={options} onRef={ref => chartRef.current = ref} />
    </div>
  );
};

export default GraphswithMultipleAxes;
