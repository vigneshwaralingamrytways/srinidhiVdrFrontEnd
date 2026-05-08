import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Popupcard,PopupSimpleCard,Table,CreateForm,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider  
  } from "../../../Components/CommonImports/CommonImports"
import classes from "../OrgChart.module.css"
import EmployeeTable from './EmployeeTable';

const rowWiseFields = 2;

function EmployeeData(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [data,setData]=useState([])

    useEffect(()=>{
     loadInitialData()
    },[])
    
    const loadInitialData=useCallback(async()=>{
     const obj=await post(api+`/orgChart/getAllEmployees`,{"id":Math.random()});
     if(response.ok && obj.length>0){ 
      const filteredData=obj.filter(p=>p.chartId==props?.selectedItem?.chartId);
      setData(filteredData)
     }
    },[])

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
    
    const showFormHandler = (item, action) => () => {
      console.log(action);
      
    };
  
    const template = {
    fields: [
    ],
  };
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    return (
      <div className={classes.container}>
           <Popupcard title={props?.selectedItem?.name}>
        
        <PopupSimpleCard>
          <Table
            cols={EmployeeTable(showFormHandler)}
            data={data}
            striped
          />
        </PopupSimpleCard>
      </Popupcard>

        </div>
    );
}

export default EmployeeData;


