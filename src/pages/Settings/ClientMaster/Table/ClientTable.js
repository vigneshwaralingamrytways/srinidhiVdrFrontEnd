import React from 'react';
import * as FaIcons from 'react-icons/fa'

export const ClientTable = (showFormHandler) => {
  return [
    {
      title: 'Client Name',
      align: 'left',
      val: "clientName",
      render: rowData => {
        return <span>{rowData.clientName}</span>;

      },
    },
    {
      title: 'Status',
      align: 'left',
      val: "status",
      render: rowData => {
        return <span>{rowData?.status?rowData?.status:"-"}</span>;

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


export default ClientTable;