import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Popupcard, PopupSimpleCard, Table, CreateForm, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider
} from "../../../../Components/CommonImports/CommonImports"
import classes from "../../OrgChart.module.css"

const rowWiseFields = 2;

function RequestForm(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [data, setData] = useState([])
    const [toDate,setTodate]=useState(props?.selectedItem)
    const [defaultValues, setDefaultValues] = useState(props?.selectedItem)
    const [prevWatchValues,setPrevWatchValues]=useState([])
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
                title: "No Of Days",
                type: "number",
                name: "noOfDays",
                contains: "number",
                inpprops:{},
                validationProps: "No Of Days is Required"
            },
            {
                title: "Leave Date From",
                type: "todayDate",
                name: "fromDate",
                contains: "todayDate",
                validationProps: "From Date is Required",
                inpprops:{
                     format:"dd/mm/yy"
                }
            },
            {
                title: "Leave Date To",
                type: "todayDate",
                name: "toDate",
                contains: "todayDate",
                value:toDate,
                inpprops:{
                     format:"yyyy-MM-dd"
                }
            },
            {
               title:"Leave Type",
               type:"select",
               name:"leaveType",
               contains:"select",
               options:[
                {value:"",label:"Select"},
                {value:1,label:"Casual Leave"},
                {value:2,label:"Sick Leave"},
                {value:3,label:"Emergency Leave"},
                {value:4,label:"Special Leave"},
                {value:5,label:"Study Leave"}
               ]
            },
            {
                title: "Reason",
                type: "textarea",
                name: "reason",
                contains: "textarea",
                validationProps:"Reason is Required",
                inpprops:{
                    md:6
                }
            },
        ],
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
            ValidateValues(watchValues[0],watchValues[1])
            setPrevWatchValues([...watchValues]);
          }
    }

    const ValidateValues=(fromDate,noOfDays)=>{
     if(fromDate){
        if(noOfDays){
           const from= new Date(fromDate);
           const toDate=new Date(from)
           toDate.setDate(toDate.getDate()+parseInt(noOfDays,10)-1)
           setTodate(toDate.toISOString().split("T")[0])
           setDefaultValues({toDate:toDate.toISOString().split("T")[0]})
        }
     }
    }

    const onSubmit = async (values) => {
       console.log("va;",values)
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Leave Request"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    watchFields={["fromDate","noOfDays"]}
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


