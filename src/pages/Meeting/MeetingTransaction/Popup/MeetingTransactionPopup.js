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
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../../Components/CommonImports/CommonImports';
import classes from "../meeting.module.css";



const rowWiseFields = 1;

function MeetingTransactionPopup(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });
  const credentials = localStorage.getItem("userName")
  const roleId = localStorage.getItem("roleId")
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
          md: 12,
        },
      },
      ...(props?.selectedItem?.meetingTransactionId ?
        [] : [
          roleId ==1 ? {
            title: "Hosted By",
            type: "select",
            name: "hostedBy",
            contains: "select",
            options: props.users,
            validationProps: "Hosted By is Required",
          } : {
            title: "Hosted By",
            type: "disabled",
            name: "hostedBy",
            contains: "text",
            value: credentials,
          },
        ]),
    ],
  };
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  async function onSubmit(values) {

    const now = new Date();
    const meetingTime = new Date(values.dateOfMeeting);
    if (meetingTime > now) {
      values.hostedBy = typeof values.hostedBy === "undefined" ? parseInt(localStorage.getItem("userId")) : values.hostedBy;
      const obj = await post(api + "/meetingTransaction/create", values);
      if (response.ok) {
        props.tableData(obj);
        if (props?.selectedItem?.meetingTransactionId) {
          AlertHandler("Successfully Edited Meeting", "success")
        }
        else
          AlertHandler("Successfully Created Meeting", "success")
      }
      else {
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Failed to Create Meeting", "success")
      }
    } else {
      AlertHandler("The meeting date and time cannot be in past.Please select the future Date", "danger")
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
          defaultValues={props?.selectedItem?.meetingTransactionId ? props.selectedItem : {}}
          buttonName={props?.selectedItem?.meetingTransactionId ? "Save" : "Add"}

        ></CreateForm>


      </Popupcard>

    </div>
  );
}

export default MeetingTransactionPopup;


