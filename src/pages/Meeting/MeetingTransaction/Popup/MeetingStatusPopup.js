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
import classes from '../meeting.module.css';


const rowWiseFields = 1;

function MeetingStatusPopup(props) {


  const [selectedItem, setSelectedItem] = useState(props?.selectedItem)

  useEffect(() => { loadMeetingStatusPopup() }, []);

  async function loadMeetingStatusPopup() {
    const meetingTransactionId = props.selectedItem.meetingTransactionId;
    const obj = await post(api + `/meetingTransaction/getMeetingStatusById/${meetingTransactionId}`, { "id": Math.random() })
    if(response.ok)
       setSelectedItem(obj)
  }
  const { get, post, response, loading, error, put } = useFetch({ data: [] });

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
        type: "hidden",
        name: "meetingTransactionId",
        contains: "hidden",
        value: props.selectedItem.meetingTransactionId,
      },
     {
        title: "Meeting Status",
        type: "select",
        name: "meetingStatus",
        contains: "select",
        options: [
          { value: "Scheduled", label: "Scheduled" },
          { value: "Concluded", label: "Concluded" },
          { value: "Rescheduled", label: "Rescheduled" },
          { value: "Cancel", label: "Cancel" },
        ],
      },
      
      {
        title: "Date Of Meeting",
        type: "datetime",
        name: "dateOfMeeting",
        contains: "datetime",
        inpprops: {
          format: "dd/mm/yy hh:mm:ss",
        },
        validationProps: "DateOfMeeting Status is Required",
      },
      {
        title: "Reason",
        type: "text",
        name: "reason",
        contains: "text",

        validationProps: "Reason is Required",
      }
    ],
  };
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  async function onSubmit(values) {
    if (values.clicked === "Save") {
      const now = new Date();
      const MeetingTime = new Date(values.dateOfMeeting);
      if (MeetingTime > now) {
        const obj=await post(api+"/meetingTransaction/updateStatus",values);
        if(response.ok){
          props.tableData(obj);
          AlertHandler("Status Updated Successfully","success")
        }
      }
      else{
        AlertHandler("The meeting date and time cannot be in past.Please select the future Date", "danger")
        return;
      }
    }
    else{
      dispatch(modalActions.hideModalHandler())
    }
  }


  return (
    <div className={classes.container}>
      <Popupcard
        title="Meeting Status"

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={selectedItem}
          buttonName={props.selectedItem.meetingStatus === "Concluded" ? "Ok" : "Save"}

        ></CreateForm>

      </Popupcard>

    </div>
  );
}

export default MeetingStatusPopup;


