import React, { useState, useEffect, useCallback } from 'react';
import {

  SearchCard, Popupcard, SimpleCard, PopupSimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm
} from '../../../Components/CommonImports/CommonImports'
import SubFolderTable from '../Table/SubFolderTable';



const rowWiseFields = 3;

function SubFolderForm(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });

  const [data, setData] = useState([]);
  const [defaultValue, setDefaultValue] = useState({});
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


  const loadInitialLists = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const loadedLists = await post(api + "/subFolderMaster/getListByDocypeAndFolder", { documentTypeId: props.selectedItem.documentTypeId, folderId: props.selectedItem.folderId, rand: Math.random() });
    console.log(loadedLists)
    if (loadedLists.length > 0) {
      setData([...loadedLists]);
    } else {
      setData([])
    }

    // console.log({...props.selectedItem})
  }, [get, response]);

  useEffect(() => {
    loadInitialLists();
  }, []);


  const handleDelete = async (values) => {

    console.log("values", values)

    const deleteFile = await post(api + "/subFolderMaster/delete", values)

    if (response.ok) {
      // dispatch(modalActions.hideModalHandler());
      const deleteRecord = data.filter(item => item.subFolderId !== values.subFolderId);
      setData(deleteRecord);
      AlertHandler("Sub Folder Deleted Successfully", "success")
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Sub Folder Details Failed To Delete", "danger")
    }

  }

  const actions = ["edit", "delete"];
  const showFormHandler = (item, action) => () => {
    if (action == "edit") {
      setDefaultValue({ ...item })
    } else if (action === "delete") {
      handleDelete(item)
    }
  };

  const template = {
    fields: [

      {
        title: "Sub Category Name",
        type: "text",
        name: "subFolderCategoryName",
        contains: "text",
        inpprops: {
          // md:4,
        },
        validationProps: "Sub Category Name is Required"
      },
      {
        title: "Description",
        type: "textarea",
        name: "subFolderDescribtion",
        contains: "textarea",
        validationProps: "Project Description is required",
        inpprops: {
          md: 6
        },
      }, {
        type: "hidden",
        name: "subFolderId",
        contains: "text",
        inpprops: {

        },
      }

    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;




  }

  const saveFunction = async (values) => {

    if (values.subFolderId) {
      if (data.find(item => item?.subFolderCategoryName?.trim()?.toLowerCase() == values?.subFolderCategoryName?.trim()?.toLowerCase() && item?.folderId != values?.subFolderId)) {
        AlertHandler(`This Sub Category Name is Already Exist : ${values?.subFolderCategoryName}`)
        return;
      }

    } else {
      if (data.find(item => item?.subFolderCategoryName?.trim()?.toLowerCase() == values?.subFolderCategoryName?.trim()?.toLowerCase())) {
        AlertHandler(`This Sub Category Name is Already Exist : ${values?.subFolderCategoryName}`)
        return
      }
    }


    const saveUrl = values.subFolderId > 0 ? '/subFolderMaster/edit' : '/subFolderMaster/create'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {
      setDefaultValue({})
      if (values.subFolderId) {
        setData(data.map((doc) => doc.subFolderId === values.subFolderId ? values : doc))
        //  dispatch(modalActions.hideModalHandler())
        AlertHandler("Folder Updated Successfully", "success")
      } else {
        setData([...data, newDoc])
        //   dispatch(modalActions.hideModalHandler())
        AlertHandler("Folder Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Folder Details Failed To Save", "danger")
    }
  }


  function onSubmit(values) {
    values.documentTypeId = values.documentTypeId || props.selectedItem.documentTypeId
    values.folderId = values.folderId || props.selectedItem.folderId
    saveFunction(values)


  }

  return (
    <div className={classes.container}>
      <Popupcard
        title={
          props.selectedItem
            ? `${props.selectedItem.documentTypeMaster?.documentType || ''} | ${props.selectedItem?.folderCategoryName || ''} |  Sub Category`
            : 'Add Sub Category'
        }


      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          defaultValues={defaultValue}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Save"

        ></CreateForm>

        <PopupSimpleCard>

          <Table cols={SubFolderTable(showFormHandler, actions)}
            data={data} striped
            rows={10} /> </PopupSimpleCard>
      </Popupcard>

    </div>
  );
}

export default SubFolderForm;


