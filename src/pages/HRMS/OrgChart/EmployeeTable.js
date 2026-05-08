import React from 'react';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';

export const EmployeeTable = (showFormHandler1) => {
  return [
    {
        title: 'Employee Name',
        align:'left',
        val:"employeeName",
        render: rowData => {
          return <span>{rowData.employeeName}</span>;
        },
      },
      {
        title: 'DOB',
        align:'center',
        render: rowData => {
          return <span >{rowData.dob}</span>;
        },
      },
      // {
      //   title: 'Edit',
      //   align:'center',
      //   render: rowData => {
      //     return <span><BorderColorIcon style={{cursor:"pointer",color:'blue'}} onClick={showFormHandler1(rowData,"Edit")}/></span>;
        
      //   },
      // },
      // {
      //   title: 'Delete',
      //   align:'center',
      //   render: rowData => {
      //     return <span><DeleteIcon style={{cursor:"pointer",color:'red'}} onClick={showFormHandler1(rowData,"Delete")}/></span>;
        
      //   },
      // },
  ];
};


export default EmployeeTable;