// import React, { Fragment } from 'react';
// import ReactDOM from 'react-dom';

// import classes from './Modal.module.css';

// const Backdrop = (props) => {
//   return <div className={classes.backdrop} onClick={props.onClose}/>;
// };

// const ModalOverlay = (props) => {
  
  
//   return (
//     <div className={classes.modal} style={props.width && props.left ? { width: props.width, left: props.left } : {width:"58%",left:"21"}}>
//       <div className={classes.content}>{props.children}</div>
//     </div>
//   );
// };

// const portalElement = document.getElementById('overlays');

// const Modal = (props) => {
//   return (
//     <Fragment>
//       {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
//       {ReactDOM.createPortal(
//         <ModalOverlay width={props.width} left={props.left}>{props.children}</ModalOverlay>,
//         portalElement
//       )}
//     </Fragment>
//   );
// };

// export default Modal;


import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import classes from './Modal.module.css';

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const style = !isMobile
  ? (props.width && props.left
      ? { width: props.width, left: props.left }
      : { width: "58%", left: "18%" })
  : { maxWidth: "62%", left: "7%" };


  return (
    <div className={classes.modal} style={style}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.backdropOnClose ? props.onClose : undefined} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay width={props.width} left={props.left}>
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;