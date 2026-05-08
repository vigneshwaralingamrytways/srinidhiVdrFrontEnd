import React from 'react';
import { Route } from 'react-router-dom';



const Modules = React.lazy(() => import('./pages/Modules/Modules'));
const Login= React.lazy(() => import('./pages/Login'));

//Meeting Components
const MeetingGroupMaster= React.lazy(() => import('./pages/Settings/MeetingGroupMaster/MeetingGroupMasterSearch'));//new added
const MeetingTransaction= React.lazy(() => import('./pages/Meeting/MeetingTransaction/MeetingTransactionSearch'));//new added
const Task= React.lazy(() => import('./pages/Meeting/Task/TaskSearch'));//new added
const TaskType= React.lazy(() => import('./pages/Settings/TaskType/TaskType'));
const TaskSubType= React.lazy(() => import('./pages/Settings/TaskSubType/TaskSubType'));
const cal=React.lazy(()=>import('./pages/Meeting/Calender/Calender'))
const ClientMaster= React.lazy(() => import('./pages/Settings/ClientMaster/ClientMaster'));
const BulkUploadClient=React.lazy(() => import('./pages/Settings/BulkUploadClient/BulkUploadClient'));

// Master

const DocumentEntrySearch= React.lazy(() => import('./pages/Master/DocumentEntrySearch'));
const UserMasterSearch= React.lazy(() => import('./pages/Master/UserMaster/UserMasterSearch'));
const ReactChatApp= React.lazy(() => import('./pages/Master/ReactChatApp'));
const GraphswithMultipleAxes= React.lazy(() => import('./pages/Master/GraphswithMultipleAxes'));
const CustomLineChart= React.lazy(() => import('./pages/Master/CustomLineChart '));
const ChartSearch= React.lazy(() => import('./pages/Master/ChartSearch'));

//----HRMS
const OrgChart=React.lazy(() => import('./pages/HRMS/OrgChart/OrgChart'));
const LeaveRequest=React.lazy(() => import('./pages/HRMS/LeaveRequestForm/LeaveRequestForm'));
const ExpenseRequest=React.lazy(() => import('./pages/HRMS/ExpenseRequestForm/ExpenseRequestForm'));


// Digital Repository

const SearchPage = React.lazy(() => import('./pages/SearchPage/SearchPage'));
const UploadForm = React.lazy(()=> import('./pages/SearchPage/Popup/UploadForm'));
const DocumentDetailPage = React.lazy(()=> import('./pages/SearchPage/Popup/DocumentDetailPage'));

// DigitalRepoUserModel

const UserPage = React.lazy(() => import('./pages/UserPage/UserPage'));
const DocumentsPage = React.lazy(() => import('./pages/UserPage/DocumentsPage'));
const DocumentDetail = React.lazy(() => import('./pages/UserPage/DocumentDetail'));

// home page
const SlidingMenu2 = React.lazy(() => import('./Components/NewHomePage/Contacts'));


export default [
    <Route path='/login' exact component={Login}/>,
    <Route path='/modules' exact component={Modules}/>,
 <Route path='/processModule' exact component={SlidingMenu2} />,
  <Route path='/userDashboard' exact component={UserPage} />,
<Route path="/document" exact component={DocumentsPage } />,
     <Route path="/documentdetail" exact component={DocumentDetail } />,



   //Meeting Components
   <Route path='/meeting/meetinggroupmaster' exact component={MeetingGroupMaster}/>,
   <Route path='/meeting/meetingtransaction' exact component={MeetingTransaction}/>,
   <Route path='/meeting/task' exact component={Task}/>,
   <Route path='/meeting/tasktype' exact component={TaskType}/>,
   <Route path='/meeting/tasksubtype' exact component={TaskSubType}/>,
   <Route path='/meeting/calender' exact component={cal}/>,
   <Route path='/meeting/clientMaster' exact component={ClientMaster}/>,
   <Route path='/meeting/bulkUpload' exact component={BulkUploadClient}/>,
    // Master

    <Route path='/entry/search' exact component={DocumentEntrySearch}/>,
    <Route path='/user/search' exact component={UserMasterSearch}/>,

    <Route path='/user/chart' exact component={ReactChatApp}/>,
    <Route path='/user/multipleAxes' exact component={GraphswithMultipleAxes}/>,
    <Route path='/user/boxlinechart' exact component={CustomLineChart}/>,
    <Route path='/user/chartSearch' exact component={ChartSearch}/>,


    // Digital Repository

    <Route path='/search' exact component={SearchPage}/>,
    <Route path="/documents" exact component={UploadForm } />,
     <Route path="/document-detail" exact component={DocumentDetailPage } />,

    //HRMS
    <Route path='/HRMS/OrgChart' exact component={OrgChart}/>,
    <Route path='/HRMS/LeaveRequest' exact component={LeaveRequest}/>,
    <Route path='/HRMS/ExpenseRequest' exact component={ExpenseRequest}/>,

 
];       
