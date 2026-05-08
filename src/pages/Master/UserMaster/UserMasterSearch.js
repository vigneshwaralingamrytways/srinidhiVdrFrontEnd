import React, { useState, useEffect, useCallback } from 'react';
import {

  SearchCard, SimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm, PopupSimpleCard
} from '../../../Components/CommonImports/CommonImports'
import NewUser from './NewUser';
import CustomerTable from './CustomerTable';



const rowWiseFields = 4;

function UserMasterSearch(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });

  const [customers, setCustomers] = useState([]);
  const [roles, setRoles] = useState([{ value: "", label: "Select" }]);
  const [depart, setDepart] = useState([{ value: "", label: "Select" }]);
  const [consigneName, setConsigneName] = useState([{ value: "", label: "Select" }]);
  const [direct, setDirect] = useState([{ value: "", label: "Select" }]);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchFields = [
    {
      label: 'User Name',
      type: 'text',
      name: 'userName',
      required: true
    },
    {
      label: 'Role',
      type: 'select',
      name: 'roleId',
      options:roles
    }
  ];
  const [filters, setFilters] = useState({
    userName: '',
    roleId:''
  });


  const loadInitialCustomers = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const initialCusts = await get(api + `/users/users?rand=${Math.random()}`);
    const initialRoles = await get(api + `/roles/loadOptions?rand=${Math.random()}`);
    const initialDepartments = await get(api + `/department/loadOptions?rand=${Math.random()}`);

    const initialDirectCustomer = await get(api + `/customerMaster/loadDirectCustomerOptions?rand=${Math.random()}`);

    if (response.ok) {
      setCustomers([...initialCusts]);
      setRoles([...roles, ...initialRoles])
      setDepart([...initialDepartments])

      setDirect([...direct, ...initialDirectCustomer])
    }
  }, [get, response]);

  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount

  const customerSave = async (Customer) => {
    const newCustomer = await post(api + '/users/create', Customer)
    if (response.ok) {
      if (Customer.userId) {
        setCustomers(customers.map((cust) => cust.userId === Customer.userId ? newCustomer : cust))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Updated Successfully", "success")
      } else {
        setCustomers([...customers, newCustomer])
        console.log("newCustomer", newCustomer)
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("User Details Failed To Save", "danger")
    }
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


  const actions = ["Add", "Edit"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
    if (action === "Add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '48%',
          modalLeft: '26%',

          selectedForm: (
            <NewUser
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              customerSave={customerSave}
              roles={roles}
              depart={depart}
              direct={direct}
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
          modalWidth: '48%',
          modalLeft: '26%',

          selectedForm: (
            <NewUser
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              customerSave={customerSave}
              roles={roles}
              depart={depart}
              consigneName={consigneName}
            />
          ),
          showModal: true,
        })
      );
    }
  };


  const template = {
    //  heading: "User Search",
    fields: [
      {


        title: "User Name",
        type: "text",
        name: "unitSqft",
        contains: "text",
        inpprops: {},
      },
    ],
  };

  const searchTemplate = {
    heading: "search",
    fields: [

    ],
  };
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;



  }

  function onSubmit(values) {
    console.log(values);


  }

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

    const orderapi = "/users/searchUsers";
    const returnObject = await post(api + orderapi, { ...filters, "rand": Math.random() });
    if (returnObject.length > 0) {
      setCustomers(returnObject)
    } else {
      setCustomers([])
    }
    handleClose();
  };

  return (
    <div className={classes.container} >
      {/*  <SimpleCard
      >
        <NavCreateForm
          AddbuttonName="Add"
            onHeaderClick={showFormHandler({}, "Add")}
          bottonShow={showModal}
          template={template}
          rowwise={rowWiseFields}
          //watchFields={["region"]}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Submit"

        ></NavCreateForm>

      </SimpleCard> */}
      {/* <SearchCard
        title="User Search"
        buttonName="Add"
        onHeaderClick={showFormHandler({}, "Add")}
        bottonShow={showModal}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search" /> </SearchCard> */}
      <SimpleCard md={12}>

        <Table cols={CustomerTable(showFormHandler, actions)}
          data={customers} striped
          title="User Search"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          searchFields={searchFields}
          handleFilterClick={handleFilterClick}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filters={filters}
          handleFilterChange={handleFilterChange}
          setFilters={setFilters}
          handleApplyFilter={handleApplyFilter}
          rows={25} />
      </SimpleCard>
    </div>
  );
}

export default UserMasterSearch;


