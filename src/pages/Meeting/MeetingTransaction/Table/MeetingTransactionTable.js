import React from 'react';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import GroupsIcon from '@mui/icons-material/Groups';
import * as FaIcons from 'react-icons/fa'

const roleId=parseInt(localStorage.getItem("roleId"))
export const MeetingTransactionTable = (showFormHandler1,showFormHandler2,showFormHandler3,showFormHandler) => {
  return [
    {
      title: 'DateOfMeeting',
      align:'left',
      render: rowData => {
        return <span>{rowData.dateOfMeeting}</span>;
      },
    },
    {
      title: 'Meeting Category',
      align:'left',
      val:"meetingCategory",
      render: rowData => {
        return (<span>{rowData?.category?.meetingCategory?rowData.category.meetingCategory : "-"}</span>);
      },
    },
    {
        title: 'Meeting Mode',
        align:'left',
        val:"meetingMode",
        render: rowData => {
          return <span>{rowData.meetingMode}</span>;
        },
      },
      {
        title: 'Agenda',
        align:'left',
        val:"ajenta",
        render: rowData => {
          return <span>{rowData.ajenta}</span>;
        },
      },
      {
        title: 'Invite Message',
        align:'left',
        val:"meetingInviteMessage",
        render: rowData => {
          return <span>{rowData.meetingInviteMessage}</span>;
        },
      },
     {
        title: 'Status',
        align:'center',
        val:"meetingStatus",
        render: rowData => {
          return <span style={{cursor:"pointer",color:'blue'}} onClick={showFormHandler3(rowData)}>{rowData.meetingStatus?rowData.meetingStatus:"Scheduled"}</span>
        },
      },
     {
        title: 'MinutesOfMeeting',
        align:'center',
        render: rowData => {
          return <span><HourglassFullIcon style={{cursor:'pointer',color:"blue"}} onClick={showFormHandler1(rowData)}/></span>;
        },
      },
      {
        title: 'Participants',
        align:'center',
        render: rowData => {
          return <span><GroupsIcon style={{cursor:'pointer',color:"blue"}} onClick={showFormHandler2(rowData)}/></span>;
        },
      },
      {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return (rowData.meetingStatus!=="Concluded"? (<span> <FaIcons.FaEdit  onClick={showFormHandler(rowData,"Edit")} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaEdit></span>):(<span style={{color:"red"}}>Cannot Edit</span>));
        },
      },
  ];
};


export default MeetingTransactionTable;