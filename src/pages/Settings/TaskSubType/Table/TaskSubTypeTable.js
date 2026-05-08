import React from 'react';
import * as FaIcons from 'react-icons/fa'

export const TaskSubTypeTable = (showFormHandler) => {
  return [
    {
      title: 'Task Type',
      align: 'left',
      val: "taskType",
      render: rowData => {
        return <span>{rowData?.taskType?.taskType}</span>;

      },
    },
    {
      title: 'Task SubType',
      align: 'left',
      val: "taskSubType",
      render: rowData => {
        return <span>{rowData.taskSubType}</span>;

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


export default TaskSubTypeTable;