import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import * as FaIcons from 'react-icons/fa'

export const ParticipantsTable = (showFormHandler,data) => {
  const enableEdit=data.some(row=>row.meetingTransaction.meetingStatus!="Concluded")
  return [
    {
      title: 'Participant Name',
      align:'left',
      render: rowData => {
        return <span>{rowData.participantName }</span>;
      },
    },
     
      {
        title: 'Participant Email',
        align:'left',
        render: rowData => {
          return <span>{rowData.participantEmailId}</span>;
        },
      },
      ...(enableEdit ? [{
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <span><FaIcons.FaEdit  onClick={showFormHandler(rowData,"Edit")} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaEdit></span>;
        
        },
      },
      {
        title: 'Delete',
        align:'center',
        render: rowData => {
          return <span><DeleteIcon style={{cursor:"pointer",color:'red'}} onClick={showFormHandler(rowData,"Delete")}/></span>;
        
        },
      },]:[]),
  ];
};


export default ParticipantsTable;