import React from 'react';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import * as FaIcons from 'react-icons/fa'

export const GroupMasterTable = (showFormHandler) => {
  return [
    {
      title: 'Meeting Category',
      align: 'left',
      val: "meetingCategory",
      render: rowData => {
        return <span>{rowData.meetingCategory}</span>;

      },
    },
    {
      title: 'Status',
      align: 'left',
      val: "status",
      render: rowData => {
        return <span>{rowData?.status == 1 ? "InActive" : rowData?.status == 0 ? "Active" : "-"}</span>;

      },
    },
    {
      title: 'Edit',
      align: 'center',
      render: rowData => {
        return <span><FaIcons.FaEdit onClick={showFormHandler(rowData, "Edit")} style={{ marginLeft: '5px', cursor: "pointer" }}>
        </FaIcons.FaEdit></span>;

      },
    },
  ];
};


export default GroupMasterTable;