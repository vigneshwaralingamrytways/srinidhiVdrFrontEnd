import React, { useState, useEffect, useCallback } from 'react';
import {
  Popupcard,
  CreateForm,
  alertActions,
  modalActions,
  useSelector,
  useDispatch,
  api,
  useFetch,
  classes
} from '../../Components/CommonImports/CommonImports';

const rowWiseFields = 4;
const userId = localStorage.getItem("userId");

function FormConfigForm(props) {

  const [docUserDetails, setDocUserDetails] = useState({});
  const [template, setTemplate] = useState(props.template);
  const [prevWatchValues, setPrevWatchValues] = useState([]);
  const [initFolder, setInitFolder] = useState(props.initFolder || [{ value: "", label: "Select" }]);
  const [initSubFolder, setInitSubFolder] = useState(props.initSubFolder || [{ value: "", label: "Select" }]);
  const [defaultValues, setDefaultValues] = useState(
    props?.selectedItem || { createdDate: new Date().toISOString().split('T')[0] }
  );

  const { post, response } = useFetch({ data: [] });

  const [showAlert] = useSelector((state) => [state.alertProps.showAlert]);
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

  // ? LOAD USER ACCESS DETAILS
  const loadInitialData = useCallback(async () => {
    const obj = await post(api + `/documentTypeMaster/getAllDocUserDetails`, {
      userId: userId,
      documentTypeId: props?.document?.id
    });

    if (response.ok) {
      setDocUserDetails(obj);
    }
  }, [post, response, props?.document?.id]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ? LOAD SUBFOLDERS (FIXED)
  const loadSubFolders = async (folderId) => {
    if (!folderId) return;

    try {
      const res = await post(api + "/subFolderMaster/loadOptionsById", {
        folderId: folderId
      });

      if (response.ok) {
        setInitSubFolder([{ value: "", label: "Select" }, ...res]);
      }
    } catch (err) {
      console.error("Error loading subfolders", err);
    }
  };

  // ? IMPORTANT FIX ? LOAD SUBFOLDER ON EDIT
  useEffect(() => {
    if (props.edit === "Yes" && defaultValues?.folderId) {
      loadSubFolders(defaultValues.folderId);
    }
  }, [props.edit, defaultValues]);

  // ? DROPDOWN STRUCTURE
  const initDropdown = [
    {
      title: 'Category',
      type: 'select',
      name: 'folderId',
      contains: 'Select',
      validationProps: "Category is required",
      options: initFolder
    },
    {
      title: 'Sub Category',
      type: 'select',
      name: 'subFolderId',
      contains: 'Select',
      validationProps: "Sub Category is required",
      options: initSubFolder
    }
  ];

  // ? TEMPLATE SET
  useEffect(() => {
    if (props.template?.fields) {
      setTemplate({
        fields: [...initDropdown, ...props.template.fields]
      });
    }
  }, [initFolder, initSubFolder, props.template]);

  // ? WATCH CATEGORY CHANGE
  function validate(watchValues) {
    if (
      watchValues.some(
        (value, index) =>
          value !== prevWatchValues[index] &&
          value !== "" &&
          value !== undefined
      )
    ) {
      loadSubFolders(watchValues[0]); // folderId
      setPrevWatchValues([...watchValues]);
    }
  }

  // ? SUBMIT FIX
  function onSubmit(values) {
    values.documentTypeId = props?.document?.id;

    if (docUserDetails?.docUserId) {
      values.docUserId = docUserDetails.docUserId;
    }

    props.saveFunction(values);
  }

  return (
    <div className={classes.container}>
      <Popupcard
        title={
          props.document
            ? `${defaultValues?.transactionId
              ? `Edit - ${props.document.title}`
              : `Add - ${props.document.title}`
            }`
            : ""
        }
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          defaultValues={defaultValues}
          watchFields={["folderId"]}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName={props.docAcces === "Yes" ? "" : "Save"}
        />
      </Popupcard>
    </div>
  );
}

export default FormConfigForm;