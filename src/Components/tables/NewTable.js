import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./table.module.css";
import { Col, Row } from "react-bootstrap";
import { IconContext } from "react-icons/lib";
import "bootstrap/dist/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import MUITable from "@mui/material/Table/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import { useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { CheckBox } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import TableHead from "@mui/material/TableHead";
import { styled } from "@mui/material/styles";
import SearchBox from "../../NewComponent/SearchBox";





const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: "#f5f5f5",
    },
  }));
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      borderBottom: "1px solid #B1BFC3",
    },
  }));

const NewTable = ({
  cols,
  data,
  rows,
  loadDataonPageChange,
  counts,
  className,
  includeCheck,
  checkBoxEvent,
  styles,filterFields, 
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows ? rows : 10);
  const [rowsOptions,setRowsOptions] = React.useState(rows<10 ? [5,10,25,50,100] : [10,25,50,100])
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    
  };
  const dynamicStyles = typeof styles === "undefined" ? {} : styles;
  const alignCenter = "center";



  const [searchQuery, setSearchQuery] = useState("");
  
  // Common utility function to filter data based on a search query
 const filterData = (data, searchQuery, filterFields) => {
  if (!searchQuery) {
    return data;
  }

  const query = searchQuery.toLowerCase();
  return data.filter((item) => {
    for (const field of filterFields) {
      const fieldValue = getValueByPath(item, field)?.toString().toLowerCase();
      if (fieldValue && fieldValue.includes(query)) {
        return true;
      }
    }
    return false;
  });
};

// Helper function to get nested object values based on the field path
const getValueByPath = (obj, path) => {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      break;
    }
  }

  return value;
};
// Update the search query state based on user input
  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
  };
  const filteredOrders = filterData(data, searchQuery, filterFields);
 //new code for table sticky start
 /*
  const [columnWidths, setColumnWidths] = useState({
    firstColumnWidth: 0,
    secondColumnWidth: 0,
  });
 const { firstColumnWidth } = columnWidths;
  const { secondColumnWidth } = columnWidths;
   useEffect(() => {
  const calculateColumnWidths = () => {
      const firstColumn = document.querySelector(
        `.${tableCellClasses.head}:nth-child(1)`
      );
      const secondColumn = document.querySelector(
        `.${tableCellClasses.head}:nth-child(2)`
      );
  if (firstColumn && secondColumn) {
        const firstColumnWidth = firstColumn.offsetWidth;
        const secondColumnWidth = secondColumn.offsetWidth;
  setColumnWidths({
          firstColumnWidth,
          secondColumnWidth,
        });
 // console.log("First Column Width:", firstColumnWidth, "px");
   //     console.log("Second Column Width:", secondColumnWidth, "px");
      }
    }; // Calculate column widths after the component has been rendered
   calculateColumnWidths();
  // Add a resize event listener to recalculate widths if the window is resized
    window.addEventListener("resize", calculateColumnWidths);
  // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", calculateColumnWidths);
    };
  }, [data]); 
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "rgb(0, 92, 185);",
      color: theme.palette.common.white, 
      border: "1px solid #B1BFC3",
      zIndex:4,
      " &:nth-child(1), &:nth-child(2), &:nth-child(3)" :{
        position: firstColumnWidth ? "sticky" : "",
        left: 0,
        //backgroundColor: "rgb(0, 92, 185)",
        zIndex: 5,
      },
      "&:nth-child(2)": {left: firstColumnWidth ? `${firstColumnWidth}px` : 0,},
      "&:nth-child(3)": {left: secondColumnWidth ? `${firstColumnWidth + secondColumnWidth -1}px` : 0,},
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      backgroundColor: "#f2f2f2", 
      border: "1px solid #B1BFC3",
      zIndex:2,
     " &:nth-child(1), &:nth-child(2), &:nth-child(3)" :{
        position: firstColumnWidth ? "sticky" : "",
        left: 0,
        //backgroundColor: "rgb(0, 92, 185)",
        zIndex: 2,
      },
      "&:nth-child(2)": {left: firstColumnWidth ? `${firstColumnWidth}px` : 0,},
     "&:nth-child(3)": {left: secondColumnWidth ? `${firstColumnWidth + secondColumnWidth -1}px` : 0,},
   }, }));
    */
 // new code for table sticky end

  return (  
    <IconContext.Provider value={{ color: "#6495ED" }}>
      <Row className={`${classes.tableContainer} ${className}`} style={{
          ...dynamicStyles?.tablehead,
          ...(dynamicStyles?.tablehead ? {} : { background: "transparent" }),
        }}>
        <Paper className={classes.tableContainer} >
        <Row className={`justify-content-center align-items-center`}
         style={{ backgroundColor: 'white', minMargin  :'0 10px 10px 10px' }}>
            { filterFields &&
              <Col>
              <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => handleSearchInputChange(e.target.value)}
    />
               </Col>
            }
<Col>
{ rows &&
            <TablePagination stickyHeader sx={{padding:'0px',margin:'0px',
            '.MuiTablePagination-selectLabel':{margin:'0px'},
        '.MuiTablePagination-displayedRows':{margin:'0px'}
    }}
        rowsPerPageOptions={rowsOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        SelectProps={{
            inputProps: {
              'aria-label': 'rows per page'
            },
            native: true,
          }}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}                                                                                                                                           
        className = {classes.pagination}
      />}
</Col>
            </Row> 
         
        <TableContainer
  style={{
    maxHeight: "500px", // Adjust the height as needed
    maxWidth: "100%", // Set the maximum width to 200px
    overflowY: "auto",
    overflowX: "auto",
  }}
  className={classes.tableStyles}
>

          
          <div style={{
          ...dynamicStyles?.table,
          ...(dynamicStyles?.table ? {} : { background: "transparent" }),
        }}className={classes.tableBody}>
            <MUITable  stickyHeader className={`table table-bordered table-striped ${classes.table}`}>
               <TableHead>                <TableRow>
                {includeCheck &&  <StyledTableCell align={alignCenter}>{<input type="checkbox" />}</StyledTableCell>}
                  <StyledTableCell align={alignCenter}>S.No</StyledTableCell>
                  {cols.map((headerItem, index) => (
                    <StyledTableCell key={index} align={alignCenter}>
                      {headerItem.title}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead> 
              {filteredOrders && (
                  <TableBody >
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <StyledTableRow key={index++}>
                      {includeCheck &&  <StyledTableCell align={alignCenter}>{<input type="checkbox" onClick={e=>{checkBoxEvent(item,e.target.checked) }}/>}</StyledTableCell>}
                        <StyledTableCell>{page * rowsPerPage+index+1}</StyledTableCell>
                        {cols.map((col, key) => (
                          <StyledTableCell
                            key={key}
                            align={col.align}
                            className={col.hover && classes.hoverclass}
                          >
                            {col.render(item)}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                </TableBody>
              )}    
            </MUITable> </div>
            
          </TableContainer>
        </Paper>
      </Row>
      
    </IconContext.Provider>
  );
};

NewTable.propTypes = {
  cols: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  striped: PropTypes.bool,
  isDark: PropTypes.bool,
};

NewTable.defaultProps = {
  bordered: true,
  hoverable: false,
  striped: false,
  isDark: false,
};

export default NewTable;
