import { useRef, Fragment, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import Shimmer from "./Shimmer";

import { useSelector, useDispatch } from "react-redux";

import { BASE_URL } from "./../utils/constants";
import { Link, useLocation, useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersectionObserver from "./../utils/useIntersectionObserver";
import { changeCategory } from "../utils/categorySlice";
import { isMobile } from '../utils/helper';
import { updateChipTag } from "../utils/appSlice";

const VideoContainer = () => {
  const category = useSelector((store) => store.newsCategory.category);
  const stateName = useSelector((store) => store.app.stateName);
  const localeName = useSelector((store) => store.app.locale);
  const districtName = useSelector((store) => store.app.districtName);
  const chipTag = useSelector((store) => store.app.chipTag);
  const talukName = useSelector((store) => store.app.talukName);
  const dispatch = useDispatch();
  const location = useLocation();
  let {state= stateName, district=districtName, taluk=talukName, mainCategory=''} = useParams();
  

  let date = new Date();
  mainCategory = mainCategory === state ? '' : mainCategory;
  
  state = decodeURIComponent(state);
  district = decodeURIComponent(district);
  taluk = decodeURIComponent(taluk);
  mainCategory = decodeURIComponent(mainCategory);

  // eslint-disable-next-line
  date = encodeURIComponent(date.toJSON());
  let publishedAfter = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
  // eslint-disable-next-line
  publishedAfter = encodeURIComponent(publishedAfter.toJSON());

  const bottomRef = useRef();

  let onScreen = useIntersectionObserver(bottomRef, { threshold: 0.5 });

  const getVideos = async (nextPageToken = 0) => {
    try {
      nextPageToken = nextPageToken || 0;
      const paginationUrl = `&pagination[start]=${nextPageToken}&pagination[limit]=${nextPageToken + 8}`;
      const stateDistrictPath = `${state ? `&filters[state][name][$contains][0]=${state}` : ''}${district ? `&filters[district][name][$contains][0]=${district}` : ''}${taluk ? `&sort=[taluk][name]=${taluk}` : ''}`;
      const mainCategoryPath = mainCategory ? `&filters[category_group][name][$contains][0]=${mainCategory}` : '';
      let pathUrl = '';
      if (!!mainCategory && !chipTag && (category.value || !state)) {
        pathUrl = `${BASE_URL}/headlines?locale=${localeName}&populate=*&sort=publishedAt:desc${mainCategoryPath}${category.value ? `&filters[news_category][name][$contains][0]=${category.value}` : ''}${paginationUrl}`;
      } else {
        pathUrl = location.pathname === '' ? `${BASE_URL}/headlines?locale=${localeName}&populate=*&sort=publishedAt:desc&${paginationUrl}` : `${BASE_URL}/headlines?locale=${localeName}&populate=*&sort=publishedAt:desc${mainCategoryPath}${stateDistrictPath}${paginationUrl}`;  
      }
      if (chipTag && !category?.value) {
        pathUrl = `${BASE_URL}/headlines?locale=${localeName}&populate=*&sort=publishedAt:desc${mainCategoryPath}&filters[featured][$eq][0]=true${paginationUrl}`;
        if (district) {
          pathUrl = `${pathUrl}&filters[state][name][$eq]=${state}&filters[$or][0][district][name][$contains]=${district}&filters[$or][1][district]`
        }
      }
      const response = await fetch(pathUrl);
      let data = await response.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  let { data, isLoading, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      ["home-videos", chipTag, mainCategory, localeName, category, state, district, taluk, decodeURIComponent(category.value), decodeURIComponent(location.pathname)],
      ({ pageParam = null }) =>
        (category?.type !== "SEARCH" && (chipTag || state || district || taluk || decodeURIComponent(category.value) || decodeURIComponent(location.pathname) || mainCategory))
          ? getVideos(pageParam)
          : searchVideoByKeyword(category, pageParam),
      {
        getNextPageParam: (lastPage, pages) => {
          if ((lastPage?.meta?.pagination?.limit + 1) < lastPage?.meta?.pagination?.total) {
            return lastPage?.meta?.pagination?.limit;
          } else {
            onScreen = false;
          }
        },
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 1000 * 60 * 60 * 24,
        cacheTime: 1000 * 60 * 60 * 24,
      }
    );

    const getAllKeyValues = (obj) => {
      let key4Values = [];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === 'object') {
            const nestedKey4Values = getAllKeyValues(value);
            key4Values = key4Values.concat(nestedKey4Values);
          } else if (key === 'name') {
            key4Values.push(value);
          }
        }
      }
      return key4Values;
    }

  const searchVideoByKeyword = async (category, nextPageToken = 0) => {
    try {
      let apiUrl;
      nextPageToken = nextPageToken || 0;
      switch(category?.type) {
        case 'SEARCH':
          apiUrl = `${BASE_URL}/headlines?locale=${localeName}&populate=*&sort=publishedAt:desc${state ? `&filters[state][name][$contains][0]=${state}` : ''}&filters[title][$containsi][0]=${category.value}&pagination[start]=${nextPageToken}&pagination[limit]=${nextPageToken + 8}`;
          break;
         default :
          apiUrl = `${BASE_URL}/headlines?locale=${localeName}&populate=*&sort=publishedAt:desc${state ? `&filters[state][name][$contains][0]=${state}` : ''}${district ? `&filters[district][name][$contains][0]=${district}` : ''}${taluk ? `&filters[taluk][name][$contains][0]=${taluk}` : ''}&pagination[start]=${nextPageToken}&pagination[limit]=${nextPageToken + 8}`
         break;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (!response.ok) {
        console.log(data.error);
        throw new Error(data.error.message);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const [path, setPath] = useState('')
  
useEffect(() => {
  if (state || district || taluk || mainCategory) {
    // dispatch(changeCategory({ type: decodeURIComponent(location.pathname), value: decodeURIComponent(location.pathname) }));
    const statePath = state ? `/${state}` : '';
    const districtPath = district ? `/${district}` : '';
    const talukpath = taluk ? `/${taluk}` : '';
    const localPath = localStorage.getItem('mainCategory') ? `/${localStorage.getItem('mainCategory')}` : '';
    setPath(`/news${mainCategory ? `/${mainCategory}` : localPath}${statePath}${districtPath}${talukpath}`);
  }
}, [state, district, taluk, mainCategory]);

  // useEffect(() => {
  //   if (onScreen) {
  //     fetchNextPage();
  //   }
  // }, [onScreen, fetchNextPage]);
  onScreen && fetchNextPage();

  return isLoading ? (
    <div>
      <Shimmer />
    </div>
  ) : (
    <>
      <div
        className={`grid justify-center justify-items-center grid-cols-[repeat(auto-fill,minmax(310px,_1fr))] max-xl:grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] gap-[2rem_1rem] 
    pt-6 ${isMobile ? 'px-2' : 'px-8'} overflow-x-hidden`}
      >
        {/* {console.log(data)} */}
        {isSuccess &&
          data?.pages.map((page, index) => {
            return (
              page?.data && (
                <Fragment key={index}>
                  {page.data.map((article, index) => {
                    if (index === page?.data?.length - 1) {
                      return (
                        <Link
                          ref={bottomRef}
                          className="w-full"
                          to={`${path}/${article?.attributes?.slug}`}
                          key={article.id}
                        >
                          <VideoCard article={article} />
                        </Link>
                      );
                    } else {
                      return (
                        <Link
                          className="w-full flex"
                          to={{
                            pathname: `${path}/${article?.attributes?.slug}`,
                            state: article,
                          }}
                        >
                          <VideoCard article={article} />
                        </Link>
                      );
                    }
                  })}
                </Fragment>
              )
            );
          })}
      </div>
      {isFetchingNextPage && <Shimmer />}
    </>
  );
};

export default VideoContainer;
