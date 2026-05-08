import React, { useCallback, useEffect, useState } from 'react'
import {
  Button, Col,
  CreateForm,
  Popupcard,
  Row,
  alertActions,
  api,
  SimpleCard,
  Table,
  SearchCard,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../Components/CommonImports/CommonImports';
import classes from '../meeting.module.css'
import TaskSubTypeTable from "../TaskSubType/Table/TaskSubTypeTable";
import TaskSubTypePopup from "../TaskSubType/Popup/TaskSubTypePopup";

const rowWiseFields = 3;
const TaskSubType = () => {

  const { get, post, response, loading, error, del } = useFetch({ data: [] });
  const [tableData, setTableData] = useState([])
  const [data, setData] = useState([{ value: "", label: "Select" }])

  useEffect(() => {
    loadInitialData();
  }, [])

  const loadInitialData = useCallback(async () => {
    const obj = await post(api + "/task/getAllTaskSubType", { "id": Math.random() })
    if (response.ok)
      setTableData([...obj]);
    const obj1 = await post(api + "/task/getAllTaskType", { "id": Math.random() })
    if (response.ok) {
      const formatedData1 = obj1.map(({ taskTypeId, taskType }) => ({
        value: taskTypeId,
        label: taskType,
      }))
      setData([...data,...formatedData1]);
    }
  }, [])

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

  const AddFunc = (createData) => {

    setTableData([...tableData, createData]);
    AlertHandler("Successfully Added", "success")
    dispatch(modalActions.hideModalHandler())

  }
  const EditFunc = (updatedData) => {

    const UpdatedTableData = tableData
      .map((inv) =>
        inv.taskSubTypeId === updatedData.taskSubTypeId
          ? updatedData
          : inv);
    setTableData(UpdatedTableData);
    AlertHandler("Successfully Edited", "success")
    dispatch(modalActions.hideModalHandler())
  }

  const showFormHandler = (item, action) => () => {
    if (action === "Add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <TaskSubTypePopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              tableData={AddFunc}
              data={data}
            />
          ),
          showModal: true,
        })
      );
    }
    else if (action === "Edit") {

      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <TaskSubTypePopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              data={data}
              tableData={EditFunc}
            />
          ),
          showModal: true,
        })
      );
    }
  }
  const template = {
    fields: [
      {
        title: "Task Type",
        type: "select",
        name: "taskTypeId",
        contains: "select",
        options: data,
        validationProps: "Task Type is Required",
        innprops: {}
      },
      {
        title: "Task SubType",
        type: "text",
        name: "taskSubType",
        contains: "text",
      },
      {
        title: "Status",
        type: "select",
        name: "status",
        contains: "select",
        options: [
          { value: "0", label: "Active" },
          { value: "1", label: "InActive" },
        ]
      },
    ]
  }

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  const searchDetails = async (values) => {
    values.taskSubType = values?.taskSubType ? values.taskSubType.trim() : "";
    if (values.clicked == "Search") {
      const returnObject = await post(api + "/task/taskSubType/search", values);
      
      if (returnObject.length > 0) {
        setTableData(returnObject);
      } else {
        setTableData([])
      }
    }
  }
  function onSubmit(values) {
    searchDetails(values);
  }
  return (
    <div className={classes.container}>
      <SearchCard
        title="Task SubType"
        buttonName="Add"
        onHeaderClick={showFormHandler({}, "Add")}
        bottonShow={showModal}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          buttonName="Search" />
      </SearchCard>
      <SimpleCard md={2}>
        <Table
          cols={TaskSubTypeTable(showFormHandler)}
          data={tableData}
          rows={10} />
      </SimpleCard>
    </div>
  )
}

export default TaskSubType
