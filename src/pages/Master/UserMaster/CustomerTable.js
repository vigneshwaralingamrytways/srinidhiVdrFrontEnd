import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const CustomerTable = (showFormHandler,actions) => {
  return [
    {
      title: 'User Name',
      align:'left',
      val:"userName",
      render: rowData => {
        return <span>{rowData.userName}</span>;
      
      },
    }, {
      title: 'Full Name',
      align:'left',
      render: rowData => {
        return <span>{rowData.personName}</span>;
      
      },
    },{
      title: 'Phone No',
      align:'left',
      render: rowData => {
        return <span>{rowData.phoneNo}</span>;
      },
    }, {
      title: 'Customer Email',
      align:'left',
      render: rowData => {
        return <span>{rowData.email}</span>;
      },
    },
    {
      title: 'Department',
      align:'left',
      render: rowData => {
        return <span>{rowData.department ? rowData.department.departmentName : ""}</span>;
      },
    },{
      title: 'Role',
      align:'left',
      render: rowData => {
        return <span>{rowData.role ? rowData.role.roleName : ""}</span>;
      },
    },
    // {
    //   title: 'Unit Names',
    //   align:'center',
    //   render: rowData => {
    //     return <span>{rowData.machineName}</span>;
    //   },
    // },
      {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <FaIcons.FaEdit style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[1])}></FaIcons.FaEdit>
        },
      }
  ];
};


export default CustomerTable