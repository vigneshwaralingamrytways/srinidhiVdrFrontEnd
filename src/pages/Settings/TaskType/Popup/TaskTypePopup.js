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

function TaskTypePopup(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
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
        fields: props?.selectedItem?.taskTypeId ? [
            {
                title: "Task Type",
                type: "text",
                name: "taskType",
                contains: "text",

            },
            {
                title: "Status",
                type: "select",
                name: "status",
                contains: "select",
                options: [{ value: "1", label: "InActive" }, { value: "0", label: "Active" }]
            },

        ] :
            [
                {
                    title: "Task Type",
                    type: "text",
                    name: "taskType",
                    contains: "text",
                    validationProps: "Meeting Category is Required"
                },
            ]
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    async function onSubmit(values) {
        const obj = await post(api + "/task/taskType/create", values);
        if (response.ok)
            props.tableData(obj);
    }


    return (
        <div className={classes.container}>
            <Popupcard
                title={props?.selectedItem?.taskTypeId ? "Edit Task Type" : "Add Task Type"}
            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props.selectedItem}
                    buttonName={props?.selectedItem?.taskTypeId ? "Save" : "Add"}
                ></CreateForm>
            </Popupcard>

        </div>
    );
}

export default TaskTypePopup;


