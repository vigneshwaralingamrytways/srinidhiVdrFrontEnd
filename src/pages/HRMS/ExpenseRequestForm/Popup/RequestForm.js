import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Popupcard,PopupSimpleCard,Table,CreateForm,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider  
  } from "../../../../Components/CommonImports/CommonImports"
import classes from "../../OrgChart.module.css"

const rowWiseFields = 1;

function RequestForm(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [data,setData]=useState([])
    const [defaultValues,setDefaultValues]=useState(props?.selectedItem)
    // useEffect(()=>{
    //  loadInitialData()
    // },[])
    
    // const loadInitialData=useCallback(async()=>{
    //  const obj=await post(api+`/orgChart/getAllEmployees`,{"id":Math.random()});
    //  if(response.ok && obj.length>0){ 
    //   const filteredData=obj.filter(p=>p.chartId==props?.selectedItem?.chartId);
    //   setData(filteredData)
    //  }
    // },[])

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
      {
        title: "Request Date",
        type: "disabledDate",
        name: "requestDate",
        contains: "disabledDate",
        inpprops:{
             format:"dd/MM/yy"
        }
    },
    {
      title: "Expense Amount",
      type: "number",
      name: "expenseAmount",
      contains: "number",
      inpprops:{}
    },
    {
      title: "Expense Type",
      type: "select",
      name: "expenseType",
      contains: "select",
      options:[
        {value:"",label:"Select"},
        {value:"Travel Expenses",label:"Travel Expenses"},
        {value:"BroadBand Expenses",label:"BroadBand Expenses"},
        {value:"Food Expenses",label:"Food Expenses"},
      ],
      inpprops:{}
    },
    ],
  };
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    const onSubmit=async(values)=>{

    }

    return (
        <div className={classes.container}>
        <Popupcard
          title="Add Expenses"
  
        >
          <CreateForm
            template={template}
            rowwise={rowWiseFields}
            validate={validate}
            onSubmit={onSubmit}
            onCancel={props.onCancel}
            defaultValues={defaultValues}
            buttonName="Save"
  
          ></CreateForm>
  
  
        </Popupcard>
  
      </div>
    );
}

export default RequestForm;


