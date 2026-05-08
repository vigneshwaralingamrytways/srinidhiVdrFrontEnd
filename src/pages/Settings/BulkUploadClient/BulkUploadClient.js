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
import AddClient from '../ClientMaster/Popup/AddClients';
import ClientTable from '../ClientMaster/Table/ClientTable';
import UploadClientsExcelFormat from './Popup/UploadClientsExcelFormat';


const rowWiseFields = 3;
const BulkUploadClient = () => {

  const { get, post, response, loading, error, del } = useFetch({ data: [] });
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    loadInitialData();
  }, [])

  const loadInitialData = useCallback(async () => {

    const obj = await post(api + "/clientMaster/getAllClients", { "id": Math.random() });
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
    setTableData([...tableData,...createData]);
    AlertHandler("Successfully Added", "success")
    dispatch(modalActions.hideModalHandler());

  }
  const EditFunc = (updatedData) => {

    const UpdatedTableData = tableData
      .map((inv) =>
        inv.clientId === updatedData.clientId
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
          modalWidth: '30%',
          modalLeft: '35%',
          selectedForm: (
            <UploadClientsExcelFormat
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
          modalLeft: '35%',
          selectedForm: (
            <AddClient
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
        title: "Client Name",
        type: "text",
        name: "clientName",
        contains: "text",
      },
      {
        title: "Status",
        type: "select",
        name: "status",
        contains: "select",
        options: [
          { value: "Active", label: "Active" },
          { value: "InActive", label: "InActive" },
        ]
      },
    ]
  }

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  const searchDetails = async (values) => {
    values.clientName=values.clientName!=""?values.clientName.trim():""
      const returnObject = await post(api + "/clientMaster/search", values);
      if (returnObject.length > 0) {
        setTableData(returnObject);
      } else {
        setTableData([])
      }
  }
  function onSubmit(values) {
    searchDetails(values);
  }
  return (
    <div className={classes.container}>
      <SearchCard
        title="Bulk Upload"
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
          cols={ClientTable(showFormHandler)}
          data={tableData}
          rows={10} />
      </SimpleCard>
    </div>
  )
}

export default BulkUploadClient
