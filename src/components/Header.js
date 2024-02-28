import { RxHamburgerMenu } from "react-icons/rx";
import { TfiSearch } from "react-icons/tfi";
import { MdKeyboardVoice } from "react-icons/md";
import { RiVideoAddLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import logo from "../assests/logo.jpg";
import logo_dark_theme from "../assests/logo_dark_theme.webp";
import { toggleMenu, toggleSideBar, updateModal, updateState } from "../utils/appSlice";
import { BASE_URL } from "./../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import useDebounce from "../utils/useDebounce";
import useClickOutside from "./../utils/useClickOutside";
import { cacheResults } from "../utils/searchSlice";
import ThemeContext from "../utils/ThemeContext";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { useVoice } from "../utils/useVoice";
import { changeCategory } from "../utils/categorySlice";
import { updateLocale } from "../utils/appSlice";
import { isMobile } from '../utils/helper'

import mic_open from "../assests/mic_open.gif";
import DropDownList from "./DropDownList";
import { createPortal } from "react-dom";
import Modal from "./Modal";

export const RightSideComp = () => {
  const localeName = useSelector((store) => store.app.locale);
  const [localeData, setLocaleData] = useState([]);
  const [locale, setLocale] = useState(localeName);
  const dispatch = useDispatch();
  const localeApiHandler = async () => {
    const response = await fetch(`${BASE_URL}/i18n/locales`);
    const data = await response.json();
    setLocaleData(data);
  }

  useEffect(() => {
    localeApiHandler();
  }, []);
  useEffect(() => {
    setLocale(localeName);
  }, [localeName]);
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    const isCurrentDark = theme === "dark";
    setTheme(isCurrentDark ? "light" : "dark");
    localStorage.setItem("theme", isCurrentDark ? "light" : "dark");
  };

  const changeLocale = (item) => {
    dispatch(updateLocale(item.code));
  }
  const clickHandler = () => {
    dispatch(updateModal(true));
  }


  return (
    <div className="right-menu flex items-center sm:ml-4 lg:ml-16 gap-5 p-2" style={{ flexDirection: isMobile ? 'row-reverse' : '' }}>
      <div className="toggle-dark-mode-switch  flex items-center gap-2">
        <label
          htmlFor="check"
          className="bg-gray-100 dark:bg-zinc-700 relative top-0 w-20 h-8 rounded-full cursor-pointer flex items-center justify-around dark:text-black"
        >
          {" "}
          <BsFillSunFill className="text-amber-400" size="1.2rem" />
          <BsFillMoonFill className="text-zinc-700" size="1.2rem" />
          <input
            type="checkbox"
            id="check"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={handleThemeChange}
          />
          <span className="w-2/5 h-4/5 bg-amber-400 absolute rounded-full left-1 top-1 peer-checked:bg-white peer-checked:left-11 transition-all duration-500 "></span>
        </label>
      </div>

      <div className="full cursor-pointer">
        {localeData?.length > 0 && <DropDownList dataSource={localeData} isHide={true} value={locale} onChange={changeLocale} clickHandler={clickHandler} />}
      </div>
      <div className="p-2 max-sm:hidden  hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full cursor-pointer">
        <IoMdNotificationsOutline size="1.5rem" />
      </div>
      <div className="p-2 max-sm:hidden   hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full cursor-pointer">
        <FaUserCircle size="1.5rem" />
      </div>
    </div>
  )
};

const LeftMenu = () => {
  const stateName = useSelector((store) => store.app.stateName);
  const localeName = useSelector((store) => store.app.locale);
  const districtName = useSelector((store) => store.app.districtName);
  const talukName = useSelector((store) => store.app.talukName);
  const dispatch = useDispatch();
  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };


  // const [stateData, setStateData] = useState([]);

  // const stateApiHandler = async () => {
  //   const response = await fetch(`${BASE_URL}/states?locale=${localeName}`);
  //   const { data } = await response.json();
  //   setStateData(data);
  // }

  // useEffect(() => {
  //   stateApiHandler();
  // }, [stateName]);

  // const changeState = (item) => {
  //   dispatch(updateState(item?.attributes?.name));
  // }
  const clickHandler = () => {
    dispatch(updateModal(true));
  }
  
  const route = useLocation();
  const decodeUrl = decodeURIComponent(route.pathname);
  const splitPath = decodeUrl.split('/'); 
  const pathName = splitPath[splitPath.length - 1];

  return (
    <>
      <button
        className=" p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
        onClick={toggleMenuHandler}
      >
        <RxHamburgerMenu
          size="1.5rem"
          title="hambergur menu"
          className="cursor-pointer"
        />
      </button>
      <div className="logo cursor-pointer flex items-center max-md:hidden">
        <a href="/" onClick={() => {
          localStorage.removeItem('district');
          localStorage.removeItem('taluk');
        }}>
          <img
            src={logo}
            alt="logo"
            title="logo"
            className="w-20 pl-4"
          />
        </a>
      </div>
      <div className="p-2 max-sm:hidden ">
        {/* <DropDownList dataSource={stateData} value={stateName} onChange={changeState} clickHandler={clickHandler} /> */}
        <Listbox value={stateName}>
          <Listbox.Button onClick={clickHandler} className="cursor-pointer relative w-full bg-white dark:bg-zinc-900 dark:text-white py-1.5 pl-3 pr-10 text-left text-gray-700 focus:outline-none sm:text-sm sm:leading-6">
            <span className="flex items-center">
              <span className="ml-3 block truncate">{pathName || talukName || districtName || stateName}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </span>
          </Listbox.Button>
        </Listbox>
      </div>
    </>
  )
};

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debounceSearchText = useDebounce(searchQuery, 200);
  const localeName = useSelector((store) => store.app.locale);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useClickOutside(() => setLoading(true));
  const inputRef = useRef();

  const { text, isListening, listen } = useVoice();

  const searchCache = useSelector((store) => store.search.suggestions);
  const dispatch = useDispatch();

  const category = useSelector((store) => store.newsCategory.category);

  const handleSetHomeVideoByKeyword = (searchText) => {
    if (category.value !== searchText) {
      dispatch(changeCategory({ type: 'SEARCH', value: searchText }));
    }
    setLoading(true);
    setSuggestions([]);
    setSearchQuery("");
  };

  const toggleSideBarHandler = () => {
    dispatch(toggleSideBar());
  };

  const handleVoiceSearch = () => {
    listen();
    console.log("Voice Search");
  };

  useEffect(() => {
    setSearchQuery(text);
  }, [text]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getAutocompletion = async (searchText) => {
      // console.log('api call made for text -> ', searchText);
      const response = await fetch(`${BASE_URL}/headlines/?locale=${localeName}&populate=*`);
      const { data } = await response.json();
      dispatch(cacheResults({ [searchText]: data[1] }));
      setSuggestions(data[1]);
      setLoading(false);
    };

    if (debounceSearchText.length > 2) {
      if (searchCache[debounceSearchText]) {
        setSuggestions(searchCache[debounceSearchText]);
        setLoading(false);
      } else {
        getAutocompletion(debounceSearchText);
      }
    }

    return () => {
      controller.abort("cancel request");
    };
    // eslint-disable-next-line
  }, [debounceSearchText]);

  return (
    <div className={`px-${isMobile ? 2 : 4} py-2 flex justify-between ${!isMobile ? 'items-center' : ''} shadow-sm  w-full sticky top-0 z-10 bg-white h-[4.62rem] dark:bg-zinc-900 dark:text-white transition-all duration-500`} style={{ flexDirection: isMobile ? 'column' : 'row', height: '100%' }}>
      <div className={`left-items flex items-center ${isMobile ? 'justify-between' : ''}`}>
        {
          isMobile ? (
            <div className="flex">
              <LeftMenu />
            </div>
          ) : (
            <LeftMenu />
          )
        }
        {isMobile &&
          <RightSideComp />
        }
      </div>
      <div className={`center w-3/5 2xl:w-2/5 max-sm:w-4/5 flex items-center ${!isMobile ? 'ml-16' : ''} relative`} style={{ width: isMobile ? 'auto' : '' }}>
        <div
          ref={searchRef}
          className={`searchbar  dark:bg-zinc-800 flex-1 flex items-center ${isMobile ? 'ml-0' : 'ml-10'} rounded-3xl border-2 dark:border dark:border-gray-500`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchQuery}
            className=" rounded-l-3xl p-2 pl-8 focus:outline-none w-full dark:bg-zinc-800"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setLoading(true);
            }}
            onFocus={(e) => {
              setLoading(false);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleSetHomeVideoByKeyword(e.target.value);
              }
            }}
          />
          <div
            className="p-3 cursor-pointer hover:bg-zinc-200 px-8 rounded-r-3xl bg-zinc-100 border-l-2 border-zinc-200 max-md:bg-white max-md:border-none max-md:px-4 max-lg:px-4 dark:bg-zinc-800 dark:border-l dark:border-gray-500 "
            onClick={() => {
              setSearchQuery(inputRef.current.value);
              setLoading(false);
            }}
          >
            <button
              className="flex items-center"
              onClick={() => handleSetHomeVideoByKeyword(searchQuery)}
            >
              <TfiSearch size="1.2rem" className="" />
            </button>
          </div>
        </div>
        <div
          className="voice-icon max-lg:hidden ml-4 p-2 hover:bg-zinc-200 rounded-full cursor-pointer dark:text-white dark:hover:bg-zinc-700"
          onClick={handleVoiceSearch}
        >
          {isListening ? (
            <img src={mic_open} width="30px" alt="mic open" />
          ) : (
            <MdKeyboardVoice size="1.5rem" />
          )}
        </div>
      </div>
      {!isMobile &&
        <RightSideComp />
      }
    </div>
  );
};

export default Header;
