// import React, {useState} from "react";
// import {
//   Card,Button,Row,Col
//   } from "react-bootstrap";
// import classes from './Popupcard.module.css'

// function Popupcard(props) {
  

//   return (
//     <Card
//       className={classes.card} 
//       style={{
//         margin:"0px",padding:"0px",
//        }}
//     >
//    {props.title && <>
   
//     <div>
//     <Col className={classes.title}> {props.title}</Col> 
//     </div>
    
//   </>} 
//   <Card.Body className={classes.propsbody}>

//     {props.children}
//     </Card.Body>
//   </Card>
//   )
// }
// export default Popupcard
import React from "react";
import { useDispatch } from 'react-redux';
import classes from './Popupcard.module.css';
import { Card, Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import * as FaIcons from 'react-icons/fa';
import { modalActions } from '../../store/modal-Slice';


function Popupcard(props) {

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(modalActions.hideModalHandler());
  };
  return (
    <Card
      className={classes.card}
      style={{
        margin: "0px", padding: "0px",
      }}
    >
      {props.title && <>

        <div>
          <Col className={classes.title}>
            {props.title}
            <button
              className={classes.closeicon}
              onClick={handleClose}
              aria-label="Close"
            >
              <FaIcons.FaTimes />
            </button>
          </Col>
        </div>

      </>}
      <Card.Body className={classes.propsbody}>

        {props.children}
      </Card.Body>
    </Card>
  )
}
export default Popupcard
