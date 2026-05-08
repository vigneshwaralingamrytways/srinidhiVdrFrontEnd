import React, { useState, useEffect, useCallback , useRef  } from 'react';

import {

  SearchCard,SimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm, PopupSimpleCard
  } from '../../Components/CommonImports/CommonImports'
  import CanvasJSReact from '@canvasjs/react-charts';

  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;











const rowWiseFields = 4;

function ChartSearch(props) {

    const chartRef = useRef(null);
  const [initialData, setInitialData] = useState ([]);
  const [clientOption, setClientOption] = useState([{ value: "", label: "Select" }]);
  const [vehicleOption, setVehicleOption] = useState([{ value: "", label: "Select" }]);
  const [varientOption, setVarientOption] = useState([{ value: "", label: "Select" }]);
  const [fileOption, setFileOption] = useState([{ value: "", label: "Select" }]);
  const [prevWatchValues, setPrevWatchValues] = useState([]);

const { get, post, cache,response, loading, error } = useFetch({ data: [] });

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const [showModal, selectedForm, selectedData, modalWidth, modalLeft] = useSelector((state) => [
    state.modalProps.showModal,
    state.modalProps.selectedForm,
    state.modalProps.selectedData,
    state.modalProps.modalWidth,
    state.modalProps.modalLeft,
  ]);

  const dispatch = useDispatch();
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };
  

  const loadInitialCustomers = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const initialCusts = await post(api+"/emissionData/clientLoadOptions",{"emissionId":Math.random()});
   
    if (response.ok){

     setClientOption([{ value: "", label: "Select" },...initialCusts]);
    

    }
  }, [post, get, response]);

  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount




  const actions = ["subType","formConfig","user","add"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
    
   
    };
    

  const template = {
    
    fields: [
        {
            title: "Client Name",
            type: "select",
            name: "clientName",
            contains: "select",
    // validationProps: "Value is required",
          options:clientOption 
          }, {
            title: "Vehicle Name",
            type: "select",
            name: "vehicleName",
            contains: "select",
    // validationProps: "Value is required",
          options:vehicleOption 
          }, {
            title: "Varient",
            type: "select",
            name: "varient",
            contains: "select",
    // validationProps: "Value is required",
          options:varientOption 
          }, {
            title: "File Name",
            type: "select",
            name: "fileName",
            contains: "select",
    // validationProps: "Value is required",
          options:fileOption 
          }, 
          {
            title: "Type",
            type: "select",
            name: "type",
            contains: "select",
    // validationProps: "Value is required",
          options:[{ value: "", label: "Select" },
          { value: "Tail pipe Limit", label: "Tail pipe Limit" } ,
          { value: "Engine Out Time", label: "Engine Out Time" }]
          }, 

    ],
  };

 

  const validateValues = async (clientName,vehicleName,varient) => {

    
  
    if(clientName){
        const initialVehicle = await post(api+"/emissionData/vehicleLoadOptions",{"clientName":clientName});
    if(response.ok){
      setVehicleOption([{ value: "", label: "Select" },...initialVehicle])
     
    }
  } if(vehicleName){
    const initialVehicle = await post(api+"/emissionData/varientLoadOptions",{"clientName":clientName,"vehicleName":vehicleName});
if(response.ok){
  setVarientOption([{ value: "", label: "Select" },...initialVehicle])
 
}
}if(varient){
    const initialVehicle = await post(api+"/emissionData/fileNameLoadOptions",{"clientName":clientName,"vehicleName":vehicleName,"varient":varient});
if(response.ok){
  setFileOption([{ value: "", label: "Select" },...initialVehicle])
 
}
}
    };
    

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;

    if (
      watchValues.some(
        (value, index) =>
          value !== prevWatchValues[index] &&
          value !== "" &&
          value !== undefined
      )
    ) {
      validateValues(watchValues[0],watchValues[1],watchValues[2]);
      setPrevWatchValues([...watchValues]);
    }
  }

  function onSubmit(values) {

   
    searchDetails(values);
  }
  const searchDetails = async (values) => {
    if(values.clicked=="Search"){
      const orderapi = "/emissionData/searchEmission";

    const returnObject = await post(api + orderapi, values);
    
        if(returnObject.length>0){
      setInitialData(returnObject);
    }else{
      setInitialData([])
    }
  }

 
  };
  
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
        type: "line",
        name: "Speed",
        showInLegend: true,
        xValueFormatString: "##0.##",
        yValueFormatString: "#,##0.## km/h",
        dataPoints: initialData.map(item => ({
          x: parseFloat(item.timeLine),
          y: parseFloat(item.speed)
        }))
      },
      {
        type: "line", // line
        name: "CO ppm",
        axisYType: "secondary",
        showInLegend: true,
        xValueFormatString: "##0.##",
        yValueFormatString: "#,##0.## ppm",
        dataPoints: initialData.map(item => ({
          x: parseFloat(item.timeLine),
          y: parseFloat(item.coppm)
        }))
      }
    ]
  };
  return (
    <div className={classes.container} >

        <SearchCard
        title="Chart"
     
        buttonName=""
        
        
        onHeaderClick={showFormHandler({}, "add")}
        bottonShow={true}
  //      bottonShow={true}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          watchFields={["clientName","vehicleName","varient"]}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
         
          /> </SearchCard>
            
            <PopupSimpleCard md={12}>
            <CanvasJSChart options={options} onRef={ref => chartRef.current = ref} />
      </PopupSimpleCard>
    </div>
  );
}

export default ChartSearch;


