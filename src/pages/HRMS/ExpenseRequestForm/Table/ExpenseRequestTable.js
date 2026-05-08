import { blue } from '@mui/material/colors';
import React from 'react';
import * as FaIcons from 'react-icons/fa'

const roleId = parseInt(localStorage.getItem("roleId"), 10);
export const ExpenseRequestTable = (showFormHandler1) => {
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
      title: 'ExpenseType',
      align: 'left',
      val: "expenseType",
      render: rowData => {
        return <span >{rowData?.expenseType}</span>;
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
      title: 'Upload Doc',
      align: 'center',
      render: rowData => {
        return <span>  <FaIcons.FaUpload style={{ cursor: "pointer" }} onClick={showFormHandler1(rowData, "Upload")}></FaIcons.FaUpload>
        </span>
      }
    },
    {
      title: 'Approval',
      align: 'center',
      val: "approval",
      render: rowData => {
        return <span style={{ color: "blue", cursor: "pointer" }} onClick={showFormHandler1(rowData, "Approval")}>{rowData.approval}</span>;
      },
    },
    {
      title: 'Payment Status',
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


export default ExpenseRequestTable;