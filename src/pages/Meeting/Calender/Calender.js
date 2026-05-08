import { Alert, Button, DialogActions, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Scheduler from 'react-mui-scheduler';
import api from '../../../Api';
import { useFetch } from 'use-http';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../../store/alert-slice';
import { modalActions } from '../../../store/modal-Slice';
import AddNewMeeting from "./AddNewMeeting";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css'

const MAX_EVENT_LENGTH = 2;

export default function Calender() {
  const { get, post, response, loading, error, del } = useFetch({ data: [] });
  const [state] = useState({
    options: {
      transitionMode: "zoom", // or fade
      startWeekOn: "mon", // or Sun
      defaultMode: "month", // or week | day | timeline
      minWidth: 850,
      maxWidth: 850,
      minHeight: 570,
      maxHeight: 570,

    },
    alertProps: {
      open: false,
      color: "info", // info | success | warning | error
      severity: "info", // info | success | warning | error
      message: "🚀 Let's start with awesome react-mui-scheduler 🔥 🔥 🔥",
      showActionButton: false,
      showNotification: false,
      delay: 1500
    },
    toolbarProps: {

      showSwitchModeButtons: true,
      showDatePicker: true
    }
  });
  const credentials = localStorage.getItem('roleId');
  const [events, setEvents] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [users, setUsers] = useState([{ value: "", label: "Select" }])
  const [data, setData] = useState([{ value: "", label: "Select" }])
  const [loadingState, setLoadingState] = useState(true)
  const [allEventsVisible, setAllEventsVisible] = useState(false)
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
    loadInitialData();
  }, [])

  const loadInitialData = useCallback(async () => {
    try {
      const roleId=parseInt(localStorage.getItem("roleId"));
      const userId=parseInt(localStorage.getItem("userId"))
      const orderApi=roleId==1?"/meetingTransaction/getAllMeeting":`/meetingTransaction/getAllMeetingByUserId/${userId}`
      const obj = await post(api + orderApi, { "id": Math.random() });
      if (response.ok) {
        const formatedEvents = obj.map((prev) => {
          let [date, time] = prev.dateOfMeeting.split('T');
           time= time.split(':')
           if(Number(time[0])>12) time=(Number(time[0])-12).toString().padStart(2,"0")+":"+time[1]+" PM"
           else if(Number(time[0]==12)) time=time[0]+":"+time[1]+" PM"
           else if(Number(time[0]>0) && Number(time[0]<10)) time= "0"+time[0]+":"+time[1]+" AM"
           else time= time[0]+":"+time[1]+" AM"
          return {
            id: prev.meetingTransactionId,
            label: prev.category.meetingCategory,
            dateOfMeeting: prev.dateOfMeeting,
            meetingCategory: prev.category.meetingCategory,
            meetingMode: prev.meetingMode,
            ajenta: prev.ajenta,
            meetingInviteMessage: prev.meetingInviteMessage,
            meetingStatus: prev.meetingStatus,
            meetingGroupId: prev.meetingGroupId,
            date: date,
            startHour:time,
            createdBy:parseInt(localStorage.getItem("userId")),
            createdAt: new Date(),
          };
        })
        setEvents([...formatedEvents]);
      }

      const obj1 = await post(api + "/meetingCategory/getAllMeetingCategory", { "id": Math.random() });
      if (response.ok) {
        const formatedData = obj1.map(({ meetingGroupId, meetingCategory }) => ({
          value: meetingGroupId,
          label: meetingCategory,
        }))

        setData([...data, ...formatedData]);
      }
      const obj2 = await get(api + "/users/users");
      if (response.ok) {
        const formatedData1 = obj2.map(({ userId, personName }) => ({
          value: userId,
          label: personName,
        }))
        setUsers([...users, ...formatedData1])
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoadingState(false);
    }
  }, [])

  const preprocessEvent = (event) => {
    const groupedEvents = {};
    event.forEach(ev => {
      const date = new Date(ev.date).toDateString();
      if (!groupedEvents[date]) {
        groupedEvents[date] = []
      }
      groupedEvents[date].push(ev)
    });
    const limitedEvent = [];
    Object.keys(groupedEvents).forEach(date => {
      const dayEvents = groupedEvents[date];
      if (dayEvents.length > MAX_EVENT_LENGTH) {
        limitedEvent.push(...dayEvents.slice(0, MAX_EVENT_LENGTH))
        limitedEvent.push({
          id: `more-${date}`,
          label: `+${dayEvents.length - MAX_EVENT_LENGTH} more details`,
          date: dayEvents[0].date,
          color: '#ff9800',
          placeholder: true,
        })
      }
      else {
        limitedEvent.push(...dayEvents);
      }
    })
    return limitedEvent;
  }

  const displayAllEvents = allEventsVisible ? events : preprocessEvent(events);
  const [filteredData, setFilteredData] = useState([])
  const [selecteDate, setSelectedDate] = useState(null);

  const handleEventClick = (event, item) => {
    if (event.placeholder) { }
    const filtered = events.filter((filter) => filter.date === item.date);
    setSelectedDate(item ? item.date : null)
    setOpenPopup(true)
    setFilteredData(filtered)
  };

  const AddFunc = (createNewData) => {
    setEvents([...events, createNewData]);
  }

  const editFunc = (updatedData) => {
    const UpdatedTableData = events
      .map((inv) =>
        inv.id === updatedData.id
          ? updatedData
          : inv);

    setEvents(UpdatedTableData);
  }

  const [view, setView] = useState(false);
  const [mId, setMId] = useState(0);
  const [newObj, setNewObj] = useState(null)

  const handleView = (meetingId) => {
    const filter = events.filter(prev => prev.id === meetingId);
    setNewObj(filter)
    setView(true);
    setMId(meetingId);
  }

  const handleEdit = () => {
      const now = new Date();
      const meetingDate = new Date(newObj[0].dateOfMeeting);
      if (meetingDate >= now) {
        newObj[0].meetingTransactionId=newObj[0].id
        dispatch(
          modalActions.showModalHandler({
            selectedData: {},
            modalWidth: '40%',
            modalLeft: '30%',
            selectedForm: (
              <AddNewMeeting
                onCancel={() => dispatch(modalActions.hideModalHandler())}
                data={data}
                users={users}
                tableData={editFunc}
                mId={mId}
                setMId={setMId}
                selectedItem={newObj[0]}
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

  const handleAddEvent = () => {
    dispatch(
      modalActions.showModalHandler({
        selectedData: {},
        modalWidth: '40%',
        modalLeft: '30%',
        selectedForm: (
          <AddNewMeeting
            onCancel={() => dispatch(modalActions.hideModalHandler())}
            data={data}
            users={users}
            tableData={AddFunc}
          />
        ),
        showModal: true,
      })
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', gap: '20px', alignItems: 'flex-start', backgroundColor: '#f9f9ff9', border: '2px solid #ddd', borderRadius: '8px', width: '100vw' }}>
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {loadingState ? (<p>Loading...</p>) : (<>
            <Button variant="contained" color='primary' onClick={handleAddEvent}>
              Add Meeting
            </Button>
            <Scheduler
              events={displayAllEvents}
              legacyStyle={false}
              options={state?.options}
              alertProps={state?.alertProps}
              toolbarProps={state?.toolbarProps}
              onTaskClick={handleEventClick}
            /></>)}
        </div>
        <div style={{ flex: 0.5, padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', color: 'red', paddingTop: '10px' }}>Meeting Schedule {selecteDate && `- ${selecteDate}`} </h1>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {
              filteredData.map((meeting) => (
                <li key={meeting.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between'
                    , alignItems: 'center', padding: '10px', borderBottom: '2px solid #ddd'
                  }}
                >
                  <strong>{meeting.ajenta}</strong> {"-"}
                  <strong>{meeting.startHour}</strong>
                  <RemoveRedEyeIcon style={{ cursor: "pointer", color: 'blue' }} onClick={() => handleView(meeting.id)} />
                </li>
              ))
            }
          </ul>
        </div>
      </div>


      {view && (<>
        <Modal show={view} onHide={() => setView(false)}>
          <Modal.Header closeButton  style={{position:"relative"}}>
            <Modal.Title style={{ color: 'blue',position:"absolute",left:"175px" }}>Meeting </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul style={{ listStyle: 'none', padding: '0' }}>
              <li style={{ marginBottom: '10px', padding: '5px 10px' }}><strong>Date Of Meeting - </strong> {newObj[0].date} ||  <strong>    Time - {newObj[0].startHour}</strong></li>
              <li style={{ marginBottom: '10px', padding: '5px 10px' }}><strong>Meeting Category - </strong> {newObj[0].label}</li>
              <li style={{ marginBottom: '10px', padding: '5px 10px' }}><strong>Meeting Status - </strong> {newObj[0].meetingStatus}</li>
              <li style={{ marginBottom: '10px', padding: '5px 10px' }}><strong>Meeting Agenda - </strong> {newObj[0].ajenta}</li>
              <li style={{ marginBottom: '10px', padding: '5px 10px' }}><strong>Invite Message - </strong> {newObj[0].meetingInviteMessage}</li>
              <li style={{ marginBottom: '10px', padding: '5px 10px' }}><strong>Meeting Mode - </strong> {newObj[0].meetingMode}</li>

            </ul>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={() => { handleEdit(); setView(false) }} style={{ backgroundColor: '#007bff', color: '#ffff', border: 'none', padding: '5px 10px', fontSize: '14px', marginRight: '10px' }}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => setView(false)} style={{ backgroundColor: 'red', color: '#ffff', border: 'none', padding: '5px 10px', fontSize: '14px', marginRight: '5px' }}>
              Close
            </Button>

          </Modal.Footer>
        </Modal>
      </>)}
    </>
  );
}



