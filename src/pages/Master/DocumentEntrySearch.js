import React, { useState, useEffect, useCallback } from 'react';

import {

  SearchCard, SimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm, PopupSimpleCard
} from '../../Components/CommonImports/CommonImports'
import EntrySearchTable from './Table/EntrySearchTable';
import SubTypeForm from './Popup/SubTypeForm';
import FormConfigForm from './Popup/FormConfigForm';
import UserForm from './Popup/UserForm';
import DocumentTypeForm from './Popup/DocumentTypeForm';



const rowWiseFields = 4;

function DocumentEntrySearch(props) {


  const [data, setData] = useState([]);

  const { get, post, cache, response, loading, error } = useFetch({ data: [] });
  const [anchorEl, setAnchorEl] = useState(null);
  const searchFields = [
    {
      label: "Document Name",
      type: "text",
      name: "documentType",
      // required: true
    },
    {
      label: "Status",
      type: "select",
      name: "status",
      options: [{ value: "Active", label: "Active" }, { value: "In-Active", label: "In-Active" }]
    }
  ];
  const [filters, setFilters] = useState({
    documentType: '',
    status: ''
  });

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


  const loadInitialCustomers = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const initialCusts = await post(api + "/documentTypeMaster/documentTypeMaster", { "documentTypeId": Math.random() });

    if (response.ok) {

      setData(initialCusts);


    }
  }, [post, get, response]);

  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount



  const formSaveFunction = async (values) => {

    const saveUrl = values.documentTypeId > 0 ? '/documentTypeMaster/create' : '/documentTypeMaster/create'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {
      if (values.documentTypeId) {
        setData(data.map((doc) => doc.documentTypeId === values.documentTypeId ? values : doc))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Document Updated Successfully", "success")
      } else {
        setData([...data, newDoc])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Document Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Document Details Failed To Save", "danger")
    }
  }

  const handleDelete = async (values) => {

    console.log("values", values)

    const deleteFile = await post(api + "/documentTypeMaster/delete", values)
    console.log("deleteFile", deleteFile)
    if (response.ok) {
      const deleteRecord = data.filter(item => item.documentTypeId !== values.documentTypeId);
      setData(deleteRecord);
      dispatch(modalActions.hideModalHandler());
      AlertHandler("Document Type Deleted Successfully", "success")
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Document Type Details Failed To Delete", "danger")
    }

  }



  const actions = ["subType", "formConfig", "user", "add", "delete"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
    if (action === "subType") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          // modalWidth: '24%',
          // modalLeft: '38%',
          selectedForm: (
            <SubTypeForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}

            // saveFunction = {saveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "formConfig") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          // modalWidth: '24%',
          // modalLeft: '38%',
          selectedForm: (
            <FormConfigForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}

            // saveFunction = {saveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "user") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          // modalWidth: '24%',
          // modalLeft: '38%',
          selectedForm: (
            <UserForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}

            // saveFunction = {formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <DocumentTypeForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              saveFunction={formSaveFunction}
              data={data}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "delete") {
      handleDelete(item)
    }


  };


  const template = {

    fields: [
      {
        title: "Document Name",
        type: "text",
        name: "documentType",
        contains: "text",
        inpprops: {
        },
      },
      {
        title: "Status",
        type: "select",
        name: "status",
        contains: "select",
        options: [{ value: "Active", label: "Active" }, { value: "In-Active", label: "In-Active" }]
      }
    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  function onSubmit(values) {
    searchDetails(values);
  }

  const searchDetails = async (values) => {
    const orderapi = "/documentTypeMaster/searchDocTypes";
    const returnObject = await post(api + orderapi, values);
    if (returnObject.length > 0) {
      setData(returnObject);
    } else {
      setData([])
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = async () => {

    const orderapi = "/documentTypeMaster/searchDocTypes";
    const returnObject = await post(api + orderapi, { ...filters, "rand": Math.random() });
    if (returnObject.length > 0) {
      setData(returnObject)
    } else {
      setData([])
    }
    handleClose();
  };


  return (
    <div className={classes.container} >

      {/* <SearchCard
        title="Document Search"
        buttonName="New Document"
        onHeaderClick={showFormHandler({}, "add")}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"

        /> </SearchCard> */}
      <SimpleCard md={12}>
        <Table cols={EntrySearchTable(showFormHandler, actions)}
          data={data}
          title="Document Search"
          striped
          rows={25}
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "add")}
          searchFields={searchFields}
          handleFilterClick={handleFilterClick}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filters={filters}
          handleFilterChange={handleFilterChange}
          setFilters={setFilters}
          handleApplyFilter={handleApplyFilter}
        />
      </SimpleCard>
    </div>
  );
}

export default DocumentEntrySearch;


