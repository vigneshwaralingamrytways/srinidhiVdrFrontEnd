
export const ListingDocumentMenuTable = (handleDocumentType) => {
  return [
    {
      title: 'Click on Data Room To View Documents',
      align: 'left',
      render: rowData => {
        return <span onClick={()=>handleDocumentType(rowData)} style={{ marginLeft: '5px', cursor: "pointer"}}>{rowData?.title}</span>;
      },
    }, 
    //  {
    //       title: 'View',
    //       align: 'center',
    //       render: (rowData) => {
    //         return <FaIcons.FaEye onClick={()=>handleDocumentType(rowData)} style={{ marginLeft: '5px', cursor: "pointer" }}>
    //         </FaIcons.FaEye>
    //       },
    //     },
  ]
}

export default ListingDocumentMenuTable;