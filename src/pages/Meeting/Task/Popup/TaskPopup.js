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

const rowWiseFields = 2;

function TaskPopup(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });
  const [prevWatchValues, setPrevWatchValues] = useState([])
  const filteredTaskSub=[{value:"",label:"Select"},
    ...(props?.selectedItem?.taskSubTypeId ? [{value:props?.selectedItem?.taskSubTypeId,label:props?.selectedItem?.taskSubTypeClass?.taskSubType}]:[])
  ]
  const [filteredTaskSubType, setFilteredTaskSubType] = useState(filteredTaskSub)
  const credentials = localStorage.getItem("userName")
  const roleId = parseInt(localStorage.getItem("roleId"));
  const [taskTypeId, setTaskTypeId] = useState(0)

  const temp = [
    {
      title: "Start Date",
      type: "date",
      name: "startDate",
      contains: "date",
      inpprops: {
        format: "dd/mm/yy",
      },
      validationProps: "Start Date is Required",
    },
    {
      title: "Client Name",
      type: "select",
      name: "clientId",
      contains: "select",
      options: props.clientName,
      validationProps: "Client Name is Required",
    },
    {
      title: "Task Type",
      type: "select",
      name: "taskTypeId",
      contains: "select",
      options: props.taskType,
      validationProps: "Task Type is Required",
    },
    {
      title: "Task SubType",
      type: "select",
      name: "taskSubTypeId",
      contains: "select",
      options: filteredTaskSubType,
      inpprops: {},
      validationProps: "Task SubType is Required",
    },
    {
      title: "Description",
      type: "text",
      name: "description",
      contains: "text",
      validationProps: "Description is Required",
    },
    {
      title: " Exp End Date",
      type: "date",
      name: "expectedEndDate",
      contains: "date",
      inpprops: {
        format: "dd/mm/yy",
      },
      validationProps: "ExpEnDate is Required",
    },
    props?.selectedItem?.taskId && {
      title: " Actual End Date",
      type: "date",
      name: "actualEndDate",
      contains: "date",
      inpprops: {
        format: "dd/mm/yy",
      },
    },
    roleId == 1 ? {
      title: "Created By",
      type: "select",
      name: "createBy",
      contains: "select",
      options: props.users,
      validationProps: "CreatedBy is Required",
    } : {
      title: "Created By",
      type: "disabled",
      name: "createBy",
      contains: "text",
      value: props?.selectedItem?.taskId?props.selectedItem.created.personName:credentials,
      validationProps: "Created By is Required",
    },
    {
      title: "Owner",
      type: "select",
      name: "owner",
      contains: "select",
      options: props.users,
      validationProps: "owner is Required",
    },
  ].filter(Boolean);

  const [template, setTemplate] = useState({ fields: [...temp] });
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

  async function ValidateValues(taskType) {
    const taskTypeIds = parseInt(taskType, 10);
    if(taskType!=props?.selectedItem?.taskTypeId){
    setTaskTypeId(taskTypeIds)
    const obj = await post(api + `/task/getAllTaskSubTypeByTaskId/${taskTypeIds}`, { "id": Math.random() })
    if (response.ok) {
      const formatedData4 = obj.map(({ taskSubTypeId, taskSubType }) => ({
        value: taskSubTypeId,
        label: taskSubType,
      }))
      setFilteredTaskSubType([{value:"",label:"Select"},...formatedData4]);
    }
    handleDocumentType(taskTypeIds)
   }else{
   
    setFilteredTaskSubType(filteredTaskSubType)
    handleDocumentType(taskTypeIds)
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

      ValidateValues(watchValues[0])
      setPrevWatchValues([...watchValues]);
    }

  }

  async function onSubmit(values) {
    values.createBy = typeof values.createBy === "undefined" ? parseInt(localStorage.getItem("userId")) : values.createBy;
    const obj = await post(api + "/task/createTask", values);
    if (response.ok) {
      if (props?.tableData)
        props.tableData(obj);
      if (props?.selectedItem?.taskId)
        AlertHandler("Successfuly Edited Task", "success")
      else
        AlertHandler("Successfuly created New Task", "success")
    }
    else {
      AlertHandler("Failed to Create New Task", "danger")

    }
    dispatch(modalActions.hideModalHandler())
  }

  useEffect(()=>{
    
    setTemplate(p=>{
      const updatedFields=p.fields.map(field=>field.name==="taskSubTypeId"?{...field,options:filteredTaskSubType}:field)
      return {...p,fields:updatedFields}
    })

  },[filteredTaskSubType])

  const handleDocumentType = (taskTypeId) => {

    const selectedDocument = props?.title.find(doc => doc.taskTypeId == taskTypeId);
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

      const filteredFields = fields?.filter(field => field.title && field.title.trim() !== "");
      setTemplate({ fields: [...temp, ...filteredFields] })
    }
    else
      setTemplate({ fields: [...temp] })
  };

  return (
    <div className={classes.container}>
      <Popupcard
        title={props?.selectedItem?.taskId ? "Edit Task" : "Add in Task"}

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          watchFields={['taskTypeId']}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={props?.selectedItem?.taskId ? props.selectedItem : {}}
          buttonName={props?.selectedItem?.taskId ? "Save" : "Add"}

        ></CreateForm>

      </Popupcard>

    </div>
  );
}

export default TaskPopup;


