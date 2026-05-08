import React, { useState, useEffect, useCallback } from 'react';
import {

  SearchCard, Popupcard, SimpleCard, PopupSimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm
} from '../../../Components/CommonImports/CommonImports'
import UserTable from '../Table/UserTable';




const rowWiseFields = 3;

function UserForm(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });

  const [data, setData] = useState([]);
  const [userList, setUserList] = useState([{ value: "", label: "Select" }]);
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
  // const loadInitOptions = useCallback(async () => {

  //     const initUser = await get(api + "/users/loadOptions")


  //     if (response.ok) {

  //       console.log(" inside inituser",initUser)
  //        setUserList([{ value: "", label: "Select" },...initUser]);
  //     }else {
  //       console.log("inituser",initUser)

  //     }

  // }, [get, response]);


  // useEffect(() => { loadInitOptions() }, [loadInitOptions]) 


  const loadInitialLists = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const initUser = await get(api + `/users/loadOptions?rand=${Math.random()}`)
    const loadedLists = await post(api + "/docUserMaster/getListByDocumentTypeId", { documentTypeId: props.selectedItem.documentTypeId, rand: Math.random() });
    console.log(loadedLists)
    if (response.ok) {
      setData([...loadedLists]);
      setUserList([{ value: "", label: "Select" }, ...initUser]);
    }

    // console.log({...props.selectedItem})
  }, [get, response]);

  useEffect(() => {
    loadInitialLists();
  }, []);


  const saveFunction = async (values) => {

    if (data.find(item => item.userId == values.userId)) {
      AlertHandler(`This User Already Exist : ${userList?.find(i => i.value == values.userId)?.label}`)
      return;
    }


    const saveUrl = values.docUserId > 0 ? '/docUserMaster/create' : '/docUserMaster/create'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {



      if (values.docUserId) {
        setData(data.map((doc) => doc.docUserId === values.docUserId ? values : doc))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Updated Successfully", "success")
      } else {
        setData([...data, newDoc])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("User Details Failed To Save", "danger")
    }
  }




  const handleDelete = async (values) => {

    console.log("values", values)

    const deleteFile = await post(api + "/docUserMaster/delete", values)

    if (response.ok) {
      //    dispatch(modalActions.hideModalHandler());

      const deleteRecord = data.filter(item => item.docUserId !== values.docUserId);
      setData(deleteRecord);

      AlertHandler("User Deleted Successfully", "success")
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("This Data was using in some other Place", "danger")
    }

  }
  const actions = ["delete"];
  const showFormHandler = (item, action) => () => {
    if (action === "delete") {
      handleDelete(item)
    }

  };

  const template = {
    fields: [
      {
        title: 'User Name',
        type: 'select',
        name: 'userId',
        contains: 'Select',
        options: userList,
        validationProps: "UserName is Required"
      }, {
        title: 'Access Right',
        type: 'select',
        name: 'accesRight',
        contains: 'Select',
        options: [
          { value: '', label: 'Select' },
          { value: 'View / Upload', label: 'View / Upload' },
          { value: 'View', label: 'View' },

        ],
        validationProps: "Access Right is Required"
      },

    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;




  }

  function onSubmit(values) {
    values.documentTypeId = values.documentTypeId || props.selectedItem.documentTypeId
    saveFunction(values)


  }

  return (
    <div className={classes.container}>
      <Popupcard
        title={`${props.selectedItem.documentType || ''} - Add User`}

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Save"

        ></CreateForm>

        <PopupSimpleCard>

          <Table cols={UserTable(showFormHandler, actions)}
            data={data} striped
            rows={10} /> </PopupSimpleCard>
      </Popupcard>

    </div>
  );
}

export default UserForm;


