import { blue } from '@mui/material/colors';
import React from 'react';
import * as FaIcons from 'react-icons/fa'

const roleId=parseInt(localStorage.getItem("roleId"),10);
export const LeaveRequestTable = (showFormHandler1) => {
  return [
    {
      title: 'Request Date',
      align: 'center',
      render: rowData => {
        return <span >{rowData.requestDate}</span>;
      },
    },
    {
      title: 'Employee Name',
      align: 'left',
      val: "employeeName",
      render: rowData => {
        return <span>{rowData.employeeName}</span>;
      },
    },
    {
      title: 'Leave From Date',
      align: 'center',
      render: rowData => {
        return <span >{rowData.fromDate}</span>;
      },
    },
    {
      title: 'Leave To Date',
      align: 'center',
      render: rowData => {
        return <span >{rowData.toDate}</span>;
      },
    },
    {
      title: 'No Of Days',
      align: 'right',
      render: rowData => {
        return <span >{rowData.noOfDays}</span>;
      },
    },
    {
      title: 'LeaveType',
      align: 'left',
      val: "leaveType",
      render: rowData => {
        return <span >{rowData?.leaveType==1?"Casual Leave":rowData?.leaveType==2?"Sick Leave":rowData?.leaveType==3?"Emergency Leave":rowData?.leaveType==4?"Study Leave":rowData?.leaveType==5?"Special Leave":""}</span>;
      },
    },
    {
      title: 'Reason',
      align: 'left',
      val: "reason",
      render: rowData => {
        return <span >{rowData.reason}</span>;
      },
    },
    {
      title: 'Remarks',
      align: 'left',
      val: "remarks",
      render: rowData => {
        return <span >{rowData.remarks}</span>;
      },
    },
    {
      title: 'Approval',
      align: 'center',
      val: "approval",
      render: rowData => {
        return <span style={{color:"blue",cursor:"pointer"}} onClick={showFormHandler1(rowData, "Approval")}>{rowData.approval}</span>;
      },
    },
    {
      title: 'Status',
      align: 'center',
      val: "status",
      render: rowData => {
        return <span  >{rowData.status}</span>
      },
    },

    {
      title: 'Edit',
      align: 'center',
      render: rowData => {
        return <FaIcons.FaEdit style={{ cursor: "pointer" }} onClick={showFormHandler1(rowData, "Edit")}></FaIcons.FaEdit>
      },
    },
    // {
    //   title: 'Delete',
    //   align:'center',
    //   render: rowData => {
    //     return <span><DeleteIcon style={{cursor:"pointer",color:'red'}} onClick={showFormHandler1(rowData,"Delete")}/></span>;

    //   },
    // },
  ];
};


export default LeaveRequestTable;