import { createSlice } from '@reduxjs/toolkit';
import { isMobile } from './helper';

const TN = 'தமிழ் நாடு';
const EN = 'Tamil Nadu';
const HINDI = '';
const appSlice = createSlice({
  name: 'app',
  initialState: {
    isMenuOpen: window.innerWidth >= 1300,
    isSideBarOpen: false,
    locale: 'ta',
    stateName: 'தமிழ் நாடு'
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
      state.stateName = action.payload === 'en' ? EN : TN
    },
    updateState: (state, action) => {
      state.stateName = action.payload;
    }
  },
});

export const { toggleMenu, toggleSideBar, updateLocale, updateState } = appSlice.actions;
export default appSlice.reducer;
