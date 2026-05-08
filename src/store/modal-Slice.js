import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const modalSlice = createSlice({
  name: 'sideBar',
  initialState: {
      showModal:false,
      selectedData:{},
      selectedForm:<></>,
      modalWidth: '', 
      modalLeft: '',   
  },
  reducers: {
    showModalHandler(state, action) {
      state.selectedData = action.payload.selectedData;
      state.showModal = action.payload.showModal;
      state.selectedForm=action.payload.selectedForm;      
      console.log(state.selectedData)
      state.modalWidth = action.payload.modalWidth;
      state.modalLeft=action.payload.modalLeft;
    },
    hideModalHandler(state){
      state.selectedData = {};
      state.showModal = false;
      state.selectedForm=<></>;      
     // console.log(state.selectedData)
    },
    setModalProperties(state, action) {
      const { modalWidth, modalLeft } = action.payload;
      state.modalWidth = modalWidth;
      state.modalLeft = modalLeft;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;