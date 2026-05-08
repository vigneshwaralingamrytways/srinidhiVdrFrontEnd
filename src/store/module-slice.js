import { createSlice } from '@reduxjs/toolkit';


const moduleSlice = createSlice({
  name: 'sideBar',
  initialState: {
      moduleId:"",
      sidebardata:[],
      showsideBar:false
  },
  reducers: {
    selectModuleId(state, action) {
      state.moduleId = action.payload.moduleId;
      console.log(action.payload.moduleId)
    }
  },
});

export const moduleActions = moduleSlice.actions;

export default moduleSlice;