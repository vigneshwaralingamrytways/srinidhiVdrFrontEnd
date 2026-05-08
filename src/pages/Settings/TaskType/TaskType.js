import React, { useCallback, useEffect, useState } from 'react'
import {
  CreateForm,
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
import TaskTypeTable from './Table/TaskTypeTable';
import TaskTypePopup from './Popup/TaskTypePopup';
import FormConfig from './Popup/FormConfig';


const rowWiseFields = 3;
const TaskType = () => {

  const { get, post, response, loading, error, del } = useFetch({ data: [] });
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    loadInitialData();
  }, [])

  const loadInitialData = useCallback(async () => {

    const obj = await post(api + "/task/getAllTaskType", { "id": Math.random() });
    if (response.ok)
      setTableData([...obj]);

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
    dispatch(modalActions.hideModalHandler());

  }
  const EditFunc = (updatedData) => {

    const UpdatedTableData = tableData
      .map((inv) =>
        inv.taskTypeId === updatedData.taskTypeId
          ? updatedData
          : inv);
    setTableData(UpdatedTableData);
    AlertHandler("Successfully Edited", "success")
    dispatch(modalActions.hideModalHandler());

  }
  const showFormHandler = (item, action) => () => {
    
    if (action === "Add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <TaskTypePopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              tableData={AddFunc}
            />
          ),
          showModal: true,
        })
      );
    }
    if (action === "FormConfig") {

      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <FormConfig
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
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
            <TaskTypePopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
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
        type: "text",
        name: "taskType",
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
    values.taskType = values.taskType ? values.taskType.trim() : "";
    if (values.clicked == "Search") {
      const returnObject = await post(api + "/task/taskType/search", values);
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
        title="Task Type"
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
          cols={TaskTypeTable(showFormHandler)}
          data={tableData}
          rows={10} />
      </SimpleCard>
    </div>
  )
}

export default TaskType
