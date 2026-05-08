import React from 'react';
import * as FaIcons from 'react-icons/fa'
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const roleId = localStorage.getItem("roleId")
export const FileUploadTable = (showFormHandler, actions,access="false") => {
  return [
    {
      title: 'Document Name',
      align: 'left',
      render: rowData => {
        return <span>{rowData.fileName}</span>;
      },
    }, {
      title: 'Remarks',
      align: 'left',
      render: rowData => {
        return <span>{rowData.remarks}</span>;
      },
    },
    {
      title: 'View',
      align: 'center',
      render: (rowData) => {
        return <FaIcons.FaEye onClick={showFormHandler(rowData, actions[0])} style={{ marginLeft: '5px', cursor: "pointer" }}>
        </FaIcons.FaEye>
      },
    },
    ...(access?.accesRight=="View / Upload" ? [{
      title: 'Delete',
      align: 'center',
      render: (rowData) => {
        return  <FaIcons.FaTrash onClick={showFormHandler(rowData, actions[1])} style={{ marginLeft: '5px', cursor: "pointer" }}/>
      },
    },]:[]),
    ...((roleId =="1" || roleId == "2") ? [{
      title: 'Opened By',
      align: 'center',
      render: rowData => {
        return <AccessTimeIcon onClick={showFormHandler(rowData,"open")} style={{cursor:"pointer"}}/>;
      },
    },]:[]),
  ];
};

export default FileUploadTable;