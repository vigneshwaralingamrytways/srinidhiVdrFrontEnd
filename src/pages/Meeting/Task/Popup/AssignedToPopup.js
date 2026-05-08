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
import AssignedToTable from '../Table/AssignedToTable';

const rowWiseFields = 1;
function AssignedToPopup(props) {

  const { get, post, response, loading, error, del, put } = useFetch({ data: [] });
  const [data, setData] = useState([])
  const [defaultValues, setDefaultValues] = useState({})
  const [enableEdit, setEnableEdit] = useState(false)

  useEffect(() => {
    loadInitialData();
  }, [])

  async function loadInitialData() {
    const taskId = props.selectedItem.taskId;
    const obj = await post(api + `/task/getAllAssigned/${taskId}`, { "id": Math.random() });
    if (response.ok)
      setData([...obj]);
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
        title: "User",
        type: "select",
        name: "user",
        contains: "select",
        options: props.users,
      },
      {
        title: "User Type",
        type: "select",
        name: "userType",
        contains: "select",
        options: [

          { value: "Primary", label: "Primary" },
          { value: "Secondary", label: "Secondary" },
        ]
      },
    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }
  async function onSubmit(values) {
    values.taskId = props.selectedItem.taskId;
    const obj = await post(api + "/task/createUsers", values);
    if (response.ok) {
      if (values.assignedToTaskId) {
        const UpdatedTableData = data.map((p) => p.assignedToTaskId == obj.assignedToTaskId ? obj : data)
        setData(UpdatedTableData);
        AlertHandler("Successfully Edited", "success")
      }
      else {
        setData([...data, obj]);
        AlertHandler("Successfully Added", "success")
      }
    }
  }

  const showFormHandler1 = (item, action) => () => {

    if (action === "Edit") {
      setEnableEdit(true)
      setDefaultValues({ ...item })
    }
    else if (action === "Delete") {
      if (data.length > 1) {
        const allow = window.confirm("Confirm Delete")
        if (allow) {
          const updatedData = data.filter(prev => prev.assignedToTaskId !== item.assignedToTaskId)
          const deleted = data.filter(prev => prev.assignedToTaskId === item.assignedToTaskId)
          DeleteRow(deleted[0].assignedToTaskId)
          setData(updatedData)
          AlertHandler("Successfully Delete", "success")

        }
      }
      else {
        AlertHandler("You Cannot Delete. Atleast One Data is Available", "danger")
      }
    }
  }
  async function DeleteRow(assignedToTaskId) {
    const obj = await del(api + `/task/deleteAssigned/${assignedToTaskId}`)
  }
  return (
    <div className={classes.container}>
      <Popupcard
        title="Assigned To"

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={defaultValues}
          buttonName={props?.selectedItem?.status!="Completed"? (enableEdit ? "Submit" : "Save"):""}

        ></CreateForm>
        <PopupSimpleCard md={6}>
          <Table cols={AssignedToTable(showFormHandler1,data)}
            data={data} striped
          />
        </PopupSimpleCard>
      </Popupcard>

    </div>
  );
}

export default AssignedToPopup;


