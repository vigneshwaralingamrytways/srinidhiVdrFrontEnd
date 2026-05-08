import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa'
import {
  Container,
  Form,
  Button,
  Row,
  Col

} from "react-bootstrap";


// This is the table constant/settings which needed to render table elements

export const SearchUploadTable = (showFormHandler, actions, tableTitles, loginUser) => {


  // Define which keys to include
  const getIncludedValuesOnly = ["itemOne", "itemTwo", "itemThree", "itemFour", "itemFive", "itemSix", "itemSeven", "itemEight", "itemNine", "itemTen", "itemEleven", "itemTwelve", "itemThirteen", "itemFourteen", "itemFifteen"];

  // Filter the titles based on the included values and exclude those with empty values
  const titles = tableTitles ? Object.keys(tableTitles).filter(key => getIncludedValuesOnly.includes(key) && tableTitles[key]) : [];

  // Generate dynamic columns based on the keys from tableTitles
  const intialColumns = titles.map(key => ({
    title: tableTitles[key], // Get the title for the column from tableTitles
    align: 'center',
    val: key,
    // render: rowData => <span>{rowData[key]}</span> // Render value based on key
    render: rowData => <TooltipWrapper text={rowData[key]} />
  }));


  return [
    //  {
    //       title: 'Document Type',
    //       align:'center',
    //       val:"documentTypeMaster.documentType",
    //       render: rowData => {
    //         return <span>{rowData?.documentTypeMaster?.documentType || 'N/A'}</span>;

    //       },
    //     },
    {
      title: 'Doc. Category',
      align: 'left',
      val: "folderMaster.folderCategoryName",
      render: rowData => {
        return <span>{rowData.folderMaster?.folderCategoryName}</span>;

      },
    }, {
      title: 'Doc. Sub Category',
      align: 'left',
      val: "subFolderMaster.subFolderCategoryName",
      render: rowData => {
        return <span>{rowData.subFolderMaster?.subFolderCategoryName}</span>;

      },
    }, ...intialColumns ? [...intialColumns] : [],
    {
      title: 'Created Date',
      align: 'center',
      render: rowData => {
        return <span>{rowData?.createdDate ? new Date(rowData?.createdDate)?.toLocaleDateString("en-GB") : ""}</span>;

      },
    },
    {
      title: 'Document',
      align: 'center',
      render: rowData => {
        const iconColor = parseFloat(rowData.docAvailable) === 1 ? 'green' : 'red';
        return <FaIcons.FaBook onClick={showFormHandler(rowData, actions[1])} style={{ marginLeft: '5px', cursor: "pointer", color: iconColor }}>
        </FaIcons.FaBook>
      },
    },
    // ,...(loginUser === 1) ? [ 
    //   {
    //   title: 'Edit',
    //   align:'center',
    //   render: rowData => {
    //     return  <FaIcons.FaEdit  onClick={showFormHandler(rowData,actions[2])} style={{ marginLeft: '5px',cursor:"pointer" }}>
    //     </FaIcons.FaEdit>
    // },},
    //   {
    //   title: 'Delete',
    //   align:'center',
    //   render: rowData => {
    //     return  <FaIcons.FaTrashAlt  onClick={showFormHandler(rowData,actions[3])} style={{ marginLeft: '5px',cursor:"pointer" }}>
    //     </FaIcons.FaTrashAlt>
    // },
    // },]:[],
    // /* {
    //   title: 'Created By',
    //   align:'center',
    //   render: rowData => {
    //     return <span>{rowData.createdBy}</span>;

    //   },
    // }, */
    // {
    //   title: 'Created On',
    //   align:'center',
    //   render: rowData => {
    //     return <span>{rowData.createdDate}</span>;

    //   },
    // }, 


  ]
};

// Tooltip component
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

export default SearchUploadTable;
