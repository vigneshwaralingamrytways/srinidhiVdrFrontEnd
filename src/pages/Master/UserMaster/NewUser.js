import React, { useState, useEffect, useCallback } from 'react';
import {

  SearchCard,Popupcard,SimpleCard,PopupSimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm
  } from '../../../Components/CommonImports/CommonImports'


const rowWiseFields = 3;

function NewUser(props) {
const {roles} = props

    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [newroles,setNewRoles]=useState(roles);
    const [data,setData]=useState([])
    const [prevWatchValues, setPrevWatchValues] = useState([]);
    const [userType, setUserType] = useState("");
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


    const actions = ["Add","AddBooking","status","payment","document"];
    const showFormHandler = (item, action) => () => {
      console.log(action);
      
    };

   
  const template = {
    fields: [
      {
        title: "User Name",
        type: "text",
        name: "userName",
        contains: "text",
        inpprops: {
          minlength: 4,
          maxlength: 80,
        },
        validationProps:"User Name is Required"
      },
      {
        title: "Full Name",
        type: "text",
        name: "personName",
        contains: "text",
        inpprops: {
          minlength: 4,
          maxlength: 80,
        },
        validationProps:"Person Name is Required"
      },
      {
        title: "Password",
        type: "text",
        name: "password",
        contains: "password",
        inpprops: {
          minlength: 8,
          maxlength: 80,
        },
        validationProps:"Password is Required"
      },
     {
        title: "Department",
        type: "select",
        name: "departmentId",
        contains: "Select",
        options: props.depart,
      },
       /* {
        title: 'Machine',
        type: 'select',
        name: 'machineName',
        contains: 'Select',
        options: [
          { value: '', label: 'Select' },
          { value: 'PM 1', label: 'PM 1' },
          { value: 'PM 2', label: 'PM 2' },
          { value: '3', label: 'PM 3' },
          { value: '4', label: 'PM 4' },
          { value: '5', label: 'PM 5' },
        ]
      }, */
      {
        title: "Email",
        type: "text",
        name: "email",
        contains: "email",
        inpprops: {
          maxlength: 80,
        },
        validationProps:"Please Provide Valid Email Id"
      },
      {
        title: "Mobile No",
        type: "text",
        name: "phoneNo",
        contains: "text",
        inpprops: {
          minlength: 10,
          maxlength: 10,
        },
      },
    
      {
        title: 'Type',
        type: 'select',
        name: 'userType',
        contains: 'Select',
        options: [
          { value: 'Internal', label: 'Internal' },
          { value: 'ClientUser', label: 'External' },
        
        ]
      },

      {
        title: "Role",
        type: "select",
        name: "roleId",
        contains: "Select",
        options: newroles,
        validationProps:"Role is Required"
      },
    /* ...(userType === "Dealer" ? [
      {
        title: "Dealer Name",
        type: "select",
        name: "dealerId",
        contains: "Select",
        options: props.direct
      },] :[]),  */
      // {
      //   title: "Unit",
      //   type: "text",
      //   name: "machineName",
      //   contains: "text",
      //   inpprops: {
         
      //   },
      // },
      {
        type: "hidden",
        name: "userId",
        contains: "text",
        inpprops: {
         
        },
      },

      
    ],
  };

  const validateValues = async (userType, param2) => {
    if (userType){
      setUserType(userType)
      if(userType === "Dealer"){
        setNewRoles([{ value: 13, label: "ROLE_CLIENT" }])
      }
      else {
       setNewRoles(roles)
      
    }

  }

}
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
      validateValues(watchValues[0]);
   //   setUserType(watchValues[0])
      setPrevWatchValues([...watchValues]);
    }
  }
    async function onSubmit(values) {
     /*  const { userName, personName, departsId, machineName, email, phoneNo, roleId, userId } = values;
      const dataToSubmit = {
          userName,
          personName,
          departsId,
          machineName,
          email,
          phoneNo,
          roleId,
          userId
      };
      console.log("dataToSubmit", dataToSubmit); */
        props.customerSave({...values});
      console.log("values",values)
      }
    

    return (
        <div className={classes.container}>
            <Popupcard
                title={props?.selectedItem?.userId ? "Edit User Details":"Add User Details"} 

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    watchFields={["userType"]}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props.selectedItem}
                    buttonName="Save"

                ></CreateForm>


            </Popupcard>

        </div>
    );
}

export default NewUser;


