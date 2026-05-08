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
import classes from './meeting.module.css';
import TaskPopup from './Popup/TaskPopup';
import TaskTable from './Table/TaskTable';
import StatusPopup from './Popup/StatusPopup';
import AssignedToPopup from './Popup/AssignedToPopup';
import Comments from './Popup/Comments';
import FileUploadForm from './Popup/FileUploadForm';

const rowWiseFields = 3;
const TaskSearch = () => {

  const { get, post, response, loading, error, del } = useFetch({ data: [] });
  const [data, setData] = useState([])
  const roleId = parseInt(localStorage.getItem('roleId'));
  const userId = parseInt(localStorage.getItem("userId"))
  const userName = localStorage.getItem("userName");
  const [template, setTemplate] = useState({ fields: [] })
  const [docAcces, setDocAccess] = useState("");
  const [users, setUsers] = useState([{ value: "", label: "Select" }])
  const [taskType, setTaskType] = useState([{ value: "", label: "Select" }])
  const [clientName, setClientName] = useState([{ value: "", label: "Select" }])
  const [taskSubType, setTaskSubType] = useState([{ value: "", label: "Select" }])
  const [prevWatchValues, setPrevWatchValues] = useState([])
  const [title, setTitle] = useState([])
  const [assigned, setAssigned] = useState([])
  const [tableTitles, setTableTitles] = useState({})
  const [filteredTaskSubType, setFilteredTaskSubType] = useState([{ value: "", label: "Select" }])

  useEffect(() => {
    loadInitialData();
  }, [])

  async function loadInitialData() {
    // if (roleId != 1) {
    //   const obj2 = await post(api + `/task/getAllAssignedByUserId/${userId}`, { "id": Math.random() });
    //   console.log("obj2", obj2)
    //   if (response.ok) {
    //     const formatedData1 = obj2.map(({ owner, user: { personName } }) => ({
    //       value: owner,
    //       label: personName,
    //     }))
    //     const mergeData=[...users, ...formatedData1];
    //     const uniqueData=Array.from(new Map(mergeData.map(item=>[item.value,item])).values())
    //      setUsers(uniqueData);
    //   }
    // }
    const obj13 = await post(api + `/task/getAllAssignedByUserId/${userId}`, { "id": Math.random() });
    if (response.ok) {
      setAssigned([...obj13])
    }

    const obj2 = await get(api + "/users/users");
    if (response.ok) {
      const formatedData1 = obj2.map(({ userId, personName }) => ({
        value: userId,
        label: personName,
      }))
      setUsers([...users, ...formatedData1])
    }

    const obj22 = await post(api + "/clientMaster/getAllClients");
    if (response.ok) {
      const formatedData1 = obj22.map(({ clientId, clientName }) => ({
        value: clientId,
        label: clientName,
      }))
      setClientName([...clientName, ...formatedData1])
    }

    const obj3 = await post(api + "/task/getAllTaskType", { "id": Math.random() });
    if (response.ok) {
      const formatedData3 = obj3.map(({ taskTypeId, taskType }) => ({
        value: taskTypeId,
        label: taskType,
      }));
      setTaskType([...taskType, ...formatedData3])
    }
    const obj4 = await post(api + "/task/getAllTaskSubType", { "id": Math.random() })
    if (response.ok) {
      const formatedData4 = obj4.map(({ taskSubTypeId, taskSubType }) => ({
        value: taskSubTypeId,
        label: taskSubType,
      }))
      setTaskSubType([...taskSubType, ...formatedData4])
    }

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

  const AddFunc = (createNewData) => {
    setData([...data, createNewData]);
    dispatch(modalActions.hideModalHandler())
  }

  const EditFunc = (updatedData) => {

    const UpdatedTableData = data
      .map((inv) =>
        inv.taskId === updatedData.taskId
          ? updatedData
          : inv);
    setData(UpdatedTableData);
    dispatch(modalActions.hideModalHandler())
  }

  const showFormHandler = (item, action) => () => {
    if (action === "Edit") {
      const taskSubTypeId = taskSubType.filter(p => p.value == item.taskSubTypeId);
      item.taskSubTypeId = taskSubTypeId[0].value;

      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '50%',
          modalLeft: '25%',
          selectedForm: (
            <TaskPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              tableData={EditFunc}
              title={title}
              taskType={taskType}
              template={template}
              taskSubType={taskSubType}
              users={users}
              clientName={clientName}
            />
          ),
          showModal: true,
        })
      );
    }
    else if (action === "comment") {
      dispatch(
        modalActions.showModalHandler({
          modalWidth: '35%',
          modalLeft: '33%',
          selectedForm: (
            <Comments
              onCancel={() => dispatch(modalActions.hideModalHandler())}
            />
          ),
          showModal: true,
        })
      );
    }
    else if (action === "upload") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <FileUploadForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              listapi={"/documentTransaction/getListByTransacId"}
              deleteApi={"/documentTransaction/delete"}
              selectedItem={{ ...item }}
              popClass={true}
              docAcces={docAcces}

            />
          ),
          showModal: true,
        })
      );
    }
    else {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '50%',
          modalLeft: '25%',
          selectedForm: (
            <TaskPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              tableData={AddFunc}
              title={title}
              template={template}
              taskType={taskType}
              taskSubType={taskSubType}
              users={users}
              clientName={clientName}
            />
          ),
          showModal: true,
        })
      );
    }
  };

  const showFormHandler1 = (item, action) => () => {
    dispatch(
      modalActions.showModalHandler({
        selectedData: { ...item },
        modalWidth: '25%',
        modalLeft: '37%',
        selectedForm: (
          <StatusPopup
            onCancel={() => dispatch(modalActions.hideModalHandler())}
            selectedItem={{ ...item }}
            tableData={EditFunc}
          />
        ),
        showModal: true,
      })
    );
  };

  const showFormHandler2 = (item, action) => () => {
    dispatch(
      modalActions.showModalHandler({
        selectedData: { ...item },
        modalWidth: '35%',
        modalLeft: '30%',
        selectedForm: (
          <AssignedToPopup
            onCancel={() => dispatch(modalActions.hideModalHandler())}
            selectedItem={{ ...item }}
            users={users}
          />
        ),
        showModal: true,
      })
    );
  };




  const searchTemplate = {
    fields: [
      {
        title: " From Date",
        type: "date",
        name: "fromDate",
        contains: "date",
        inpprops: {
          format: "dd/mm/yy",
        },
        // validationProps: "From Date is Required",
      },
      {
        title: " To Date",
        type: "date",
        name: "toDate",
        contains: "date",
        inpprops: {
          format: "dd/mm/yy",
        },
      },
      {
        title: "Task Type",
        type: "select",
        name: "taskTypeId",
        contains: "select",
        options: taskType,
        validationProps: "Task Type is Required",
      },
      {
        title: "Task SubType",
        type: "select",
        name: "taskSubTypeId",
        contains: "select",
        options: filteredTaskSubType,
      },
      {
        title: "AssignedTo",
        type: "select",
        name: "owner",
        contains: "select",
        options: users,
      },
      {
        title: "Status",
        type: "select",
        name: "status",
        contains: "select",
        options: [
          {value:"",label:"Select"},
          { value: "YetToStart", label: "YetToStart" },
          { value: "InProgress", label: "InProgress" },
          { value: "Completed", label: "Completed" },
          { value: "Cancel", label: "Cancel" },
        ],
      },
    ]
  }

  async function ValidateValues(taskType) {
    const taskTypeId = parseInt(taskType, 10);
    const obj = await post(api + `/task/getAllTaskSubTypeByTaskId/${taskTypeId}`, { "id": Math.random() })
    const formatedData4 = obj.map(({ taskSubTypeId, taskSubType }) => ({
      value: taskSubTypeId,
      label: taskSubType,
    }))

    setFilteredTaskSubType([{ values: "", label: "Select" }, ...formatedData4])
    handleDocumentType(taskTypeId);
  }

  const handleDocumentType = (taskTypeId) => {

    const selectedDocument = title.find(doc => doc.taskTypeId == taskTypeId);
    setTableTitles(selectedDocument);
    if (selectedDocument) {
      const fields = [
        { title: selectedDocument.itemOne, type: "text", name: "itemOne", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemTwo, type: "text", name: "itemTwo", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemThree, type: "text", name: "itemThree", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemFour, type: "text", name: "itemFour", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemFive, type: "text", name: "itemFive", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemSix, type: "text", name: "itemSix", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemSeven, type: "text", name: "itemSeven", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemEight, type: "text", name: "itemEight", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemNine, type: "text", name: "itemNine", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemTen, type: "text", name: "itemTen", contains: "text", validationProps: "Value is required", inpprops: {} }, {
          title: selectedDocument.itemEleven,
          type: "text",
          name: "itemEleven",
          contains: "text",
          inpprops: {
            // md:4,itemSixitemSix itemEleven
          },
        }, {
          title: selectedDocument.itemTwelve,
          type: "text",
          name: "itemTwelve",
          contains: "text",
          inpprops: {
            // md:4, 
          },
        }, {
          title: selectedDocument.itemThirteen,
          type: "text",
          name: "itemThirteen",
          contains: "text",
          inpprops: {
            // md:4,itemThirteen
          },
        }, {
          title: selectedDocument.itemFourteen,
          type: "text",
          name: "itemFourteen",
          contains: "text",
          inpprops: {
            // md:4, itemFourteen
          },
        }, {
          title: selectedDocument.itemFifteen,
          type: "text",
          name: "itemFifteen",
          contains: "text",
          inpprops: {
            // md:4,  itemFifteen
          },
        },
        {
          title: selectedDocument.itemSixteen,
          type: "date",
          name: "itemSixteen",
          contains: "date",
          inpprops: {
            // md:4, itemFourteen
          },
        }, {
          title: selectedDocument.itemSeventeen,
          type: "date",
          name: "itemSeventeen",
          contains: "date",
          inpprops: {
            // md:4,  itemFifteen
          },
        },
      ];
    }
  };

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
      ValidateValues(watchValues[0])
      setPrevWatchValues([...watchValues]);
    }

  }
  const searchDetails = async (values) => {
    if (values.clicked == "Search") {
      const returnObject = await post(api + "/task/search", values);
      if (returnObject.length > 0) {
        if (roleId != 1) {
          const filteredData = returnObject.filter(p => p.createBy == userId && p.taskTypeId == values.taskTypeId && p.owner == values.owner);
          const ownerby = returnObject.filter(p => p.owner == userId && p.taskTypeId == values.taskTypeId && p.owner == values.owner);
          const newAssigned = assigned.filter(p => p.taskTypeId == values.taskTypeId && (values.owner == "" || p.owner == values.owner))
          const mergeData = [...filteredData, ...ownerby, ...newAssigned];
          const uniqueData = Array.from(new Map(mergeData.map(item => [item.value, item])).values())
          setData(uniqueData)
        } else
          setData([...returnObject]);
      } else {
        setData([])
      }
    }
  }
  function onSubmit(values) {
    if (new Date(values.fromDate) >= new Date(values.toDate)) {
      AlertHandler("Please select a valid Date Range", "danger");
      return;
    }
    const oneYearLater = new Date(values.fromDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    if (oneYearLater < new Date(values.toDate)) {
      AlertHandler("Date range should not exceed 1 year", "danger")
      return;
    }
    searchDetails(values);
  }


  return (
    <div className={classes.container}>
      <SearchCard
        title="Task"
        buttonName="Add"
        onHeaderClick={showFormHandler({}, "Add")}
        bottonShow={showModal}
      >
        <CreateForm

          template={searchTemplate}
          rowwise={rowWiseFields}
          watchFields={['taskTypeId']}
          validate={validate}
          onSubmit={onSubmit}
          buttonName="Search">

        </CreateForm>
      </SearchCard>
      <SimpleCard md={7}>
        <Table
          cols={TaskTable(showFormHandler1, showFormHandler2, showFormHandler, tableTitles)}
          data={data}
          rows={10} />
      </SimpleCard>
    </div>
  )
}

export default TaskSearch
