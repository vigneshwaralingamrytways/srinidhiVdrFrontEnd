import React, { useState, useEffect, useCallback } from 'react';
import {
    SearchCard, Popupcard, SimpleCard, PopupSimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm
} from '../../../../Components/CommonImports/CommonImports'
import { saveAs } from 'file-saver';
import FileUploadTable from '../Table/FileUploadTable';
import LoadingPopup from '../../../../Components/SearchViewPopup/LoadingPopup';

const rowWiseFields = 3;

function FileUploadForm(props) {

    const { get, post, cache, response, loading, error } = useFetch({ data: [] });
    const [data, setData] = useState([])
    const [showPopup, setShowPopup] = useState(false)
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
        const taskId = props.selectedItem.taskId;
        console.log("task", taskId)
        const obj = await post(api + `/task/getAllUploadFilesByTaskId/${taskId}`, { "id": Math.random() })
        if (response.ok)
            setData([...obj]);
    }, []);

    useEffect(() => {
        loadInitialLists();
    }, []);

    const handleDownload = async (rowData) => {
        try {
            setShowPopup(true)
            const fileName = rowData.fileName;
            const docReport = await post(api + `/task/download/${fileName}`,
                { "id": Math.random() });
            if (response.ok) {
                const blob = await response.blob();
                const fileName = rowData.fileName;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
                setShowPopup(false)
                AlertHandler("Successfully Downloaded Document", "success")
            } else {
                setShowPopup(false)
                console.error('Error downloading the document: Response data is undefined.');
                AlertHandler("Failed to Download the document", "danger")
            }
        } catch (error) {
            setShowPopup(false)
            console.error('Error during download:', error);
        }
        setShowPopup(false)
    };


    const handleDelete = async (values) => {
        const fileId = values.fileId;
        const deleteFile = await post(api + `/task/deleteTaskFilesByFileId/${fileId}`, { "id": Math.random() })

        if (response.ok) {
            setShowPopup(false)
            setData(data.filter((cust) => cust.fileId != values.fileId))
            AlertHandler("Document Deleted Successfully", "success")
        } else {
            setShowPopup(false)
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Document Details Failed To Delete", "danger")
        }

    }
    const actions = ["download", "delete", "status", "payment", "document"];
    const showFormHandler = (item, action) => () => {
        if (action === "download") {
            handleDownload(item)
        } else if (action === "delete") {
            setShowPopup(true)
            handleDelete(item)
        }
    };

    const template = {
        fields: [
            {
                title: "Upload Document",
                type: "MultiDocument",
                name: "file",
                contains: "Document",
                validationProps: "File is Required",
                inpprops: {
                    md: 4,
                },
            }, {
                title: "Remarks",
                type: "textarea",
                name: "remarks",
                contains: "textarea",
                inpprops: {
                    md: 8,
                },
            },
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    const saveDetails = async (order) => {
        const formData = new FormData();
        order.taskId = props.selectedItem.taskId;
        for (let i = 0; i < order.file.length; i++) {
            formData.append("files", order.file[i]);
        }
        formData.append("taskId", order.taskId);
        formData.append("remarks", order.remarks);
        const obj = await post(api + "/task/uploadFilesInTask", formData);
        if (response.ok && obj.length > 0) {
            setShowPopup(false)
            setData([...data, ...obj]);
            AlertHandler("Filed Uploaded Successfully", "success")
        }else{
            setShowPopup(false)
        }
    };


    function onSubmit(values) {
        setShowPopup(true)
        saveDetails(values)
    }
    return (
        <div className={classes.container}>
            <LoadingPopup
                showPopup={showPopup}
            />
            <Popupcard
                title={props.documentName ? `${props.documentName} File Uploaded` : "File Upload"}

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props?.selectedItem}
                    buttonName={props?.selectedItem?.status != "Completed" ? "Save" : ""}

                ></CreateForm>

                <PopupSimpleCard>

                    <Table cols={FileUploadTable(showFormHandler, actions, data)}
                        data={data} striped
                        rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default FileUploadForm;

