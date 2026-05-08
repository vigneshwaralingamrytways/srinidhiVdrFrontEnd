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
import GroupMasterPopup from '../MeetingGroupMaster/Popup/GroupMasterPopup';
import classes from "../meeting.module.css";
import GroupMasterTable from "../MeetingGroupMaster/Table/GroupMasterTable"

const rowWiseFields = 4;
const MeetingGroupMasterSearch = () => {

  const { get, post, response, loading, error, del } = useFetch({ data: [] });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, [])


  const loadInitialData = useCallback(async () => {

    const obj = await post(api + "/meetingCategory/getAllMeetingCategory", { "id": Math.random() })
    if (response.ok) {
      setTableData([...obj]);
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

  const EditFunc = (updatedData) => {

    const UpdatedTableData = tableData
      .map((inv) =>
        inv.meetingGroupId === updatedData.meetingGroupId
          ? updatedData
          : inv);
    setTableData(UpdatedTableData);
    console.log("up", updatedData)
    AlertHandler("Successfully Edited", "success")
    dispatch(modalActions.hideModalHandler())
  }


  const AddFunc = (createData) => {
    setTableData([...tableData, createData]);
    AlertHandler("Successfully Added", "success")
    dispatch(modalActions.hideModalHandler())
  }



  const actions = ["Add"]
  const showFormHandler = (item, action) => () => {
    if (action === "Add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <GroupMasterPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              tableData={AddFunc}
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
            <GroupMasterPopup
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
        title: "Meeting Category",
        type: "text",
        name: "meetingCategory",
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

  function onSubmit(values) {
    searchDetails(values);
  }

  const searchDetails = async (values) => {

    values.meetingCategory = values.meetingCategory.trim();
    if (values.clicked == "Search") {
      const returnObject = await post(api + "/meetingCategory/search",{...values,"id":Math.random()});
      if (returnObject.length > 0) {
        setTableData(returnObject);
      } else {
        setTableData([])
      }
    }
  }
  return (
    <div className={classes.container}>
      <SearchCard
        title="Meeting Category"
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
          cols={GroupMasterTable(showFormHandler)}
          data={tableData}
          rows={10} />
      </SimpleCard>
    </div>
  )
}

export default MeetingGroupMasterSearch
