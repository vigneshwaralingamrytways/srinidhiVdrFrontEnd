import React from 'react';
import * as FaIcons from 'react-icons/fa'

const roleId = parseInt(localStorage.getItem("roleId"))
export const FileUploadTable = (showFormHandler, actions,data) => {
  const enableEdit=data.some(row=>row.task.status!="Completed")
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
        return <FaIcons.FaEye onClick={showFormHandler(rowData, 'download')} style={{ marginLeft: '5px', cursor: "pointer" }}>
        </FaIcons.FaEye>


      },
    },
    ...(enableEdit ? [{
      title: 'Delete',
      align: 'center',
      render: (rowData) => {
        return <FaIcons.FaTrash onClick={showFormHandler(rowData, "delete")} style={{ marginLeft: '5px', cursor: "pointer" }}>
        </FaIcons.FaTrash>


      },
    },] : []),

  ];
};

export default FileUploadTable;