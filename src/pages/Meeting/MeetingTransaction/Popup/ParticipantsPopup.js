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
import ParticipantsTable from "../Table/ParticipantsTable";


const rowWiseFields = 3;
const rowWiseFields1 = 1;
function ParticipantsPopup(props) {


  const { get, post, response, loading, error, del, put } = useFetch({ data: [] });

  const [data, setData] = useState([])
  const [enableEdit, setEnableEdit] = useState(false)
  const [defaultValues, setDefaultValues] = useState({})
  const [users,setUsers]=useState([{value:"",label:"Select"}])
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    const meetingTransactionId = props.selectedItem.meetingTransactionId
    const obj = await post(api + `/meetingTransaction/getAllParticipants/${meetingTransactionId}`, { "id": Math.random() });
    if (response.ok) {
      setData([...obj]);
    }
    const obj2 = await get(api + "/users/users");
    if (response.ok) {
      const formatedData1 = obj2.map(({ personName }) => ({
        value: personName,
        label: personName,
      }))
      setUsers([...users, ...formatedData1])
    }
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
        title: "Participants",
        type: "select",
        name: "participants",
        contains: "select",
        options: users,
      },
      {
        title: "Participant Name",
        type: "text",
        name: "participantName",
        contains: "text",
      },
     {
        title: "Participant Email",
        type: "text",
        name: "participantEmailId",
        contains: "text",
        validationProps: "Participant Email is Required",
      }

    ],
  }

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  async function DeleteData(participantsId) {
    const obj = await del(api + `/meetingTransaction/deleteParticipantsById/${participantsId}`)
  }

  const showFormHandler = (item, action) => () => {

    if (action === "Edit") {
      if (props.selectedItem.meetingStatus !== "Concluded") {
        setEnableEdit(true)
        setDefaultValues({ ...item })
      } else {
        AlertHandler("You Cannot Edit Participants", "danger")
      }
    }
    else if (action === "Delete") {
      const isConfirmed = window.confirm("Confirm Delete");
      if (isConfirmed) {
        const UpdatedTableData = data
          .filter((inv) => inv.participantsId !== item.participantsId);
        const deleteData = data
          .filter((inv) => inv.participantsId === item.participantsId);
        DeleteData(item.participantsId);
        setData(UpdatedTableData);
        AlertHandler("Successfully Deleted", "success")

      }
    }
  };

  const EditFunc = (updatedData) => {
    const UpdatedTableData = data
      .map((inv) =>
        inv.participantsId === updatedData.participantsId
          ? updatedData
          : inv);
    console.log("UpdatedData invoice", UpdatedTableData)
    setData(UpdatedTableData);

  }

  async function onSubmit(values) {

    if (values.clicked === "Add") {
      const checkparticipantname = values.participants === "" ? values.participantName : values.participants;
      values.participantName = checkparticipantname;
      values.meetingTransactionId = props.selectedItem.meetingTransactionId;
      const obj = await post(api + "/meetingTransaction/createParticipants", values);
      if(response.ok){
      setData([...data, obj]);
      AlertHandler("successfully Added", "success")
      }
    }
    else if (values.clicked === "Save") {
      values.meetingTransactionId = props.selectedItem.meetingTransactionId;
      const participantsId = values.participantsId;
      const obj = await put(api + `/meetingTransaction/updateParticipants/${participantsId}`, values);
      if(response.ok){
      EditFunc(obj)
      AlertHandler("Successfully Updated", "success")
      }
    }
    else {
      AlertHandler("You Cannot Add participants", "danger")
    }
  }


  return (
    <div className={classes.container}>
      <Popupcard
        title="Participants"

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={defaultValues}
          buttonName={props.selectedItem.meetingStatus !== "Concluded" ?  (enableEdit ? "Save" : "Add"):""}

        ></CreateForm>
        <PopupSimpleCard md={6}>
          <Table cols={ParticipantsTable(showFormHandler,data)}
            data={data}
          />
        </PopupSimpleCard>

      </Popupcard>

    </div>
  );
}

export default ParticipantsPopup;


