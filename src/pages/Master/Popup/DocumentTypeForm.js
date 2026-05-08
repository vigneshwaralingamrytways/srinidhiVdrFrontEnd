import React, { useState, useEffect, useCallback } from 'react';
import {

    SearchCard, Popupcard, SimpleCard, PopupSimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm
} from '../../../Components/CommonImports/CommonImports'




const rowWiseFields = 1;

function DocumentTypeForm(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });

    const [data, setData] = useState(props?.data || []);
    const [defaultValues, setDefaultValue] = useState(props.selectedItem)
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


    const actions = ["Add", "AddBooking", "status", "payment", "document"];
    const showFormHandler = (item, action) => () => {
        console.log(action);

    };

    const template = {
        fields: [

            {
                title: "Document Type",
                type: "text",
                name: "documentType",
                contains: "text",
                inpprops: {
                    // md:4,
                },
            },
            ...(props?.selectedItem?.documentTypeId ? [
                {
                    title: "Status",
                    type: "select",
                    name: "status",
                    contains: "select",
                    options: [{ value: "Active", label: "Active" }, { value: "In-Active", label: "In-Active" }]
                }
            ] : []),
            {
                type: "hidden",
                name: "documentTypeId",
                contains: "text",
                inpprops: {

                },
            },
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    function onSubmit(values) {

        if (values?.documentTypeId) {
            if (data.find(item => item?.documentType?.trim()?.toLowerCase() == values?.documentType?.trim()?.toLowerCase() && item?.documentTypeId != values?.documentTypeId)) {
                AlertHandler(`This Data Room is Already Exist : ${values?.documentType}`)
                setDefaultValue(values)
                return;
            }

        } else {
            if (data.find(item => item?.documentType?.trim()?.toLowerCase() == values?.documentType?.trim()?.toLowerCase())) {
                AlertHandler(`This Data Room is Already Exist : ${values?.documentType}`)
                setDefaultValue(values)
                return;
            }
        }

        props.saveFunction({ ...values, status: props?.selectedItem?.documentTypeId ? values?.status : "Active" })


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Document Type"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={defaultValues}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

            </Popupcard>

        </div>
    );
}

export default DocumentTypeForm;


