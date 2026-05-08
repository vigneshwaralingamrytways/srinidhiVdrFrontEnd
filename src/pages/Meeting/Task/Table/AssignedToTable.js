import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import * as FaIcons from 'react-icons/fa'

export const AssignedToTable = (showFormHandler1,data) => {
  const enableEdit=data.some(row=>row.task.status!="Completed")
  return [
    
      {
        title: 'User',
        align:'left',
        render: rowData => {
          return <span>{rowData.users.personName}</span>;
        },
      },
      {
        title: 'User Type',
        align:'left',
        render: rowData => {
          return <span>{rowData.userType}</span>;
        },
      },
     ...(enableEdit ? [{
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <span ><FaIcons.FaEdit  onClick={showFormHandler1(rowData,"Edit")} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaEdit></span>;
        },
      },
      {
        title: 'Delete',
        align:'center',
        render: rowData => {
          return <span><DeleteIcon onClick={showFormHandler1(rowData,"Delete")} style={{cursor:"pointer",color:"red"}}/></span>
        },
      },]:[]),
  ];
};


export default AssignedToTable;