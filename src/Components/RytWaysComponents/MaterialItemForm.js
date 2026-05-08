import React, { useState, useEffect, useCallback } from 'react';



import {

  Popupcard,SearchCard,SimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm, PopupSimpleCard
  } from '../../Components/CommonImports/CommonImports'

import MaterialItemTable from './Table/MaterialItemTable';



const rowWiseFields = 2;


function MaterialItemForm(props) {


 const {orderItems, defvalues} = props;
 const[data,setData]=useState([
  
 ])
    const { get, post, response, loading, error } = useFetch({ data: [] });
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


    const actions = ["Status"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
   
      
  };
  

  const template = {
    fields: [
    
      {
        title: "Item name",
        type: "text",
        name: "itemname",
        contains: "text",
        inpprops:{
            md:8

        }
      },
      {
        title: "Quantity",
        type: "text",
        name: "quantity",
        contains: "text",
      //  validationProps: "projectDescribtion is required",
        inpprops: {
            md:4
          
        },
    },
    ],
  };
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

 
      function onSubmit(values) {
        // Include RegionName and unitName in the status data

        props.orderSave({
            id: values.id,
            orderStatusId: values.orderStatusId,
            remarks: values.remarks,
              },"status");
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Material Item"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={defvalues}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>
     <PopupSimpleCard >
   
   <Table cols={MaterialItemTable(showFormHandler, actions)}
             data={data} 
             striped
            
              /> 
         </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default MaterialItemForm;


