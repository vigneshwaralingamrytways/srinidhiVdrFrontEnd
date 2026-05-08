import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  SimpleCard,
  Table,
  Button,
  useSelector,
  useDispatch,
  api,
  useFetch,
  modalActions,
  alertActions,
  Row,
  Col,
  CreateForm,
  SearchCard,
} from '../../Components/CommonImports/CommonImports';
import FormConfigForm from './FormConfigForm';
import UploadForm from './Popup/UploadForm';
import SearchUploadTable from './Table/SearchUploadTable'
import saveAs from "file-saver"
import ListingDocumentMenuTable from './Table/ListingDocumentMenuTable';
import SearchSideBar from './SearchSideBar'
import { moduleActions } from '../../store/module-slice';
import { FaArrowCircleLeft, FaHome } from 'react-icons/fa';
import classes from "./SearchPage.module.css"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const NavWrap = styled(Col)`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: ${({ sidebar }) => (!sidebar ? '1.5%' : '17%')};
`;

const rowWiseFields = 4;
function SearchPage(props) {
  const [document, setDocument] = useState(null);
  const [dynamicMenu, setDynamicMenu] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [title, setTitle] = useState([]);
  const [tableTitles, setTableTitles] = useState({});
  const [template, setTemplate] = useState({ fields: [] });
  const [sidebar, setSidebar] = useState(false);
  const [initFolder, setInitFolder] = useState([{ value: "", label: "Select" }]);
  const [folder, setFolder] = useState([{ value: "", label: "Select" }]);
  const [initSubFolder, setInitSubFolder] = useState([{ value: "", label: "Select" }]);
  const [subFolder, setSubFolder] = useState([{ value: "", label: "Select" }]);
  const [prevWatchValues, setPrevWatchValues] = useState([]);

  const moduleId = useSelector((state) => state.sideBar.moduleId);
  const dispatch = useDispatch();
  const loginUserId = parseFloat(localStorage.getItem('userId'));
  const loginUser = parseFloat(localStorage.getItem('roleId'));
  const [docUser, setDocUser] = useState([]);
  const [docAcces, setDocAccess] = useState('');
  const [selectedChecks, setSelectedChecks] = useState(0);
  const [excelItems, setExcelItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchFields = [
    {
      label: 'Category',
      type: 'select',
      name: 'folderId',
      options: folder,
      onchange: (e) => {
        const folderIds = e.target.value;
        handleFolderChange(folderIds)
      }
    }, {
      label: 'Sub Category',
      type: 'select',
      name: 'subFolderId',
      options: subFolder
    },
  ];
  const [filters, setFilters] = useState({
    folderId: '',
    subFolderId: '',
  });

  const handleFolderChange = (folder) => {
    console.log("folder===>", folder)
    loadOptions(document?.documentTypeId, folder)
  }

  const showSidebar = () => setSidebar(!sidebar);
  const hideSidebar = () => setSidebar(false);

  const { get, post, response, cache } = useFetch({ data: [] });

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

  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  useEffect(() => {
    dispatch(
      moduleActions.selectModuleId({
        moduleId: ""
      })
    );
  }, []);

  const loadInitialCustomers = useCallback(async () => {
    console.log(typeof (loginUser), loginUser)
    const titleApi = loginUser === 1 ? post(api + "/documentTypeMaster/documentTypeMaster", { "documentTypeId": Math.random() }) : post(api + "/docUserMaster/getListByUserId", { userId: loginUserId, "documentTypeId": Math.random() })
    try {
      const [initialSideTitle, initialLabels, folderLoadOptions, subFolderLoadOptions] = await Promise.all([
        titleApi,
        post(api + "/formConfigMaster/formConfigMaster", { "documentTypeId": Math.random() }),
        get(api + "/folderMaster/loadOptions"),
        get(api + "/subFolderMaster/loadOptions")
      ]);
      if (response.ok) {
        const finalTitle = loginUser === 1 ? initialSideTitle.map(item => ({
          title: item.documentType,
          id: item.documentTypeId
        })) : initialSideTitle.map(item => ({
          title: item.documentTypeMaster.documentType,
          id: item.documentTypeMaster.documentTypeId
        }));
        setDocUser(initialSideTitle)
        setDynamicMenu(finalTitle);
        setTitle(initialLabels);
        setInitFolder([{ value: "", label: "Select" }, ...folderLoadOptions]);
        setInitSubFolder([{ value: "", label: "Select" }, ...subFolderLoadOptions]);
      }
    } catch (error) {
      console.error("Error loading initial data", error);
    }
  }, [loginUser, get, post, response]);

  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers])

  const loadInitialTransac = useCallback(async () => {

    const initialData = await post(api + "/documentTransaction/documentTransaction", { "id": Math.random(), "loadTime": Date().toLocaleString() });
    if (response.ok) {
      setData(initialData);
    }
  }, [post, response]);

  useEffect(() => { loadInitialTransac() }, [loadInitialTransac])

  // const loadInitialData = useCallback(async () => {
  //   const titleApi =
  //     loginUser === 1
  //       ? post(api + '/documentTypeMaster/documentTypeMaster', { documentTypeId: Math.random() })
  //       : post(api + '/docUserMaster/getListByUserId', { userId: loginUserId, documentTypeId: Math.random() });

  //   try {
  //     const [titles, labels] = await Promise.all([
  //       titleApi,
  //       post(api + '/formConfigMaster/formConfigMaster', { documentTypeId: Math.random() }),
  //     ]);

  //     if (response.ok) {
  //       const finalTitle = loginUser === 1 ? titles.map(item => ({ title: item.documentType, id: item.documentTypeId })) :
  //         titles.map(item => ({ title: item.documentTypeMaster.documentType, id: item.documentTypeMaster.documentTypeId }));

  //       setDocUser(titles);
  //       setTitle(labels);
  //       setDynamicMenu(finalTitle);
  //     }
  //   } catch (error) {
  //     console.error('Error loading initial data', error);
  //   }
  // }, [loginUser, loginUserId, post, response]);

  const loadOptions = async (docTypeId, foldId) => {
    if (Number(docTypeId) > 0) {
      const folderLoadOptions = await post(api + "/folderMaster/loadOptionsById", { documentTypeId: docTypeId });
      if (response.ok) {
        setFolder([{ value: "", label: "Select" }, ...folderLoadOptions])
      }
    }
    console.log("fple===>", docTypeId)
    if (Number(foldId) > 0) {
      const subFolderLoadOptions = await post(api + "/subFolderMaster/loadOptionsById", { folderId: foldId });
      if (response.ok) {
        setSubFolder([{ value: "", label: "Select" }, ...subFolderLoadOptions])
      }
    }
  }

  // useEffect(() => {
  //   loadInitialData();
  // }, [loadInitialData]);

  const handleAccess = async (item) => {
    const userAcces = loginUser === 1 ? { accesRight: "View / Upload" } : docUser.find(doc => doc.documentTypeId === item.id && doc.userId === loginUserId)
    const docAcces = userAcces.accesRight === "View" ? "Yes" : "No"
    setDocAccess(docAcces)
  }

  const handleDocumentType = async (item) => {

    setFolder([{ value: "", label: "Select" }])
    setSubFolder([{ value: "", label: "Select" }])
    const name = item.title;
    setDocument(item)
    await loadOptions(item.id, 0)
    //loadSubFolders(item.id,0)
    handleAccess(item)



    const filteredTableTiltes = title?.find(doc => doc?.documentTypeMaster?.documentType === name);

    setTableTitles(filteredTableTiltes)

    const filteredItems = data?.filter(doc => doc?.documentTypeMaster?.documentType === name);
    console.log("filterItem", filteredItems)
    setFilteredData(filteredItems)


    const selectedDocument = title?.find(doc => doc?.documentTypeMaster?.documentType === name);

    console.log("filter===>", selectedDocument)

    // console.log("selectedDocument",selectedDocument)
    if (selectedDocument) {
      const fields = [
        { title: selectedDocument.itemOne, type: "text", name: "itemOne", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemTwo, type: "text", name: "itemTwo", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemThree, type: "text", name: "itemThree", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemFour, type: "text", name: "itemFour", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemFive, type: "text", name: "itemFive", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemSix, type: "text", name: "itemSix", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemSeven, type: "text", name: "itemSeven", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemEight, type: "text", name: "itemEight", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemNine, type: "text", name: "itemNine", contains: "text", validationProps: "Value is required", inpprops: {} },
        { title: selectedDocument.itemTen, type: "text", name: "itemTen", contains: "text", validationProps: "Value is required", inpprops: {} }, {
          title: selectedDocument.itemEleven,
          type: "text",
          name: "itemEleven",
          contains: "text",
          inpprops: {
            // md:4,itemSixitemSix itemEleven
          },
        }, {
          title: selectedDocument.itemTwelve,
          type: "text",
          name: "itemTwelve",
          contains: "text",
          inpprops: {
            // md:4, 
          },
        }, {
          title: selectedDocument.itemThirteen,
          type: "text",
          name: "itemThirteen",
          contains: "text",
          inpprops: {
            // md:4,itemThirteen
          },
        }, {
          title: selectedDocument.itemFourteen,
          type: "text",
          name: "itemFourteen",
          contains: "text",
          inpprops: {
            // md:4, itemFourteen
          },
        }, {
          title: selectedDocument.itemFifteen,
          type: "text",
          name: "itemFifteen",
          contains: "text",
          inpprops: {
            // md:4,  itemFifteen
          },
        },
      ];

      // Filter out fields where title is an empty string
      const filteredFields = fields?.filter(field => field.title && field.title.trim() !== "");


      // Add the status dropdown field
      // const initDropdown = [{
      //   title: 'Folder',
      //   type: 'select',
      //   name: 'folderId',
      //   contains: 'Select',
      //   options: initFolder
      // },{
      //   title: 'Sub Folder',
      //   type: 'select',
      //   name: 'subFolderId',
      //   contains: 'Select',
      //   options: initSubFolder
      // }];

      // Set the template with combined fields
      setTemplate({
        fields: [...filteredFields,
        {
          title: "Created Date",
          type: "date",
          name: "createdDate",
          contains: "date",
          inpprops: {
            format: "dd/mm/yy",
          },
        },
        {
          type: "hidden",
          name: "transactionId",
          contains: "text",
          inpprops: {

          },
        },]
      });

    } else {
      setTemplate({
        fields: [{
          title: "Created Date",
          type: "date",
          name: "createdDate",
          contains: "date",
          inpprops: {
            format: "dd/mm/yy",
          },
        }, {
          type: "hidden",
          name: "transactionId",
          contains: "text",
          inpprops: {

          },
        },]
      });
    }
  };

  // const handleDocumentType = async (item) => {
  //   setDocument(item);
  //   // dispatch({ type: 'sideBar/selectModuleId', payload: { moduleId: item.id } });

  //   const userAccess = loginUser === 1 ? { accesRight: 'View / Upload' } : docUser.find(doc => doc.documentTypeId === item.id && doc.userId === loginUserId);
  //   setDocAccess(userAccess?.accesRight === 'View' ? 'Yes' : 'No');

  //   const initialData = await post(api + '/documentTransaction/documentTransaction', { id: Math.random() });
  //   if (response.ok) {
  //     setData(initialData);
  //     const filteredItems = initialData.filter(doc => doc?.documentTypeMaster?.documentType === item.title);
  //     setFilteredData(filteredItems);

  //     const selectedTitle = title.find(doc => doc?.documentTypeMaster?.documentType === item.title);
  //     setTableTitles(selectedTitle);

  //     const fields = [
  //       { title: 'Created Date', type: 'date', name: 'createdDate', contains: 'date' },
  //       { type: 'hidden', name: 'transactionId', contains: 'text' },
  //     ];
  //     setTemplate({ fields });
  //   }
  // };

  const formSaveFunction = async (values) => {
    if (!values.transactionId || values.transactionId <= 0) {
      const now = new Date();
      values.createdOn = now.toISOString().slice(0, 19); // Format as 'yyyy-MM-ddTHH:mm:ss'
      values.createdBy = loginUserId
    }
    const saveUrl = values.transactionId > 0 ? '/documentTransaction/edit' : '/documentTransaction/create'
    //const saveUrl = await post(api+saveUrl  , values)
    console.log("Failed newInvoice", values)

    const newTransaction = await post(api + saveUrl, values)

    if (response.ok) {
      if (values.transactionId) {
        setFilteredData(filteredData.map((cust) => cust.transactionId === values.transactionId ? values : cust))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Transaction Updated Successfully", "success")
      } else {
        setFilteredData([newTransaction, ...filteredData])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Transaction Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Transaction Details Failed To Save", "danger")
    }
  }
  const formDeleteFunction = async (values) => {
    const deleteUrl = '/documentTransaction/deleteTransaction'; // Use deleteUrl, not saveUrl

    const deletTransac = await post(api + deleteUrl, values); // Assuming 'post' is the function you are using for making API calls

    if (response.ok) {
      // Filter out the deleted transaction from the initalData based on transactionId
      const deleteRecord = filteredData.filter(item => item.transactionId !== values.transactionId);
      setFilteredData(deleteRecord);

      // Hide modal after deletion
      dispatch(modalActions.hideModalHandler());

      // Show alert for successful deletion
      AlertHandler(deletTransac, "success");
    } else {
      // Handle the error case
      AlertHandler("Failed to Delete", "danger");
    }
  };

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
      dispatch(modalActions.hideModalHandler());
      AlertHandler(returnObject.retValues.message, "success");
    } else {
      dispatch(modalActions.hideModalHandler());
      AlertHandler(returnObject.retValues.message, "danger");
    }
  };


  function onSubmit(values) {
    values.documentTypeId = parseFloat(document.id);
    console.log("valu===>", values)
    searchDetails(values);
  }

  const actions = ["Add", "upload", "edit", "delete"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
    if (action === "Add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <FormConfigForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item, createdDate: item?.createdDate ?? new Date().toISOString().split('T')[0] }}
              document={document}
              template={template}
              initFolder={folder}
              docAcces={docAcces}
              edit={"No"}
              saveFunction={formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "upload") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <UploadForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              listapi={"/documentTransaction/getListByTransacId"}
              deleteApi={"/documentTransaction/delete"}
              selectedItem={{ ...item }}
              popClass={true}
              loadInitialTransac={loadInitialTransac}
              docAcces={docAcces}
              saveFunction={saveDetails}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "edit") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <FormConfigForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              document={document}
              selectedItem={{ ...item }}
              template={template}
              initFolder={folder}
              initSubFolder={initSubFolder}
              docAcces={docAcces}
              edit={"Yes"}
              saveFunction={formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "delete") {
      formDeleteFunction(item)
    }

  };



  const searchTemplate = {

    fields: [
      // {
      //   title: "From Date",
      //   type: "date",
      //   name: "fromDate",
      //   contains: "date",
      //   inpprops: {
      //     format: "dd/mm/yy",
      //   },
      //   //   validationProps: "Value is required",
      // },
      // {
      //   title: "To Date",
      //   type: "date",
      //   name: "toDate",
      //   contains: "date",
      //   inpprops: {
      //     format: "dd/mm/yy",
      //   },
      //   // validationProps: "Value is required",
      // },
      {
        title: 'Category',
        type: 'select',
        name: 'folderId',
        contains: 'Select',
        options: folder
      }, {
        title: 'Sub Category',
        type: 'select',
        name: 'subFolderId',
        contains: 'Select',
        options: subFolder
      }
    ],
  };


  const onCheckBoxEvent = (item, target) => {
    if (target) {

      setSelectedChecks(selectedChecks + 1);
      setExcelItems((prevState) => [...prevState, item]);

    } else {
      setSelectedChecks(selectedChecks - 1);

      setExcelItems(
        excelItems.filter(function (obj) {
          return obj.transactionId !== item.transactionId;
        })
      );

    }
  };

  const handleExcelDownload = async (values) => {

    console.log("docReport Excel Download inside")
    try {

      // const orderapi = selectedChecks >= 1 ? `/documentTransaction/selectedExcelReport?random=${Math.random()}` : `/documentTransaction/excelReport?random=${Math.random()}`; selectedChecks >= 1 ? excelItems : 
      const docReport = await post(api + `/documentTransaction/excelReport?random=${Math.random()}`, values);
      console.log("docReport Excel Download", docReport)
      // Log the entire response object for debugging


      if (response.ok) {
        console.log("docReport", docReport)

        const blob = await response.blob();
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getFullYear()).slice(-2)}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

        // Generate the file name with the date
        const fileName = `Document_${formattedDate}.xlsx`;
        console.log("genereatedfile", fileName)
        saveAs(blob, fileName)

      } else {
        AlertHandler("Failed to Download", "danger")
        console.error('Error downloading the document: Response data is undefined.');
      }
    } catch (error) {
      console.error('Error during download:', error);
    }
  };


  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;

    if (
      watchValues.some(
        (value, index) =>
          value !== prevWatchValues[index] &&
          value !== "" &&
          value !== undefined
      )
    ) {
      loadOptions(0, watchValues[0]);
      setPrevWatchValues([...watchValues]);
    }
  }
  const searchDetails = async (values) => {
    console.log("values", values)
    // if (values.clicked == "Search") {
    const orderapi = "/documentTransaction/searchTransaction";

    const returnObject = await post(api + orderapi, values);

    if (returnObject.length > 0) {
      setFilteredData(returnObject);
    } else {
      setFilteredData([])
    }
    // } 
    // else { handleExcelDownload(values) }

  }

  const history = useHistory()

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = async () => {

    // const orderapi = "/api/orders/searchOrderDetailsForCustomer";
    // const returnObject = await post(api + orderapi, { ...filters, dealerDirectCustomer: filters?.dealerDirectCustomer || localStorage.getItem("userId"), "id": Math.random() });
    // if (returnObject.length > 0) {
    //   const filteredData = returnObject.filter(p => p.orderStatusId === 0)
    //   setData(filteredData)
    // } else {
    //   setData([])
    // }
    searchDetails({ ...filters, documentTypeId: parseFloat(document.id) });
    handleClose();
  };

  const handleAddClick = () => {
    if (filteredData.length > 0)
      handleExcelDownload({ documentTypeId: parseFloat(document.id) })
    else
      AlertHandler("No Data Available", "danger")
  }

  const handleDownload = () => {
    if (filteredData.length > 0)
      handleExcelDownload({ documentTypeId: parseFloat(document.id) })
    else
      AlertHandler("No Data Available", "danger")
  }

  return (
    <div className={classes.container}>
      {!document ? (
        <div className={classes.headerRow}>
          {loginUser == 1 && <div className={classes.backButton} >
            <FaHome
              className={classes.homeIcon}
              title="Go Back to All Releases"
              style={{
                fontSize: "24px",
                cursor: "pointer",
                color: "#007bff",
                marginRight: "12px",
                filter: "drop-shadow(0 0 1px #007bff)",
              }}
              onClick={() => history.push("/modules")}
            /></div>}
          <div className={classes.upTable}>
            <Table
              key={Math.random()}
              cols={ListingDocumentMenuTable(handleDocumentType)}
              data={dynamicMenu}
              rows={25}
              title={"Data Room"}
              striped /></div>
        </div>
      ) : (<>
        {/* <SearchSideBar sidebar={sidebar} onHide={hideSidebar} onIconClick={showSidebar} handleDocumentType={()=>setDocument(null)} dynamicMenu={[{title:"Doc Type",id:0}]} />
        <NavWrap sidebar={sidebar}> */}
        {document && (
          <div className={classes.headerRow}>
            <div className={classes.backButton} onClick={() => setDocument(null)}>
              <FaArrowCircleLeft
                style={{ color: "#2e7d32" }} title="Back" />
            </div>
            <div className={classes.upTable}>
              <Table
                showPlusCircle={true}
                key={document?.id}
                cols={SearchUploadTable(showFormHandler, actions, tableTitles, loginUser)}
                data={filteredData}
                title={document.title ? `${document.title} - Data Room` : 'Data Room'}
                striped
                rows={25}
                showDownload={true}
                searchFields={searchFields}
                handleFilterClick={handleFilterClick}
                anchorEl={anchorEl}
                handleClose={handleClose}
                filters={filters}
                handleFilterChange={handleFilterChange}
                setFilters={setFilters}
                handleApplyFilter={handleApplyFilter}
                handleAddClick={showFormHandler(null, "Add")}
                handleDownload={handleDownload}
                handleDealerChange={handleFolderChange}
              />
            </div>
          </div>
        )}
      </>
      )}
    </div>
  );
}

export default SearchPage;

