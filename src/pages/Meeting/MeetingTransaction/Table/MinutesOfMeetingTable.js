import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Assignment } from '@mui/icons-material';
import * as FaIcons from 'react-icons/fa'

export const MinutesOfMeetingTable = (showFormHandler1,data) => {
  const enableEdit=data.some(row=>row.meetingTransaction.meetingStatus!="Concluded")
  return [
    {
        title: 'Minutes Of Meeting',
        align:'left',
        render: rowData => {
          return <span>{rowData.minuteOfMeeting}</span>;
        },
      },
      {
        title: 'CheckItIsTask',
        align:'center',
        render: rowData => {
          return rowData.meetingTransaction.meetingStatus!="Concluded"?(<span style={{cursor:"pointer"}} >{rowData.checkItIsTask==="ItIsTask" ? (<Assignment onClick={showFormHandler1(rowData,"showPopup")}/>):("ItIsNotTask")}</span>):<span>{rowData.checkItIsTask}</span>;
        },
      },
      ...(enableEdit ? [{
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <span><FaIcons.FaEdit  onClick={showFormHandler1(rowData,"Edit")} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaEdit></span>;
        },
      },
      {
        title: 'Delete',
        align:'center',
        render: rowData => {
          return <span><DeleteIcon style={{cursor:"pointer",color:'red'}} onClick={showFormHandler1(rowData,"Delete")}/></span>;
        
        },
      },]:[]),
  ];
};


export default MinutesOfMeetingTable;