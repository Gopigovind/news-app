import { createSlice } from '@reduxjs/toolkit';
import { isMobile } from './helper';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isMenuOpen: window.innerWidth >= 1300,
    isSideBarOpen: false,
    locale: localStorage.getItem('locale'),
    stateName: localStorage.getItem('state') || '',
    districtName: localStorage.getItem('district') || '',
    talukName: localStorage.getItem('taluk') || '',
    showModal: false,
  },
  reducers: {
    //action : reducer function(state, actionPayload){}
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    updateLocale: (state, action) => {
      state.locale = action.payload;
      // state.stateName = action.payload === 'en' ? EN : TN
    },
    updateState: (state, action) => {
      state.stateName = action.payload;
    },
    updateDistrict: (state, action) => {
      state.districtName = action.payload;
    },
    updateTaluk: (state, action) => {
      state.talukName = action.payload;
    },
    updateModal: (state, action) => {
      state.showModal = action.payload;
    }
  },
});

export const { toggleMenu, toggleSideBar, updateLocale, updateState, updateDistrict, updateModal, updateTaluk } = appSlice.actions;
export default appSlice.reducer;
