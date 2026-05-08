import React from 'react';

export const DocumentAccessHistoryTable = () => {
  return [
    {
      title: 'User Name',
      align: 'left',
      render: rowData => {
        return <span>{rowData?.users?.personName}</span>;
      },
    }, {
      title: 'Access Time',
      align: 'left',
      render: rowData => {
        return <span>{rowData.accessTime}</span>;
      },
    },
    {
        title: 'Document',
        align: 'left',
        render: rowData => {
          return <span>{rowData?.reportDocument?.fileName}</span>;
        },
      },
  ];
};

export default DocumentAccessHistoryTable;