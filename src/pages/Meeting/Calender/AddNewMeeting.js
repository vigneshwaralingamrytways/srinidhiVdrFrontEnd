import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, Col,
  CreateForm,
  Popupcard,
  Row,
  Table,
  alertActions,
  api,
  SimpleCard,
  SearchCard,
  PopupSimpleCard,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../Components/CommonImports/CommonImports';
import classes from './calendar.module.css'



const rowWiseFields = 2;

function AddNewMeeting(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });
  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);
  const credentials = localStorage.getItem('userName');
  const roleId = parseInt(localStorage.getItem("roleId"))
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

  const showFormHandler = (item, action) => () => { };

  const template = {
    fields: [
      {
        title: "Date Of Meeting",
        type: "datetime",
        name: "dateOfMeeting",
        contains: "datetime",
        inpprops: {
          format: "dd/mm/yy HH:mm:ss",
        },
        validationProps: "DateOfMeeting is Required",
      },
      {
        title: "Meeting Category",
        type: "select",
        name: "meetingGroupId",
        contains: "select",
        options: props.data,
        validationProps: "Meeting Category is Required",
      },
      {
        title: "Meeting Mode",
        type: "select",
        name: "meetingMode",
        contains: "select",
        options: [

          { value: "Online", label: "Online" },
          { value: "Offline", label: "Offline" },
        ]
      },
      {
        title: "Agenda",
        type: "text",
        name: "ajenta",
        contains: "text",
        validationProps: "Agenda is Required",
      },
      {
        title: 'Invite Message',
        type: 'textarea',
        name: 'meetingInviteMessage',
        contains: "textarea",
        validationProps: "Invite Message is Required",
        inpprops: {
          maxlength: 250,
          md: 6,
        },
      },
      ...(props?.mId ?
        [] :
        [
          (roleId == 1 ? ({
            title: "Hosted By",
            type: "select",
            name: "hostedBy",
            contains: "select",
            options: props.users,
          }) : ({
            title: "Hosted By",
            type: "disabled",
            name: "hostedBy",
            contains: "text",
            value: credentials,
            inpprops: {},
          }))
        ]),
    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  async function onSubmit(values) {
    if(props?.mId){
      values.meetingTransactionId=props.mId;
    }
    const now = new Date();
    const meetingTime = new Date(values.dateOfMeeting);
    if (meetingTime > now) {
      values.hostedBy = typeof values.hostedBy === "undefined" ? parseInt(localStorage.getItem("userId")) : values.hostedBy;
      const obj = await post(api + "/meetingTransaction/create", values);
      if (response.ok) {
        const [date, time] = values.dateOfMeeting.split('T');
        const newObj = {
          id: obj.meetingTransactionId,
          label: obj.category.meetingCategory,
          meetingCategory: obj.category.meetingCategory,
          dateOfMeeting: values.dateOfMeeting,
          meetingMode: values.meetingMode,
          ajenta: values.ajenta,
          meetingInviteMessage: values.meetingInviteMessage,
          meetingStatus: obj.meetingStatus,
          meetingGroupId: obj.meetingGroupId,
          date: date,
          startHour: time,
          createdBy: values.hostedBy,
          createdAt: new Date(),
        }
        props.tableData(newObj)
        if(props?.mId){
          dispatch(modalActions.hideModalHandler())
        AlertHandler("Successfully Edited Meeting", "success")
      }
       else{
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Successfully created Meeting", "success")
       }
      }
      else {
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Failed to Create Meeting", "danger")
      }
    }
    else {
      AlertHandler("Invalid Date Of Meeting", "danger")
    }
  }


  return (
    <div className={classes.container}>
      <Popupcard
        title={props?.selectedItem?.meetingTransactionId ? "Edit Meeting" : "Add Meeting"}

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={props?.selectedItem ? props.selectedItem : {}}
          buttonName={props?.selectedItem?.meetingTransactionId ? "Save" : "Add"}

        ></CreateForm>


      </Popupcard>

    </div>
  );
}

export default AddNewMeeting;


