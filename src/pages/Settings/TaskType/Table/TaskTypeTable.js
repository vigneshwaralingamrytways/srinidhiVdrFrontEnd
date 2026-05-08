import React from 'react';
import * as FaIcons from 'react-icons/fa'

export const TaskTypeTable = (showFormHandler) => {
  return [
    {
      title: 'Task Type',
      align: 'left',
      val: "taskType",
      render: rowData => {
        return <span>{rowData.taskType}</span>;

      },
    },
    {
      title: 'Status',
      align: 'left',
      val: "status",
      render: rowData => {
        return <span>{rowData.status==1?"InActive":rowData.status==0?"Active":"-"}</span>;

      },
    },
    {
      title: 'Form Config',
      align: 'center',
      render: rowData => {
        return <FaIcons.FaFileAlt onClick={showFormHandler(rowData, "FormConfig")} style={{ marginLeft: '5px', cursor: "pointer" }}>
        </FaIcons.FaFileAlt>
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


export default TaskTypeTable;