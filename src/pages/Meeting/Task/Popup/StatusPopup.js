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


const rowWiseFields = 1;

function StatusPopup(props) {
  const { get, post, response, loading, error, put } = useFetch({ data: [] });
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadInitialData();
  }, [])

 const loadInitialData=useCallback(async()=> {
    const taskId = props?.selectedItem?.taskId;
    const obj = await post(api + `/task/getTaskStatus/${taskId}`, { "id": Math.random() });
    if(response.ok)
        setStats(obj);
  },[])


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
        title: "Status",
        type: "select",
        name: "status",
        contains: "select",
        options: [
          { value: "YetToStart", label: "YetToStart" },
          { value: "InProgress", label: "InProgress" },
          { value: "Completed", label: "Completed" },
          { value: "Cancel", label: "Cancel" },
        ]
      },
      {
        title: "Remarks",
        type: "text",
        name: "remarks",
        contains: "text",

      },
      {
        title: "Completion Date",
        type: "date",
        name: "completionDate",
        contains: "date",
        inpprops: {
          format: "dd/mm/yy",
        },

      },

    ],
  };
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  async function onSubmit(values) {
    if(values.clicked=="Add" || values.clicked=="Save"){
    values.taskId = props?.selectedItem?.taskId;
    const obj = await post(api + "/task/status", values);
    if (response.ok) {
      props.tableData(obj);
        AlertHandler("Successfully Updated Task Status", "success")
      dispatch(modalActions.hideModalHandler());
    }
   }
   else{
    dispatch(modalActions.hideModalHandler());
   }
  }
  return (
    <div className={classes.container}>
      <Popupcard
        title={stats?.taskMeetingStatusId?"Update Task Status":"Task Status"}

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={stats?stats:{}}
          buttonName={props?.selectedItem?.status!="Completed"? (stats?.taskMeetingStatusId?"Save":"Add"):"Ok"}

        ></CreateForm>
      </Popupcard>

    </div>
  );
}

export default StatusPopup;


