import { useRef, Fragment, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import Shimmer from "./Shimmer";

import { useSelector, useDispatch } from "react-redux";

import { BASE_URL } from "./../utils/constants";
import { Link, useLocation, useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersectionObserver from "./../utils/useIntersectionObserver";
import { changeCategory } from "../utils/categorySlice";

const VideoContainer = () => {
  const category = useSelector((store) => store.newsCategory.category);
  const dispatch = useDispatch();
  const location = useLocation();
  let {state= localStorage.getItem('stateValue'), district='', taluk='', newsCategory=''} = useParams();
  

  let date = new Date();
  newsCategory = newsCategory === state ? '' : newsCategory;
  
  state = decodeURIComponent(state);
  district = decodeURIComponent(district);
  taluk = decodeURIComponent(taluk);
  newsCategory = decodeURIComponent(newsCategory);

  // eslint-disable-next-line
  date = encodeURIComponent(date.toJSON());
  let publishedAfter = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
  // eslint-disable-next-line
  publishedAfter = encodeURIComponent(publishedAfter.toJSON());

  /* 
  `/search?part=snippet&order=viewCount&publishedAfter=${publishedAfter}&publishedBefore=${date}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`

  const response = await fetch(
          BASE_URL +
            `/search?part=snippet&order=viewCount&publishedAfter=${publishedAfter}&type=video&videoDuration=medium&publishedBefore=${date}&key=${
              process.env.REACT_APP_GOOGLE_API_KEY
            }&regionCode=IN&pageToken=${nextPageToken ?? ''}`
        );


  `/videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=5&chart=mostPopular&regionCode=IN&pageToken=${nextPageToken ?? ""}&videoDuration=medium&key=` +
            process.env.REACT_APP_GOOGLE_API_KEY
 */

  const bottomRef = useRef();

  let onScreen = useIntersectionObserver(bottomRef, { threshold: 0.5 });

  const getVideos = async (nextPageToken = 0) => {
    try {
      nextPageToken = nextPageToken || 0;
      const paginationUrl = `&pagination[start]=${nextPageToken}&pagination[limit]=${nextPageToken + 8}`;
      const pathUrl = newsCategory ? `${BASE_URL}/headlines?populate=*&sort=publishedAt:desc&filters[locale][$contains][0]=ta&filters[news_category][[name]][$contains][0]=${newsCategory}${paginationUrl}` 
      : location.pathname === '/' ? `${BASE_URL}/headlines/?populate=*&sort=publishedAt:desc&filters[locale][$contains][0]=ta${paginationUrl}` : `${BASE_URL}/headlines/?populate=*&sort=publishedAt:desc&filters[locale][$contains][0]=ta&filters[state][name][$contains][0]=${state}&filters[district][name][$contains][0]=${district}&filters[taluk][name][$contains][0]=${taluk}${paginationUrl}`;
      const response = await fetch(pathUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  let { data, isLoading, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      ["home-videos", category, state, district, taluk, newsCategory, location.pathname],
      ({ pageParam = null }) =>
        (category?.type !== "SEARCH" && (state || district || taluk || newsCategory || location.pathname))
          ? getVideos(pageParam)
          : searchVideoByKeyword(category, pageParam),
      {
        getNextPageParam: (lastPage, pages) => {
          if (lastPage?.meta?.pagination?.limit <= lastPage?.meta?.pagination?.total) {
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
          apiUrl = `${BASE_URL}/headlines?populate=*&sort=publishedAt:desc&filters[state][name][$contains][0]=${state}&filters[title][$containsi][0]=${category.value}&pagination[start]=${nextPageToken}&pagination[limit]=${nextPageToken + 8}`;
          break;
         default :
          apiUrl = `${BASE_URL}/headlines/?populate=*&sort=publishedAt:desc&filters[state][name][$contains][0]=${state}&filters[district][name][$contains][0]=${district}&filters[taluk][name][$contains][0]=${taluk}&pagination[start]=${nextPageToken}&pagination[limit]=${nextPageToken + 8}`
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
  if (state || district || taluk) {
    dispatch(changeCategory({ type: decodeURIComponent(location.pathname), value: decodeURIComponent(location.pathname) }));
    const statePath = state ? `/${state}` : '';
    const districtPath = district ? `/${district}` : '';
    const talukpath = taluk ? `/${taluk}` : '';
    setPath(`/news${statePath}${districtPath}${talukpath}`);
  }
}, [state, district, taluk]);

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
        className=" grid justify-center justify-items-center grid-cols-[repeat(auto-fill,minmax(310px,_1fr))] max-xl:grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] gap-[2rem_1rem] 
    pt-6 px-8 overflow-x-hidden"
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
                          data-item={getAllKeyValues(article)}
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
