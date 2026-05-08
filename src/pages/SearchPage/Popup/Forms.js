import React, { useState, useEffect, useCallback } from 'react';



import {

    SearchCard, Popupcard, SimpleCard, PopupSimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm
} from '../../../Components/CommonImports/CommonImports'
import FileUploadTable from '../Table/FileUploadTable';
import { saveAs } from 'file-saver';
import DocumentAccessHistory from './DocumentAccessHistory';

const rowWiseFields = 3;

function UploadForm(props) {


    const { get, post, cache, response, loading, error } = useFetch({ data: [] });
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


    const handleDown = async (rowData) => {
        const download = window.location.origin
        console.log("downloadapi", download)
        // window.open(`${download}/downloads/SRIPATHI/ /Test/${rowData.filePath}/${rowData.generatedFileName}`,'_blank', 'noreferrer')
    }

    const handleDownloadab = async (rowData) => {
        const serverUrl = await get(`${api}/documentTransaction/serverinfo`);
        console.log("downloadapi", serverUrl.baseUrl)
        if (response.ok && serverUrl.baseUrl) {

            console.log("downloadapi", typeof (serverUrl.baseUrl))

            const filePath = rowData.filePath; // This will be like "Test/subfolder"
            const fileName = rowData.generatedFileName;
            console.log("path", window.location.origin);
            console.log("path", window.location);

            window.open(`${serverUrl.baseUrl}/downloads/SRIPATHI/Test/${rowData.filePath}/${rowData.generatedFileName}`);
        }
    };
    const handleDownload = async (rowData) => {
        try {
            const docReport = await post(api + '/documentTransaction/downloadFile',
                { reportDocId: rowData.reportDocId,random:Math.random() });

            // Log the entire response object for debugging


            if (response.ok) {
                const blob = await response.blob();
                const fileName =rowData.fileName;
                 saveAs(blob, fileName)

                // console.log("Generated file:", fileName);

                // // Create a URL for the Blob object
                // const url = window.URL.createObjectURL(blob);

                // // Create a temporary <a> element
                // const link = document.createElement('a');
                // link.href = url;
                // link.download = fileName;  // Set the download filename
                // document.body.appendChild(link);

                // // Programmatically click the link to trigger the download
                // link.click();

                // // Clean up the URL and remove the temporary link
                // window.URL.revokeObjectURL(url);
                // document.body.removeChild(link);
            } else {
                AlertHandler('Error downloading the document: Response data is undefined.',"danger");
            }
        } catch (error) {
            console.error('Error during download:', error);
        }
    };


    const handleDelete = async (values) => {

        const deleteFile = await post(api + props.deleteApi, values)

        if (response.ok) {
            // dispatch(modalActions.hideModalHandler());
            setData(data.filter((cust) => cust.reportDocId != values.reportDocId))
            // props.loadInitialTransac()
            AlertHandler("Document Deleted Successfully", "success")
        } else {
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Document Details Failed To Delete", "danger")
        }

    }
    const actions = ["download", "delete", "status", "payment", "document"];
    const showFormHandler = (item, action) => () => {
        if (action === "download") {
            handleDownload(item)
        } else if (action === "delete") {
            handleDelete(item)
        }
        else if (action == "open") {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: { ...item },
                    // modalWidth: '24%',
                    // modalLeft: '38%',
                    selectedForm: (
                        <DocumentAccessHistory
                            onCancel={() => dispatch(modalActions.hideModalHandler())}
                            selectedItem={{ ...item }}
                        />
                    ),
                    showModal: true,
                })
            );
        }
        console.log(action);

    };

    const template = {
        fields: [
            /* 
                        {
                            title: "Document Name",
                            type: "text",
                            name: "documentname",
                            contains: "text",
                            inpprops: {
                                md:4,
                            },
                        }, */
            {
                title: "Upload Document",
                type: "MultiDocument",
                name: "file",
                contains: "Document",
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


    const loadInitialLists = useCallback(async () => {
        // const { ok } = response // BAD, DO NOT DO THIS
        const loadedLists = await post(api + props.listapi, { transactionId: props.selectedItem.transactionId, rand: Math.random() });
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

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    const saveDetails = async (order) => {
        const orderapi = "/documentTransaction/uploadFiles";  // Adjusted endpoint
        const formData = new FormData();

        for (let i = 0; i < order.file.length; i++) { // Loop through selected files
            formData.append("files", order.file[i]);
        }

        formData.append("transactionId", order.transactionId);
        formData.append("remarks", order.remarks);
        formData.append("documentType", order.documentTypeMaster.documentType);
        formData.append("folderCategoryName", order.folderMaster.folderCategoryName);
        formData.append("subFolderCategoryName", order.subFolderMaster.subFolderCategoryName);

        console.log(orderapi);
        const returnObject = await post(api + orderapi, formData);
        cache.clear();
        console.log(returnObject);

        if (returnObject.retValues.status === 1) {
            // dispatch(modalActions.hideModalHandler());
            setData([...data, ...returnObject.retValues.reports])

            AlertHandler(returnObject.retValues.message, "success");
        } else {
            dispatch(modalActions.hideModalHandler());
            AlertHandler(returnObject.retValues.message, "danger");
        }
    };


    function onSubmit(values) {
        console.log(values);
        //  props.loadInitialTransac()
        saveDetails(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title={props.documentName ? `${props.documentName} File Uploaded` : "File Upload"}

            >
                {props.docAcces !== "Yes" && <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props.selectedItem}
                    buttonName="Save"

                ></CreateForm>}

                <PopupSimpleCard>

                    <Table cols={FileUploadTable(showFormHandler, actions,props?.selectedItem?.documentUserMaster)}
                        data={data} striped
                        rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default UploadForm;


