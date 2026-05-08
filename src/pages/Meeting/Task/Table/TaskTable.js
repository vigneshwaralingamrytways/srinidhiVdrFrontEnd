import React, { useState } from 'react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CommentIcon from '@mui/icons-material/Comment';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import * as FaIcons from 'react-icons/fa'

const roleId=parseInt(localStorage.getItem("roleId"));
export const TaskTable = (showFormHandler1,showFormHandler2,showFormHandler,tableTitles) => {
   
 // Define which keys to include
 const getIncludedValuesOnly = ["itemOne", "itemTwo", "itemThree", "itemFour", "itemFive", "itemSix", "itemSeven", "itemEight", "itemNine", "itemTen", "itemEleven", "itemTwelve", "itemThirteen", "itemFourteen", "itemFifteen","itemSixteen","itemSeventeen"];

 // Filter the titles based on the included values and exclude those with empty values
 const titles = tableTitles ? Object.keys(tableTitles).filter(key => getIncludedValuesOnly.includes(key) && tableTitles[key]) : [];

 // Generate dynamic columns based on the keys from tableTitles
 const intialColumns = titles.map(key => ({
   title: tableTitles[key], // Get the title for the column from tableTitles
   align: 'center',
   val:key,
  // render: rowData => <span>{rowData[key]}</span> // Render value based on key
  render: rowData => <TooltipWrapper text={rowData[key]} />
 }));
  return [
    {
        title: 'Start Date',
        align:'left',
        render: rowData => {
          return <span>{rowData.startDate}</span>;
        },
      },
      {
        title: 'Client Name',
        align:'left',
        val:"clientName",
        render: rowData => {
          return <span>{rowData?.clientMaster?.clientName}</span>;
        },
      },
      {
        title: 'Task Type',
        align:'left',
        val:"taskType",
        render: rowData => {
          return <span>{rowData.taskTypeClass.taskType}</span>;
        },
      },
      {
        title: 'Task SubType',
        align:'left',
        val:"taskSubType",
        render: rowData => {
          return <span>{rowData.taskSubTypeClass.taskSubType}</span>;
        },
      },
      {
        title: 'Description',
        align:'left',
        val:"description",
        render: rowData => {
          return <span>{rowData.description}</span>;
        },
      },
      {
        title: 'ExpectedEndDate',
        align:'left',
        render: rowData => {
          return <span>{rowData.expectedEndDate}</span>;
        },
      },...intialColumns ? [...intialColumns]:[],
      {
        title: 'Status',
        align:'center',
        val:"status",
        render: rowData => {
          return  <span onClick={showFormHandler1(rowData)} style={{cursor:"pointer",color:'blue'}}>{rowData.status?rowData.status:"YetToStart"}</span>
        },
      },
      {
        title: 'Actual End Date',
        align:'center',
        render: rowData => {
          return <span>{rowData.actualEndDate?rowData.actualEndDate:"   -  "}</span>;
        },
      },
      {
        title: 'AssignedTo',
        align:'center',
        render: rowData => {
          return (<span>{rowData?.user ? <span onClick={showFormHandler2(rowData)}style={{color:'green',cursor:'pointer'}}>{rowData?.user?.personName}</span> : <ManageAccountsIcon style={{cursor:"pointer"}} onClick={showFormHandler2(rowData)}/>}</span>);
        },
      },
      {
        title: 'Upload',
        align:'center',
        render: rowData => {
          return  <DriveFolderUploadIcon  onClick={showFormHandler(rowData,"upload")} style={{ marginLeft: '5px',cursor:"pointer",color:"green"}}>
          </DriveFolderUploadIcon>
      },
    },
    {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return rowData?.status!="Completed" ?<span><FaIcons.FaEdit  onClick={showFormHandler(rowData,"Edit")} style={{ marginLeft: '5px',cursor:"pointer" }}>
          </FaIcons.FaEdit></span>:<span style={{ marginLeft: '5px',color:"red"}}>Cannot Edit</span>;
        
        },
      },
      {
        title: 'Notes',
        align:'center',
        render: rowData => {
          return <span><CommentIcon style={{cursor:"pointer",color:'blue'}} onClick={showFormHandler(rowData,"comment")}/></span>;
        
        },
      },
  ];
};

const TooltipWrapper = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Function to split text into chunks of 75 characters
  const splitTextIntoLines = (str, maxLength) => {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return str.match(regex) || [];
  };

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <span>{text && text.length > 50 ? `${text.substring(0, 50)}...` : text}</span>
      {showTooltip && (
        <div style={tooltipStyle}>
          {splitTextIntoLines(text, 50).map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Tooltip style
const tooltipStyle = {
  position: 'absolute',
  bottom: '100%', // Position above the text
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#333',
  color: '#fff',
  padding: '5px',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  zIndex: 1000,
};


export default TaskTable;