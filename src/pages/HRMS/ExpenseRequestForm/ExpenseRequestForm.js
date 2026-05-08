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
  useSelector,
  ApprovalForm,
  UploadForm
} from '../../../Components/CommonImports/CommonImports';
import classes from "../OrgChart.module.css";
import RequestForm from './Popup/RequestForm';
import ExpenseRequestTable from './Table/ExpenseRequestTable';


const rowWiseFields = 4;
const ExpenseRequestForm = () => {

  const { get, post, response, loading, error, del } = useFetch({ data: [] });
  const [tableData, setTableData] = useState([
    {
      "expenseTypeId":1,
      "requestDate":"2025-02-21",
      "employeeName":"Lokesh G",
      "expenseType":"Travel Expenses",
      "status":"InProgress",
      "approval":"Created",
      "remarks":"-"
    },
    {
      "expenseTypeId":2,
      "requestDate":"2025-02-21",
      "employeeName":"Rajesh G",
      "status":"InProgress",
      "expenseType":"BroadBand Expenses",
      "approval":"Created",
      "remarks":"-"
    }
  ]);

  useEffect(() => {
    loadInitialData();
  }, [])


  const loadInitialData = useCallback(async () => {

    // const obj = await post(api + "/meetingCategory/getAllMeetingCategory", { "id": Math.random() })
    // if (response.ok) {
    //   setTableData([...obj]);
    // }
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
          modalWidth: '30%',
          modalLeft: '37%',
          selectedForm: (
            <RequestForm
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
          modalWidth: '30%',
          modalLeft: '37%',
          selectedForm: (
            <RequestForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              tableData={EditFunc}
            />
          ),
          showModal: true,
        })
      );
    }
    else if (action === "Upload") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '50%',
          modalLeft: '25%',
          selectedForm: (
            <UploadForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              tableData={EditFunc}
              entryType={"Expense Request"}
              entryId={item.expenseTypeId}
            />
          ),
          showModal: true,
        })
      );
    }
    else if (action === "Approval") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '50%',
          modalLeft: '25%',
          selectedForm: (
            <ApprovalForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              tableData={EditFunc}
              processName={"Expense Request"}
              processId={item.expenseTypeId}
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
        title: "From Date",
        type: "date",
        name: "fromDate",
        contains: "date",
        inpprops:{}
      },
      {
        title: "To Date",
        type: "date",
        name: "toDate",
        contains: "date",
        inpprops:{}
      }, 
      {
        title: "Employee Name",
        type: "text",
        name: "employeeName",
        contains: "text",
        inpprops:{}
      },
      {
        title: "Status",
        type: "select",
        name: "status",
        contains: "select",
        options: [
          { value: "", label: "Select" },
          { value: "InProgress", label: "InProgress" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
        ],
        inpprops:{}
      },
      {
        title: "Remarks",
        type: "text",
        name: "remarks",
        contains: "text",
        inpprops:{}
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

      // const returnObject = await post(api + "/meetingCategory/search",{...values,"id":Math.random()});
      // if (returnObject.length > 0) {
      //   setTableData(returnObject);
      // } else {
      //   setTableData([])
      // }
  }
  return (
    <div className={classes.container}>
      <SearchCard
        title="Expense Request"
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
          cols={ExpenseRequestTable(showFormHandler)}
          data={tableData}
          rows={10} />
      </SimpleCard>
    </div>
  )
}

export default ExpenseRequestForm
