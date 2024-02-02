import { useEffect, useState, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import SideBarExpanded from "./SideBarExpanded";
import { BASE_URL } from "./../utils/constants";
import VideoMetaData from "./VideoMetaData";
import Comments from "./Comments";
import VideoSuggestions from "./VideoSuggestions";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../utils/appSlice";
import { useQuery } from "@tanstack/react-query";
import news_default from "../assests/news-default.png";

const MediaElement = ({ articleCard }) => {

  const media = articleCard?.media?.data;
  const isImageType = media?.length ? media[0]?.attributes.mime?.includes('image') : '';
  const mediaUrl = media?.length > 0 ? media[0].attributes?.url ? media[0].attributes?.url : news_default : '';
  const articleVideo = useRef(null);

  useEffect(() => {
      if (articleVideo.current) {
        articleVideo.current.play();
      }
  }, [articleVideo.current])

  return (
    <>
      {
        mediaUrl ? (
          <>
            {
              isImageType ? (
                <Swiper
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {
                    media.map((item) => (
                      <SwiperSlide>
                        <img
                  src={item?.attributes?.url}
                  alt={item?.attributes?.name}
                  className="h-80 max-w-md 
              mx-auto md:max-w-lg lg:max-w-xl 
              object-cover rounded-lg shadow-md"
                />
                      </SwiperSlide>
                    ))
                  }

                </Swiper>
              ) : (
                <>
                    <video ref={articleVideo} controls autoplay name="media" class="h-80 w-full object-cover rounded-t-lg shadow-sm">
                      <source src={mediaUrl} type="video/mp4" />
                    </video>
                </>
              )
            }
          </>
        ) : null
      }
    </>
  )
};

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  // const slug = searchParams.get("slug");
  const {state='', district='', taluk='', slug=''} = useParams();

  function showPopup() {
    alert("Text has been copied, allow pop-ups and  paste it in a new tab opened to get the summary.");
  }



  const handleSummaryButtonClick = async ()=>{
    // const text = `Summarize the YouTube video in Points and in details\nTitle: ${videoDetails?.snippet?.title} by ${videoDetails?.snippet?.channelTitle}`;

    // const copyToClipboard = async (str) => {
    //   if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    //     return await navigator.clipboard.writeText(str);
    //   return Promise.reject("The Clipboard API is not available.");
    // };
    // await copyToClipboard(text);
    // showPopup();
    //   window.open("https://chat.openai.com/chat", "_blank");
  }

  const dispatch = useDispatch();
  const isSideBarOpen = useSelector((store) => store.app.isSideBarOpen);

  useEffect(() => {
    if (isSideBarOpen) {
      dispatch(toggleSideBar());
    }
    // eslint-disable-next-line
  }, []);

  const getVideoDetail = async () => {
    const response = await fetch(
    `${BASE_URL}/headlines/?populate=*&filters[slug][$eq][0]=${slug}`);
    const data = await response.json();
    return data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["watch-page", "video-details", slug],
    queryFn: () => getVideoDetail(slug),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  });
  const [articleCard, setArticleCard] = useState();
  
  useEffect(() => {
    if (data?.length > 0 && data[0]?.attributes) {
      setArticleCard(data[0]?.attributes);
    }
  }, [data]);

  useEffect(() => {
    if (articleCard) {

    }
  }, [articleCard]);


  return (isLoading || !articleCard) ? null : (
  <div className="max-w-6xl mx-auto">
  <article>
      <section className="flex flex-col lg:flex-row pb-24 py-4 px-0 lg:px-10 dark:bg-zinc-900 dark:text-white">
        <MediaElement articleCard={articleCard} />
        <div className="px-10 w-full">
          <h1 className="font-bold headerTitle px-0 no-underline pb-2">
            {articleCard.title}
          </h1>
          <div className="flex divide-x-2 space-x-4">
            <h2 className="font-bold">By: {articleCard.author || "unknown"}</h2>
            <h2 className="font-bold pl-2">Source: {articleCard.source}</h2>
            <p className="pl-4">{articleCard.publishedAt}</p>
          </div>
          <p className="pt-4">{articleCard.description}</p>
        </div>
      </section>
    </article>
  </div>
  );
};

export default WatchPage;
