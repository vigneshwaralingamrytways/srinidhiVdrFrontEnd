import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, Col,
  CreateForm,
  Popupcard,
  Row,
  alertActions,
  api,
  classes,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../Components/CommonImports/CommonImports';



const rowWiseFields = 4;

function FormConfigForm(props) {


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
    const loadedLists = await post(api + "/formConfigMaster/getListByDocumentTypeId", { documentTypeId: props?.selectedItem?.documentTypeId, rand: Math.random() });
    console.log(loadedLists)
    if (response.ok && loadedLists.length > 0) {
      setDefaultValue(loadedLists[0]);
    } else {
      setDefaultValue({})
    }

    // console.log({...props.selectedItem})
  }, [get, response]);

  useEffect(() => {
    loadInitialLists();
  }, []);

  const saveFunction = async (values) => {


    const saveUrl = values.formConfigId > 0 ? '/formConfigMaster/create' : '/formConfigMaster/create'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {



      if (values.formConfigId) {
        // setData(data.map((doc) => doc.formConfigId === values.formConfigId ? values : doc))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Form Config Updated Successfully", "success")
      } else {
        // setData([...data, newDoc])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Form Config Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Form Config Details Failed To Save", "danger")
    }
  }


  const actions = ["Add", "AddBooking", "status", "payment", "document"];
  const showFormHandler = (item, action) => () => {
    console.log(action);

  };

  const template = {
    fields: [

      {
        title: "Label One",
        type: "text",
        name: "itemOne",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Two",
        type: "text",
        name: "itemTwo",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Three",
        type: "text",
        name: "itemThree",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Four",
        type: "text",
        name: "itemFour",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Five",
        type: "text",
        name: "itemFive",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Six",
        type: "text",
        name: "itemSix",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Seven",
        type: "text",
        name: "itemSeven",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Eight",
        type: "text",
        name: "itemEight",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Nine",
        type: "text",
        name: "itemNine",
        contains: "text",
        inpprops: {
          // md:4,
        },
      }, {
        title: "Label Ten",
        type: "text",
        name: "itemTen",
        contains: "text",
        inpprops: {
          // md:4, 
        },
      }, {
        title: "Label Eleven",
        type: "text",
        name: "itemEleven",
        contains: "text",
        inpprops: {
          // md:4,itemSixitemSix itemEleven
        },
      }, {
        title: "Label Twelve",
        type: "text",
        name: "itemTwelve",
        contains: "text",
        inpprops: {
          // md:4, 
        },
      }, {
        title: "Label Thirteen",
        type: "text",
        name: "itemThirteen",
        contains: "text",
        inpprops: {
          // md:4,itemThirteen
        },
      }, {
        title: "Label Fourteen",
        type: "text",
        name: "itemFourteen",
        contains: "text",
        inpprops: {
          // md:4, itemFourteen
        },
      }, {
        title: "Label Fifteen",
        type: "text",
        name: "itemFifteen",
        contains: "text",
        inpprops: {
          // md:4,  itemFifteen
        },
      },
      {
        title: "Describtion",
        type: "textarea",
        name: "formDescribtion",
        contains: "textarea",
        // validationProps: "projectDescribtion is required",
        inpprops: {
          md: 6
        },
      }, {
        type: "hidden",
        name: "formConfigId",
        contains: "text",
        inpprops: {

        },
      }

    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;




  }
  const handleDelete = async (values) => {



    const deleteFile = await post(api + "/formConfigMaster/delete", values)
    console.log("values", deleteFile)
    if (response.ok) {
      dispatch(modalActions.hideModalHandler());
      AlertHandler("Form Deleted Successfully", "success")
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Form Details Failed To Delete", "danger")
    }

  }

  function onSubmit(values) {

    values.documentTypeId = values.documentTypeId || props?.selectedItem?.documentTypeId
    console.log("called delete", values.clicked)
    if (values.clicked === "Save") {
      saveFunction(values)
    } else if (values.clicked === "delete") {
      console.log("called delete", values)
      handleDelete(values)

    }


  }

  return (
    <div className={classes.container}>
      <Popupcard
        title={`${props.selectedItem.documentType} - Form Config`}

      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          defaultValues={defaultValue}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName=""
          btButtons={
            <Row className="">
              <Col md={3}></Col>

              < Col className="d-flex justify-content-end">
                <Button type="submit" name="Save" variant="primary" className={classes.btn}>
                  Save
                </Button>
                <Button type="submit" name="delete" variant="secondary" className={classes.btn}>
                  Delete
                </Button>
                <Button variant="danger" className={classes.btn} onClick={props.onCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          }

        ></CreateForm>

        {/* <PopupSimpleCard>
    
    <Table cols={FormConfigTable(showFormHandler, actions)} 
data={data}   striped
       rows={10} /> </PopupSimpleCard> */}
      </Popupcard>

    </div>
  );
}

export default FormConfigForm;


