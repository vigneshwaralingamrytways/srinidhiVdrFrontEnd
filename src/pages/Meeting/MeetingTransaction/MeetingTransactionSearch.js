import React, { useCallback, useEffect, useState } from 'react';
import {
  Button, Col,
  CreateForm,
  Popupcard,
  Row,
  Table,
  alertActions,
  api,
  SimpleCard,
  SearchCard,
  PopupSimpleCard,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../Components/CommonImports/CommonImports';
import classes from './meeting.module.css';
import MeetingTransactionPopup from './Popup/MeetingTransactionPopup';
import MeetingTransactionTable from './Table/MeetingTransactionTable';
import MinutesOfMeetingPopup from './Popup/MinutesOfMeetingPopup';
import ParticipantsPopup from './Popup/ParticipantsPopup';
import MeetingStatusPopup from './Popup/MeetingStatusPopup';

const rowWiseFields = 3;

const MeetingTransactionSearch = () => {

  const { get, post, response, loading, error } = useFetch({ data: [] });

  const [users, setUsers] = useState([{ value: "", label: "Select" }])
  const [data, setData] = useState([{ value: "", label: "Select" }])
  const [taskType, setTaskType] = useState([{ value: "", label: "Select" }])
  const [taskSubType, setTaskSubType] = useState([{ value: "", label: "Select" }])
  const [participants,setParticipants]=useState([])
  const roleId = parseInt(localStorage.getItem('roleId'));
  const userId=parseInt(localStorage.getItem("userId"))
  const userName=localStorage.getItem("userName");
  const [tableData, setTableData] = useState([])
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

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = useCallback(async () => {
    if(roleId!=1){
      const obj = await post(api + `/meetingTransaction/getAllMeetingByUserId/${userId}`, { "id": Math.random() });
      if (response.ok)
        setTableData([...obj])
   }
   const orderapi=roleId==1?"/meetingCategory/getAllMeetingCategory":`/meetingTransaction/getAllMeetingByUserId/${userId}`
    const obj1 = await post(api + orderapi, { "id": Math.random() });
    if (response.ok) {
      if(roleId!=1){
      const formatedData = obj1.map(({ meetingGroupId, category:{meetingCategory} }) => ({
        value: meetingGroupId,
        label: meetingCategory,
      }))
      const mergeData=[...data, ...formatedData]
      const uniqueData=Array.from(new Map(mergeData.map(item=>[item.value,item])).values())
      setData(uniqueData);
     }else{
      const formatedData = obj1.map(({ meetingGroupId, meetingCategory }) => ({
        value: meetingGroupId,
        label: meetingCategory,
      }))
      setData([...data, ...formatedData]);
     }
    }
     const obj2 = await get(api + "/users/users");
          if (response.ok) {
            const formatedData1 = obj2.map(({ userId, personName }) => ({
              value: userId,
              label: personName,
            }))
            console.log("obj",formatedData1)
            setUsers([...users, ...formatedData1])
          }

    const obj3 = await post(api + "/task/getAllTaskType", { "id": Math.random() });
    if (response.ok) {
      const formatedData3 = obj3.map(({ taskTypeId, taskType }) => ({
        value: taskTypeId,
        label: taskType,
      }))
      setTaskType([...taskType, ...formatedData3])

    }
    const obj4 = await post(api + "/task/getAllTaskSubType", { "id": Math.random() })
    if (response.ok) {
      const formatedData4 = obj4.map(({ taskSubTypeId, taskSubType }) => ({
        value: taskSubTypeId,
        label: taskSubType,
      }))
      setTaskSubType([...taskSubType, ...formatedData4])
    }

    const obj5 = await post(api + "/meetingTransaction/getParticipants", { "id": Math.random() })
    if (obj5.length>0) {
      setParticipants([...obj5])
    }

  }, [])

  const AddFunc = (createNewData) => {
    setTableData([...tableData, createNewData]);
    dispatch(modalActions.hideModalHandler())

  }
  const searchDetails = async (values) => {
    values.ajenta = values?.ajenta ? values.ajenta.trim().toLowerCase():"";
    values.userId=userId;
    if (values.clicked == "Search") {
      const orderapi = "/meetingTransaction/search";
      const returnObject = await post(api + orderapi, values);
      if (returnObject.length > 0) {
        if(roleId!=1){
        let filteredData=returnObject.filter(p=>p.hostedBy==userId);
        const participant=participants.filter(p=>p.participantName.toLowerCase().trim()==userName.toLowerCase().trim())
        for(let i=0;i<participant.length;i++){
           const trans=participant[i].meetingTransaction;
           if(trans.category.meetingGroupId==values.meetingGroupId)
               filteredData.push(trans);
        }
        setTableData([...filteredData]);
        }else
          setTableData([...returnObject]);
      } else {
        setTableData([])
      }
    }
  }

  const EditFunction = (updatedData) => {
    const UpdatedTableData = tableData
      .map((inv) =>
        inv.meetingTransactionId === updatedData.meetingTransactionId
          ? updatedData
          : inv);
    setTableData(UpdatedTableData);
    dispatch(modalActions.hideModalHandler())

  }

  const actions = ["Add"]

  const showFormHandler = (item, action) => () => {
    if (action === "Edit") {
      const now = new Date();
      const meetingDate = new Date(item.dateOfMeeting);
      if (meetingDate >= now) {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '30%',
            modalLeft: '35%',
            selectedForm: (
              <MeetingTransactionPopup
                onCancel={() => dispatch(modalActions.hideModalHandler())}
                selectedItem={{ ...item }}
                tableData={EditFunction}
                data={data}
                users={users}
              />
            ),
            showModal: true,
          })
        );
      }
      else {
        AlertHandler("This meeting has already Finished. Editing is not allowed", "danger")
      }
    }

    else if (action === "Add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '27%',
          modalLeft: '37%',
          selectedForm: (
            <MeetingTransactionPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              data={data}
              tableData={AddFunc}
              users={users}
            />
          ),
          showModal: true,
        })
      );
    }

  };

  const showFormHandler1 = (item, action) => () => {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '50%',
          modalLeft: '25%',
          selectedForm: (
            <MinutesOfMeetingPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              taskType={taskType}
              taskSubType={taskSubType}
              users={users}
            />
          ),
          showModal: true,
        })
      );
  };

  const showFormHandler2 = (item, action) => () => {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '60%',
          modalLeft: '20%',
          selectedForm: (
            <ParticipantsPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              users={users}
            />
          ),
          showModal: true,
        })
      );
  };



  const showFormHandler3 = (item, action) => () => {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '25%',
          modalLeft: '36%',
          selectedForm: (
            <MeetingStatusPopup
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              setTableData={setTableData}
              tableData={EditFunction}
            />
          ),
          showModal: true,
        })
      );
  };

  const template = {
    fields: [
      {
        title: "Meeting From Date",
        type: "date",
        name: "fromDate",
        contains: "date",
        inpprops: {
          format: "dd/mm/yy",
        },
        validationProps:"Meeting From Date is Required",
      },
      {
        title: "Meeting To Date",
        type: "date",
        name: "toDate",
        contains: "date",
        inpprops: {
          format: "dd/mm/yy",
        },
      },
      {
        title: "Meeting Category",
        type: "select",
        name: "meetingGroupId",
        contains: "select",
        options: data,
        validationProps:"Meeting Category is Required",
      },
      {
        title: "Agenda",
        type: "text",
        name: "ajenta",
        contains: "text",
      },
      {
        type: "hidden",
        name: "userId",
        contains: "text",
        inpprops: {},
      },

    ]
  }
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }
  function onSubmit(values) {
    if(new Date(values.fromDate)>=new Date(values.toDate)){
      AlertHandler("Please select a valid Date Range","danger");
      return ;
    }
    const oneYearLater=new Date(values.fromDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear()+1);
    if(oneYearLater < new Date(values.toDate)){
      AlertHandler("Date range should not exceed 1 year","danger")
      return ;
    }
    searchDetails(values);
  }



  return (
    <div className={classes.container}>
      <SearchCard
        title="Meeting"
        buttonName="Add"
        onHeaderClick={showFormHandler({}, "Add")}
        bottonShow={showModal}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          buttonName="Search" />
      </SearchCard>
      <SimpleCard md={7}>
        <Table
          cols={MeetingTransactionTable(showFormHandler1, showFormHandler2, showFormHandler3, showFormHandler)}
          data={tableData}
          rows={10} />
      </SimpleCard>
    </div>
  )
}

export default MeetingTransactionSearch
