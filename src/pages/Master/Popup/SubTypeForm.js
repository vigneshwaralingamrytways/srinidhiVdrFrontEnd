import React, { useState, useEffect, useCallback } from 'react';
import {

  SearchCard, Popupcard, SimpleCard, PopupSimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm
} from '../../../Components/CommonImports/CommonImports'
import SubTypeTable from '../Table/SubTypeTable';
import SubFolderForm from './SubFolderForm';


const rowWiseFields = 3;

function SubTypeForm(props) {


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
    const loadedLists = await post(api + "/folderMaster/getListByDocumentTypeId", { documentTypeId: props.selectedItem.documentTypeId, rand: Math.random() });
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

    const deleteFile = await post(api + "/folderMaster/delete", values)

    if (response.ok) {

      const deleteRecord = data.filter(item => item.folderId !== values.folderId);
      setData(deleteRecord);

      //   dispatch(modalActions.hideModalHandler());
      AlertHandler("Folder Deleted Successfully", "success")
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Folder Details Failed To Delete", "danger")
    }

  }

  const actions = ["edit", "subFolder", "delete"];
  const showFormHandler = (item, action) => () => {
    if (action == "edit") {
      setDefaultValue({ ...item })
    } else if (action === "subFolder") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          // modalWidth: '24%',
          // modalLeft: '38%',
          selectedForm: (
            <SubFolderForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}

            // saveFunction = {saveFunction}

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
        title: "Category Name",
        type: "text",
        name: "folderCategoryName",
        contains: "text",
        inpprops: {
          // md:4,
        },
        validationProps: "Category Name is Required"
      },
      {
        title: "Description",
        type: "textarea",
        name: "folderDescribtion",
        contains: "textarea",
        validationProps: "projectDescription is required",
        inpprops: {
          md: 6
        },
      }, {
        type: "hidden",
        name: "folderId",
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

    if (values.folderId) {
      if (data.find(item => item?.folderCategoryName?.trim()?.toLowerCase() == values?.folderCategoryName?.trim()?.toLowerCase() && item?.folderId != values?.folderId)) {
        AlertHandler(`This Category Name is Already Exist : ${values?.folderCategoryName}`)
        setDefaultValue(values)
        return;
      }

    } else {
      if (data.find(item => item?.folderCategoryName?.trim()?.toLowerCase() == values?.folderCategoryName?.trim()?.toLowerCase())) {
        AlertHandler(`This Category Name is Already Exist : ${values?.folderCategoryName}`)
        setDefaultValue(values)
        return;
      }
    }


    const saveUrl = values.folderId > 0 ? '/folderMaster/edit' : '/folderMaster/create'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {

      setDefaultValue({})

      if (values.folderId) {
        setData(data.map((doc) => doc.folderId === values.folderId ? values : doc))
        // dispatch(modalActions.hideModalHandler())
        AlertHandler("Folder Updated Successfully", "success")
      } else {
        setData([...data, newDoc])
        //  dispatch(modalActions.hideModalHandler())
        AlertHandler("Folder Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Folder Details Failed To Save", "danger")
    }
  }


  function onSubmit(values) {
    values.documentTypeId = values.documentTypeId || props.selectedItem.documentTypeId
    saveFunction(values)


  }

  return (
    <div className={classes.container}>
      <Popupcard
        //     title="Sub Type"

        title={props.selectedItem.documentType ? ` ${props.selectedItem.documentType}  ` : 'Add Category'}

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

          <Table cols={SubTypeTable(showFormHandler, actions)}
            data={data} striped
            rows={10} /> </PopupSimpleCard>
      </Popupcard>

    </div>
  );
}

export default SubTypeForm;


