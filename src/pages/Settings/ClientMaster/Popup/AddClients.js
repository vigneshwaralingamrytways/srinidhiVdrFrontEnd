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

function AddClient(props) {


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
        fields: props?.selectedItem?.clientId ? [
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

        ] :
            [
                {
                    title: "Client Name",
                    type: "text",
                    name: "clientName",
                    contains: "text",
                    validationProps:"Client Name is Required"
                },
            ]
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    async function onSubmit(values) {
        const obj = await post(api + "/clientMaster/create", values);
        if (response.ok)
            props.tableData(obj);
    }


    return (
        <div className={classes.container}>
            <Popupcard
                title={props?.selectedItem?.clientId ? "Edit Client Name" : "Add Client Name"}
            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props.selectedItem}
                    buttonName={props?.selectedItem?.clientId ? "Save" : "Add"}
                ></CreateForm>
            </Popupcard>

        </div>
    );
}

export default AddClient;


