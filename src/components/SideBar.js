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
import { toggleMenu } from "../utils/appSlice";
import { Link, useLocation } from "react-router-dom";
import { isMobile as mobileDevice } from "../utils/helper";

const SideBar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  const selector = useSelector((store) => store.newsCategory.category);
  const breakpoint = 1024;
  const dispatch = useDispatch();
  const location = useLocation();
  const [pathName, setPathName] = useState();
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
  const [newsCategory, setNewsCategory] = useState();
  const localeName = useSelector((store) => store.app.locale);

  const getCategoryGroup = async () => {
    const response = await fetch(`${BASE_URL}/category-groups?locale=${localeName}&populate=*&sort=id`);
    const { data } = await response.json();
    setCategoryGroup(data);
    const urlName = location.pathname.split('/').length === 2 ? decodeURIComponent(location.pathname.split('/')[1]) : '';
    listHandler(urlName, data);
  }

  const getNewsCategory = async () => {
    const response = await fetch(`${BASE_URL}/news-categories?locale=${localeName}&sort=id`);
    const { data } = await response.json();
    setNewsCategory(data);
  }

  const listHandler = (categoryName, data=null) => {
    const itemData = data || categoryGroup;
    const filterData = itemData.filter((item) => {
      item.attributes.isActive = false;
      return categoryName ? item.attributes.name === categoryName : item
    });
    if (filterData?.length > 0)
    {
      filterData[0].attributes.isActive = true;
      setNewsCategory(filterData[0]);
    }
  }

  useEffect(() => {
    getCategoryGroup();
    // getNewsCategory();
  }, [localeName]);

  useEffect(() => {
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

  const categoryHandler = (newsCat) => {
    // dispatch(changeCategory({ type: 'CATEGORY', value: newsCat.id }));
  }


  return isMenuOpen ? (
    <>
      <div className={`sidebar__open border-r dark:border-none flex ${isMobile() ? 'fixed top-0 z-30' : ''} flex-col w-[15rem] min-w-fit bg-white dark:bg-zinc-900 dark:text-white transition-all duration-500`} style={{height: '100vh', overflowY: 'auto'}}>
        <div className="first-part flex pl-2 pr-6  pb-4 flex-col text-sm w-[15rem] ">
          {
            categoryGroup.length > 0 && categoryGroup.map((category, index) => (
              <Link to={category.attributes?.isDefault ? '/' : category?.attributes?.name} key={index} data-id={category.id} onClick={()=> listHandler(category?.attributes?.name)}>
                <div className={`${((pathName === (category.attributes?.isDefault ? '/' : category?.attributes?.name)) || category?.attributes.isActive) ? 'bg-gray-500' : ''} home px-4 flex py-2 items-center hover:bg-zinc-100 dark:hover:bg-zinc-700 w-full rounded-lg  cursor-pointer`}>
                  {/* <MdHomeFilled size="1.5rem" className="mb-1 mr-4" /> */}
                  {
                    category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url && (
                      <img src={category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url} className="mb-1 mr-4" style={{width: '1.5rem'}} />
                    )
                  }
                  <span className="">{category.attributes.name}</span>
                </div>
              </Link>
            ))
          }
          {
            newsCategory && (
              <>
                <div className="pt-3 border-b border-zinc-200 w-full"></div>
                <div className="pt-4 pl-4 mb-2">
                  <span className="text-base font-semibold">{newsCategory?.attributes?.label}</span>
                </div>
              </>
            )
          }
          {
            newsCategory?.attributes?.headline_categories?.data?.length > 0 && newsCategory?.attributes?.headline_categories?.data.map((newsCat) => (
              <Link
                onClick={() => { dispatch(toggleMenu()); }}
                state={{ type: 'CATEGORY', value: newsCat.id, item: newsCat }}
                to={{
                  pathname: `/${newsCat.attributes.name}`,
                  state: newsCat
                }}
              >
                <div data-id={newsCat.id} onClick={() => categoryHandler(newsCat)} className={`${newsCat.id === selector?.value ? 'bg-zinc-100' : ''} Trending py-2 px-4 flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-700  w-full rounded-lg  cursor-pointer`}>
                  {/* <ImFire size="1.5rem" className="mb-1 mr-4" /> */}
                  <span>{newsCat.attributes.name}</span>
                </div>
              </Link>
              

            ))
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
      <div className="sidebar__closed pr-1 border-r dark:border-none flex flex-col text-xs w-18 items-center  h-[calc(100vh-4.625rem)] bg-white dark:bg-zinc-900 dark:text-white transition-all duration-500">
        {
            categoryGroup.length > 0 && categoryGroup.map((category, index) => (
              <Link className=" w-full" to={category.attributes?.isDefault ? '/' : category?.attributes?.name} key={index} data-id={category.id} onClick={()=> listHandler(category?.attributes?.name)}>
                <div className={`${((pathName === (category.attributes?.isDefault ? '/' : category?.attributes?.name)) || category?.attributes.isActive) ? 'bg-gray-500' : ''} home py-4 flex flex-col items-center hover:bg-zinc-200 dark:hover:bg-zinc-700  w-full rounded-md`}>
                  {/* <MdHomeFilled size="1.5rem" className="mb-1 mr-4" /> */}
                  {
                    category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url && (
                      <img src={category.attributes?.image?.data?.attributes?.formats?.thumbnail?.url} className="mb-1 mr-4" style={{width: '1.5rem'}} />
                    )
                  }
                  <span className="">{category.attributes.name}</span>
                </div>
              </Link>
            ))
          }
      </div>
    )
  );
};

export default SideBar;
