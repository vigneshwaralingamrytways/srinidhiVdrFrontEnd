import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Popupcard,PopupSimpleCard,Table,CreateForm,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider  
  } from '../../../Components/CommonImports/CommonImports'
import {Tree} from "react-d3-tree"
import EmployeeData from "./EmployeeData";

const OrgCharts=()=>{

 const { get, post, response, loading, error,del } = useFetch({ data: [] });
 const [data,setData]=useState([]);
 const [translate,setTranslate]=useState({x:0,y:0});
 const treeContainerRef=useRef(null)

 const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
     state.alertProps.showAlert,
     state.alertProps.alertMessage,
     state.alertProps.alertVariant,
   ]);
 
   const [showModal, selectedForm, selectedData, modalWidth, modalLeft] = useSelector((state) => [
     state.modalProps.showModal,
     state.modalProps.selectedForm,
     state.modalProps.selectedData,
     state.modalProps.modalWidth,
     state.modalProps.modalLeft,
   ]);
 
   const dispatch = useDispatch();
   const AlertHandler = (alertContent, alertType) => {
     dispatch(
       alertActions.showAlertHandler({
         showAlert: !showAlert,
         alertMessage: alertContent,
         alertVariant: alertType,
       })
     );
   };


 useEffect(()=>{
  if(treeContainerRef.current && data.length>0){
    const {offsetWidth,offsetHeight} = treeContainerRef.current;
    setTranslate({x:offsetWidth/1.75,y:offsetHeight/13})
  }
},[data]);

 const loadInitialData=useCallback(async()=>{
   const obj=await post(api+"/orgChart/getAllDesignation",{"id":Math.random()});
   if(response.ok)
      setData(transformData(obj))
 },[]);

 useEffect(()=>{
  loadInitialData();
},[loadInitialData]);

 const transformData=(data)=>{
  return data.map(item=>({
    name:item.designation,
    chartId:item.chartId,
    noOfMaxPosition:item.noOfMaxPosition,
    filledUp:item.filledUp,
    toolTip:item.toolTip,
    children:item.children?transformData(item.children):[]
  }))
 }

 const openPopup=(chart)=>{
  dispatch(
    modalActions.showModalHandler({
      selectedData: {},
       modalWidth: '40%',
       modalLeft: '30%',
       selectedForm: (
           <EmployeeData
             onCancel={()=>dispatch(modalActions.hideModalHandler())}
             selectedItem={chart}
           />
         ),
      showModal: true,
    })
  );
 }

 const renderCustomNode=({nodeDatum})=>{
  const textWidth= nodeDatum.name.length*9;
  const reactWidth=Math.max(190,textWidth)
  return (
  <g>
    <rect x={-reactWidth/2} y="-50"  strokeWidth="1" width={reactWidth} height="100" fill="lightblue"/>
   <foreignObject x={-reactWidth/2} y="-50"  strokeWidth="1" width={reactWidth} height="100">
    <div xmlns="http://www.w3.org/1999/html" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100",fontFamily:"Roboto",textAlign:"center"}}>
      <h3 style={{margin:"9px 2px 0px 2px",fontSize:"15px",color:"red",fontWeight:"bold"}}>{nodeDatum.name}</h3>
      <p style={{margin:"5px 2px 0px 2px",fontSize:"14px", fontWeight:"bold"}}>NoOfMaxPosition : {nodeDatum.noOfMaxPosition}</p>
      <p style={{margin:"5px 2px 0px 2px",fontSize:"14px", cursor:"pointer", fontWeight:"bold"}} onClick={()=>openPopup(nodeDatum)}>Filled Up : {nodeDatum.filledUp}</p>
    </div>
   </foreignObject>
  </g>
  )
}
const siblingSpace=Math.max(2,data.length/10)
const nonsiblingSpace=Math.max(3,data.length/10)
    return (
       <div style={{
        width:"100%",
        height:"100vh",
        position:"relative",
        overflowX:"auto",
        overflowY:"auto",
        display:"flex",
        justifyContent:"center"
        }} >
          <div ref={treeContainerRef} style={{minWidth:"2000px",minHeight:"1500px",position:"relative"}}>
        {data.length>0 ? (
          <Tree
          data={data}
          orientation="vertical"
          renderCustomNodeElement={renderCustomNode}
          translate={translate}
          pathFunc="step"     
          separation={{siblings:2,nonSiblings:2}}    
          nodeSize={{x:110,y:130}} 
          />
        ):(<p>Loading Organization Chart...</p>)}
        </div>
       </div>
    )
}

export default OrgCharts;