import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Popupcard, PopupSimpleCard, Table, CreateForm, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider
} from "../../../../Components/CommonImports/CommonImports"
import classes from "../../OrgChart.module.css"

const rowWiseFields = 1;

function StatusForm(props) {


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
               ],
               validationProps:"Leave Type is Required"
            },
            {
                title:"Status",
                type:"select",
                name:"status",
                contains:"select",
                options:[
                 {value:"",label:"Select"},
                 {value:"InProgress",label:"InProgress"},
                 {value:"Approved",label:"Approved"},
                 {value:"Rejected",label:"Rejected"},
                ],
                 validationProps:"Status is Required"
             },
            {
                title: "Remarks",
                type: "text",
                name: "remarks",
                contains: "text",
                validationProps:"Remarks is Required",
                inpprops:{
                }
            },
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
        }

    const onSubmit = async (values) => {
       console.log("va;",values)
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Update Status"

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

export default StatusForm;


