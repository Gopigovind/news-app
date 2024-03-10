import React, { useState } from "react";
import { createPortal } from 'react-dom';
import {
  MdHomeFilled,
  MdOutlineSubscriptions,
  MdOutlineVideoLibrary,
  MdOutlineHistory,
  MdOutlineWatchLater,
  MdOutlineContentCut,
  MdOutlineKeyboardArrowDown,
  MdOutlineMusicNote,
  MdOutlineLightbulb,
  MdHelpOutline,
  MdOutlineSettings,
  MdOutlinedFlag,
  MdOutlineFeedback,
} from "react-icons/md";
import { RiVideoLine, RiShoppingBag2Line } from "react-icons/ri";
import { ImFire } from "react-icons/im";
import { GiClapperboard, GiAerialSignal } from "react-icons/gi";
import { SiYoutubegaming } from "react-icons/si";
import shortsLogo_light_theme from "../assests/YouTube-Shorts-Black.svg";
import { IoNewspaperOutline, IoTrophyOutline } from "react-icons/io5";
import { GiHanger } from "react-icons/gi";
import { BsPlusCircle } from "react-icons/bs";
import { FaYoutube, FaUserCircle } from "react-icons/fa";
import { SiYoutubemusic } from "react-icons/si";
import { TbMoodKid } from "react-icons/tb";
import { ImDisplay } from "react-icons/im";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "./../utils/constants";
import { toggleMenu, updateModal } from "../utils/appSlice";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { isMobile as mobileDevice } from "../utils/helper";
import { changeCategory } from "../utils/categorySlice";
import { updateLocale } from "../utils/appSlice";
import DropDownList from "./DropDownList";

const SideBar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  const selector = useSelector((store) => store.newsCategory.category);
  const breakpoint = 1024;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const stateName = useSelector((store) => store.app.stateName);
  const localeName = useSelector((store) => store.app.locale);
  const districtName = useSelector((store) => store.app.districtName);
  const talukName = useSelector((store) => store.app.talukName);
  let {state= stateName, district=districtName, taluk=talukName, mainCategory=''} = useParams();
  
  mainCategory = mainCategory === state ? '' : mainCategory;
  mainCategory = decodeURIComponent(mainCategory);
  const [pathName, setPathName] = useState(location.pathname.split('/').length === 2 ? decodeURIComponent(location.pathname.split('/')[1]) : '');
  useEffect(() => {
    const checkisMobile = () => {
      if (isMenuOpen && window.innerWidth < breakpoint) {
        dispatch(toggleMenu());
      }
    };
    checkisMobile();
    // eslint-disable-next-line
  }, []);
  const isMobile = () => window.innerWidth <= 1300;

  const [categoryGroup, setCategoryGroup] = useState([]);
  const [newsCategories, setNewsCategories] = useState();

  const getCategoryGroup = async () => {
    const response = await fetch(`${BASE_URL}/category-groups?locale=${localeName}&populate=*&sort=id`);
    const { data } = await response.json();
    setCategoryGroup(data);
    listHandler(mainCategory, data, true);
  }

  const getNewsCategory = async () => {
    const response = await fetch(`${BASE_URL}/news-categories?locale=${localeName}&sort=id`);
    const { data } = await response.json();
    setNewsCategories(data);
  }

  const listHandler = (categoryName, data=null, isInitial = false) => {
    const itemData = data || categoryGroup;
    const filterData = itemData.filter((item) => {
      item.attributes.isActive = false;
      return categoryName ? item.attributes.name === categoryName : item
    });
    if (filterData?.length > 0)
    {
      isInitial && !(location.pathname.replace('/', '')) && filterData[0].attributes.isDefault && navigate(filterData[0].attributes.name);
      setNewsCategories(filterData[0]);
      localStorage.setItem('mainCategory', filterData[0].attributes.name);
      filterData[0].attributes.isActive = !(decodeURIComponent(window.location.pathname).replace('/', '')) ? false : true;
      dispatch(changeCategory({ type: 'CATEGORY', value: ''}));
    } else {
      dispatch(changeCategory({ type: 'CATEGORY', value: '' }));
    }
  }

  useEffect(() => {
    getCategoryGroup();
  }, [localeName]);

  useEffect(() => {
    localeApiHandler();
    const handleWindowResize = () => {
      if (isMenuOpen && window.innerWidth < breakpoint) {
        dispatch(toggleMenu());
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [isMenuOpen, dispatch]);

  const [subCategory, setSubCategory] = useState('');
  const categoryHandler = (newsCat) => {
    // dispatch(changeCategory({ type: 'CATEGORY', value: newsCat.id }));
    dispatch(changeCategory({ type: 'CATEGORY', value: newsCat.attributes.name}));
    setSubCategory(newsCat.attributes.name);
  }
  const [localeData, setLocaleData] = useState([]);
  const [locale, setLocale] = useState(localeName);
  const localeApiHandler = async () => {
    const response = await fetch(`${BASE_URL}/i18n/locales`);
    const data = await response.json();
    setLocaleData(data);
  }

  useEffect(() => {
    setLocale(localeName);
  }, [localeName]);
  const changeLocale = (item) => {
    dispatch(updateLocale(item.code));
  }
  const clickHandler = () => {
    dispatch(toggleMenu());
    dispatch(updateModal(true));
  }

  return isMenuOpen ? (
    <>
      <div className={`sidebar__open border-r dark:border-none flex ${isMobile() ? 'fixed top-0 z-30' : ''} flex-col w-[15rem] min-w-fit bg-white dark:bg-zinc-900 dark:text-white transition-all duration-500`} style={{height: '100vh', overflowY: 'auto'}}>
        <div className="first-part flex pl-2 pr-6  pb-4 flex-col text-sm w-[15rem] ">
          {
            categoryGroup.length > 0 && categoryGroup.map((category, index) => (
              <Link to={category?.attributes?.name} key={index} data-id={category.id} onClick={()=> listHandler(category?.attributes?.name)}>
                <div className={`home px-4 flex py-2 items-center hover:bg-zinc-100 dark:hover:bg-zinc-700 w-full rounded-lg  cursor-pointer`}>
                  {/* <MdHomeFilled size="1.5rem" className="mb-1 mr-4" /> */}
                  {
                    category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url && (
                      <img src={category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url} className="mr-2" style={{width: '1.5rem'}} />
                    )
                  }
                  <span className={`${category?.attributes.isActive ? 'font-bold' : ''}`}>{category.attributes.name}</span>
                </div>
              </Link>
            ))
          }
          {
            newsCategories && (
              <>
                <div className="pt-3 border-b border-zinc-200 w-full"></div>
                <div className="pt-4 pl-4 mb-2">
                  <span className="text-base font-semibold">{newsCategories?.attributes?.label}</span>
                </div>
              </>
            )
          }
          {
            newsCategories?.attributes?.headline_categories?.data?.length > 0 && newsCategories?.attributes?.headline_categories?.data.map((newsCat) => (
              <Link
                state={{ type: 'CATEGORY', value: newsCat.id, item: newsCat }}
                to={{
                  pathname: `${mainCategory ? `/${mainCategory}` : newsCategories?.attributes?.name || ''}`,
                  state: newsCat
                }}
              >
                <div data-id={newsCat.id} onClick={() => categoryHandler(newsCat)} className={`${newsCat.id === selector?.value ? 'bg-zinc-100' : ''} Trending py-2 px-4 flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-700  w-full rounded-lg  cursor-pointer`}>
                  {/* <ImFire size="1.5rem" className="mb-1 mr-4" /> */}
                  <span className={`${subCategory === newsCat.attributes.name ? 'font-bold' : ''}`}>{newsCat.attributes.name}</span>
                </div>
              </Link>
            ))
          }
          {
            isMobile() && (
              <>
              <div className="pt-3 border-b border-zinc-200 w-full"></div>
                {/* <div className="pt-4 pl-4 mb-2">
                  <span className="text-base font-semibold">{}</span>
                </div> */}
              <div className="full cursor-pointer">
        {localeData?.length > 0 && <DropDownList dataSource={localeData} isHide={true} value={locale} onChange={changeLocale} clickHandler={clickHandler} />}
      </div>
              </>
            )
          }
        </div>
      </div>
      {
        isMobile() ? (
          <>
            {createPortal(
              <div drawer-backdrop="" class="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-20" onClick={() => { dispatch(toggleMenu()); }}></div>,
              document.body
            )}
          </>
        ) : null
      }
    </>
  ) : (
    !mobileDevice && (
      <div className="sidebar__closed px-2 border-r dark:border-none flex flex-col text-xs w-18 items-center  h-[calc(100vh-4.625rem)] bg-white dark:bg-zinc-900 dark:text-white transition-all duration-500">
        {
            categoryGroup.length > 0 && categoryGroup.map((category, index) => (
              <Link className=" w-full" to={category.attributes?.isDefault ? '/' : category?.attributes?.name} key={index} data-id={category.id} onClick={()=> listHandler(category?.attributes?.name)}>
                <div className={`home py-4 flex flex-col items-center hover:bg-zinc-200 dark:hover:bg-zinc-700  w-full rounded-md`}>
                  {/* <MdHomeFilled size="1.5rem" className="mb-1 mr-4" /> */}
                  {
                    category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url && (
                      <img src={category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url} style={{width: '1.5rem'}} />
                    )
                  }
                  <span className={`${(category?.attributes.isActive) ? 'font-bold' : ''}`}>{category.attributes.name}</span>
                </div>
              </Link>
            ))
          }
      </div>
    )
  );
};

export default SideBar;
