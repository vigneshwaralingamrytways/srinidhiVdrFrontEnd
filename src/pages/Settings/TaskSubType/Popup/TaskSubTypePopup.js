import React, { useState } from 'react';
import classes from "../../meeting.module.css";
import {
  Button, Col,
  CreateForm,
  Popupcard,
  Row,
  alertActions,
  api,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../../Components/CommonImports/CommonImports';
const rowWiseFields = 1;

function TaskSubTypePopup(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [data, setData] = useState([])
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





    const template = {
        fields: props?.selectedItem?.taskSubTypeId ?[
            {
              title: "Task Type",
              type: "select",
              name: "taskTypeId",
              contains: "select",
              options:props.data,
              inpprops:{},
              validationProps: "Task Type is Required"
            },
            {
              title: "Task SubType",
              type: "text",
              name: "taskSubType",
              contains: "text",
              validationProps: "Task SubType is Required"
            },
            {
              title: "Status",
              type: "select",
              name: "status",
              contains: "select",
              options:[{value:"1",label:"InActive"},{value:"0",label:"Active"}]
            },
            
          ] :
         [
            {
                title: "Task Type",
                type: "select",
                name: "taskTypeId",
                contains: "select",
                options: props.data,
                validationProps: "Task Type is Required"
            },
            {
                title: "Task SubType",
                type: "text",
                name: "taskSubType",
                contains: "text",
                validationProps: "Task SubType is Required"
            },
        ]
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    async function onSubmit(values) {

        const obj = await post(api + "/task/taskSubType/create", values);
        if (response.ok)
            props.tableData(obj);
    }


    return (
        <div className={classes.container}>
            <Popupcard
                title="Add Task SubType"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props?.selectedItem}
                    buttonName="Save"

                ></CreateForm>


            </Popupcard>

        </div>
    );
}

export default TaskSubTypePopup;


