import React, { useCallback, useEffect, useState } from 'react';
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
} from '../../../../Components/CommonImports/CommonImports';
import classes from '../../meeting.module.css';



const rowWiseFields = 1;

function GroupMasterPopup(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });
  const [data, setData] = useState([])
  const [defaultValues, setDefaultValues] = useState(props?.selectedItem)
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



  const showFormHandler = (item, action) => () => { };


  const template = {
    fields: props?.selectedItem?.meetingGroupId ? [
      {
        title: "Meeting Category",
        type: "text",
        name: "meetingCategory",
        contains: "text",
        validationProps: "Meeting Category is Required"
      },
      {
        title: "Status",
        type: "select",
        name: "status",
        contains: "select",
        options: [{ value: "0", label: "Active" }, { value: "1", label: "InActive" }]
      },
    ] :
      [
        {
          title: "Meeting Category",
          type: "text",
          name: "meetingCategory",
          contains: "text",
          validationProps: "Meeting Category is Required"
        },
      ],
  };
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  async function onSubmit(values) {
    const returnObj = await post(api + "/meetingCategory/create", values);
    if (response.ok) {
      props.tableData(returnObj);
    }
  }


  return (
    <div className={classes.container}>
      <Popupcard
        title="Add Meeting"

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          defaultValues={defaultValues}
          buttonName="Save"

        ></CreateForm>


      </Popupcard>

    </div>
  );
}

export default GroupMasterPopup;


