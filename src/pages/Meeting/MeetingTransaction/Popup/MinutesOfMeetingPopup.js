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
} from '../../../../Components/CommonImports/CommonImports';
import classes from '../meeting.module.css';
import MinutesOfMeetingTable from '../Table/MinutesOfMeetingTable';
import TaskPopup from '../../Task/Popup/TaskPopup';

const rowWiseFields = 2;
const rowWiseFields1 = 1;
function MinutesOfMeetingPopup(props) {

  const [data, setData] = useState([])
  const [defaultValues, setDefaultValues] = useState({})
  const [title, setTitle] = useState([])
  const { get, post, response, loading, error, del, put } = useFetch({ data: [] });
  const [enableEdit, setEnableEdit] = useState(false)
  useEffect(() => {
    loadInitialData();
  }, [])


  async function loadInitialData() {
    const meetingTransactionId = props.selectedItem.meetingTransactionId;
    const obj = await post(api + `/meetingTransaction/minutesOfMeeting/getAllMinutesOfMeeting/${meetingTransactionId}`, { "id": Math.random() });
    if (response.ok)
      setData([...obj]);
    const obj1 = await post(api + '/form-config/taskType/getAllForms', { "id": Math.random() })
    if (response.ok)
      setTitle([...obj1])
  }

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
        title: "Minutes Of Meeting",
        type: "text",
        name: "minuteOfMeeting",
        contains: "text",
        // validationProps: "MinutesOfMeeting is Required",
      },
      {
        title: "CheckItIsTask",
        type: "select",
        name: "checkItIsTask",
        contains: "select",
        options: [
          { value: "ItIsTask", label: "ItIsTask" },
          { value: "ItIsNotTask", label: "ItIsNotTask" },
        ]
      }
    ],
  };
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;

  }


  const showFormHandler1 = (item, action) => () => {
    if (action === "showPopup") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '50%',
          modalLeft: '25%',
          selectedForm: (
            <TaskPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              taskType={props.taskType}
              taskSubType={props.taskSubType}
              users={props.users}
              title={title}
            />
          ),
          showModal: true,
        })
      );
    }
    else if (action === "Edit") {

      if (props.selectedItem.meetingStatus !== "Concluded") {
        setEnableEdit(true)
        setDefaultValues({ ...item })
      }
      else {
        AlertHandler("You Cannot Edit", "Danger")
      }
    }
    else if (action === "Delete") {
      const isConfirmed = window.confirm("Confirm Delete");
      if (isConfirmed) {
        const UpdatedTableData = data
          .filter((inv) => inv.minutesId !== item.minutesId);
        DeleteData(item.minutesId);
        setData(UpdatedTableData);

      }
    }
  };

  async function DeleteData(minutesId) {
    const obj = await del(api + `/meetingTransaction/minutesOfMeeting/deleteById/${minutesId}`)
  }

  async function onSubmit(values) {
    values.meetingTransactionId = props.selectedItem.meetingTransactionId;

    if (values.clicked === "mail") {
      const meetingTransactionId = values.meetingTransactionId;
      const mailObj = await post(api + `/meetingTransaction/sendMail/toParticipants/${meetingTransactionId}`, data);
      if (response.ok) {
        AlertHandler("Mail Sented Successfully", "success")
      }
    }
    else if (values.clicked === "Add") {
      const retObj = await post(api + "/meetingTransaction/minutesOfMeeting/create", values)
      if (response.ok) {
        setData([...data, retObj]);
        AlertHandler("Successfully Saved", "success")
      }
    }

    else if (values.clicked == "Save") {
      const updatedData = data.map((item) => item.minutesId === values.minutesId ? { ...item, ...values } : item);
      const minutesId = values.minutesId;
      const obj = await put(api + `/meetingTransaction/updateMinutesOfMeeting/${minutesId}`, values)
      if (response.ok) {
        setData(updatedData);
        AlertHandler("Successfully Updated", "success")
      }
    }
  }


  return (
    <div className={classes.container}>
      <Popupcard
        title="Minutes Of Meeting"

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={defaultValues}
          buttonName=""
          btButtons={props?.selectedItem?.meetingStatus!="Concluded"?
            <Row className="">
              <Col md={3}></Col>

              < Col className="d-flex justify-content-end">
                <Button type="submit" name="mail" variant="secondary" className={classes.btn} style={{ textAlign: "left" }}>
                  Send Mail
                </Button>
                <Button type="submit" name={props.selectedItem.meetingStatus === "Concluded" ? "Ok" : enableEdit ? "Save" : "Add"} variant="primary" className={classes.btn}>
                  {props.selectedItem.meetingStatus === "Concluded" ? "Ok" : enableEdit ? "Save" : "Add"}
                </Button>

                <Button variant="danger" className={classes.btn} onClick={props.onCancel}>
                  cancel
                </Button>
              </Col>
            </Row>:""
          } >
        </CreateForm>
        <PopupSimpleCard md={6}>
          <Table cols={MinutesOfMeetingTable(showFormHandler1,data)}
            data={data} striped
          />
        </PopupSimpleCard>

      </Popupcard>

    </div>
  );
}

export default MinutesOfMeetingPopup;


