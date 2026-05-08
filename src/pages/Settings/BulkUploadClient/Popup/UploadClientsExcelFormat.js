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
import LoadingPopup from '../../../../Components/SearchViewPopup/LoadingPopup';

const rowWiseFields = 1;

function UploadClientsExcelFormat(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [showPopup,setShowPopup]=useState(false)
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
        fields: 
            [
                {
                    title: "File",
                    type: "Document",
                    name: "file",
                    contains: "Document",
                    inpprops:{},
                    validationProps:"File is Required"
                },
            ]
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    async function onSubmit(values) {
        
        const formData = new FormData();
        formData.append("file",values.file[0])
        const obj = await post(api +"/clientMaster/readExcel", formData);
        if (response.ok && obj.length>0){
            setShowPopup(false)
            props.tableData(obj);
        }else{
            setShowPopup(false)
        }
    }


    return (
        <div className={classes.container}>
            <LoadingPopup
            showPopup={showPopup}
            />
            <Popupcard
                title={props?.selectedItem?.clientId ? "Edit Client Name" : "File Upload"}
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

export default UploadClientsExcelFormat;


