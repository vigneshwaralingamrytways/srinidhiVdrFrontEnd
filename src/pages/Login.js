import React,{useState} from "react";
import "bootstrap/dist/css/bootstrap.css";
import classes from "./Login.module.css";

import { useHistory } from "react-router-dom";
import Loginimg from "../images/sreepathylogin.jpg";
import ForgotPassword from "./ChangePassword/ForgotPassword"
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Modal as ModalBoots,
  // InputGroup,
  // FormControl
} from "react-bootstrap";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import AuthContext from "../store/auth-context";
import { ModulesData } from "./Modules/ModulesData";
import LoginForm from "./LoginForm";
import useFetch, { Provider } from "use-http";
import api from "../Api";
import { alertActions } from "../store/alert-slice";
import { useSelector, useDispatch } from "react-redux";
import { ui } from "../Api";

import { modalActions } from "../store/modal-Slice";
//import {history} from '../index'

var sectionStyle = {};


function Login() {
  const [showModal, selectedForm, selectedData] = useSelector((state) => [
    state.modalProps.showModal,
    state.modalProps.selectedForm,
    state.modalProps.selectedData,
  ]);
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const { get, post, response, loading, error } = useFetch({ data: [] });
  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };
  const dispatch = useDispatch();
  const [showForgotPassword,setShowForgotPassword] = useState(false)
  const isLoggedIn = authCtx.isLoggedIn;

  const initState = {
    email: "",
    password: "",
  };

  // eslint-disable-next-line no-unused-vars
  const [initialValues, setInitialValues] = React.useState(initState);

  // const onSubmit = async (values) => {
  //   const loginapi = "/login/signin";
  //   const returnObject = await post(api + loginapi, values);

  //   console.log("login Page api",api)
  //   console.log("ret",returnObject);
  //   if (returnObject.token) {
  //     authCtx.login(
  //       returnObject.accessToken,
  //       returnObject.timeOut,
  //       returnObject.roleId,
  //       returnObject.userId,
  //       returnObject.token,
  //       returnObject.userName,
  //       returnObject.machineName,
  //       returnObject.userType,
  //     );
  //     history.push("/processModule");
  //   //  returnObject.roleId && returnObject.roleId != "1" ?  history.push("/search") : history.push("/modules");

  //   } else {
  //     AlertHandler("Incorrect Username and Password", "danger");
  //   }
  // };

  const onSubmit = async (values) => {
  const loginapi = "/login/signin";
  const returnObject = await post(api + loginapi, values);

  console.log("login Page api", api);
  console.log("ret", returnObject);

  if (returnObject.token) {
    authCtx.login(
      returnObject.accessToken,
      returnObject.timeOut,
      returnObject.roleId,
      returnObject.userId,
      returnObject.token,
      returnObject.userName,
      returnObject.machineName,
      returnObject.userType,
    );

    // ? Route based on role: "1" = Admin, anything else = User
    if (String(returnObject.roleId )=== "1") {
      history.push("/processModule");   // Admin path
    } else {
      history.push("/userDashboard");   // User path  change this to your actual route
    }

  } else {
    AlertHandler("Incorrect Username and Password", "danger");
  }
};

  const onError = (error) => {
    console.log("ERROR:::", error);
  };

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    // reValidateMode: "onChange",
    // defaultValues: defaultValues
  });

  // const x = JSON.stringify(data);
  // const y = JSON.stringify(listShow);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(">>", value, name, type);
      // {1: '1', 2: '9'} '2' 'change'
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const  resetPassword = async (user)=>{
    const forgotPass = await post(api+'/reset-password/forgot_password', user)
    console.log("new",forgotPass)
    if (response.ok) {
      setShowForgotPassword()
        AlertHandler("Password Reset email sent successfully.","success")
    }else{
      AlertHandler("Unable to Reset password try again later","danger")
    }
  }

 
  const handleForgotPasswordClick = async () => {
    //const emailValue = getValues("username"); // Get the value of the email input field

    //const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setShowForgotPassword(!showForgotPassword)
  };
  return (
    <Row
      className={classes.main}
      
    >
  <ModalBoots show={showForgotPassword} onHide={() => handleForgotPasswordClick()}>
        
        <ForgotPassword
            onSubmit={resetPassword}
            onCancel={()=>handleForgotPasswordClick()}
          /> 
      </ModalBoots>
  <Row
      className={classes.submain}
      
    >
<div     className={classes.leftSection}>
<Row className={classes.emptyspace}>
            <div className={classes.companyName}>
              <p className={classes.mainTitle}> </p>
              {/* <p className={classes.subTitleOne}> Srinidhi Digital Repository </p> */}
              {/* <p className={classes.subTitleTwo}> (  Investor Portal ) </p> */}
            </div>
          </Row>

</div>



        <div className={classes.rightSection}
   
      >
       <dv className={classes.stripe}>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              style={{ margin: 0 }}
              className={classes.loginform}
            >
              <h3 className={classes.login}>Login</h3>
              <Form.Group
                className={classes.forminside}
                controlId="formBasicEmail"
              >
                <Form.Label className={classes.labl}>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Your User Name"
                  className={classes.myformCustominput}
                  {...register("username", {
                    required: "UserName is required",
                  })}
                />
                {errors.email && (
                  <Form.Text className="text-danger">
                    {errors.email.message}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group
                className={classes.forminside}
                controlId="formBasicPassword"
              >
                <Form.Label className={classes.labl}>Password</Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Password"
                  className={classes.myformCustominput}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <Form.Text className="text-danger">
                    {errors.password.message}
                  </Form.Text>
                )}
              </Form.Group>
              <div  className={classes.formFooter}>
                <div
                 className={classes.forgot}
                  
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password
                </div>{" "}
                <div>
                  {" "}
                  <Button type="submit" className={classes.bttn}>
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </dv>
        
        </div>
    
    </Row>
    </Row>
  );
}

export default Login;
