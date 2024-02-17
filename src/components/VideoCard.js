import moment from "moment";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { BASE_URL } from "./../utils/constants";
// import { GiAerialSignal } from "react-icons/gi";
import { decode } from "html-entities";
import { useQuery } from "@tanstack/react-query";
import news_default from "../assests/news-default.png";

const VideoCard = ({ article }) => {
  // const {
  //   id,
  //   snippet: {
  //     channelId,
  //     channelTitle,
  //     title,
  //     publishedAt,
  //     thumbnails: { medium },
  //   },
  //   contentDetails,
  //   statistics,
  // } = article;

  // const newTitle = decode(title);
  // const _videoId = id?.videoId || contentDetails?.videoId || id;

  // const [views, setViews] = useState(null);
  // const [duration, setDuration] = useState(null);
  // const [channelIcon, setChannelIcon] = useState(null);

  // const seconds = duration && moment.duration(duration).asSeconds();
  // const _duration = duration && moment.utc(seconds * 1000).format("mm:ss");
  // // console.log(_duration);

  // const _videoId = id?.videoId || contentDetails?.videoId || id;

  // const getVideoViewsAndDuration = async () => {
  //   const response = await fetch(
  //     BASE_URL +
  //       `/videos?part=contentDetails%2Cstatistics&id=${_videoId}&key=${process.env.REACT_APP_GOOGLE_API_KEY_3}`
  //   );
  //   const data = await response.json();
  //   return data.items[0];
  //   // console.log(data);

  //   // setDuration(data?.items?.[0]?.contentDetails?.duration);
  //   // setViews(data?.items[0].statistics.viewCount);
  // };

  // const { data: videoDetails} = useQuery({
  //   queryKey: ["videoDetails", _videoId],
  //   queryFn: () => getVideoViewsAndDuration(_videoId),
  //   refetchOnWindowFocus: false,
  //   refetchOnmount: false,
  //   refetchOnReconnect: false,
  //   retry: false,
  //   staleTime: 1000 * 60 * 60 * 24,
  //   cacheTime: 1000 * 60 * 60 * 24,
  //   enabled: !(contentDetails && statistics),
  // });

  // let views, duration;

  // if (contentDetails && statistics) {
  //   duration = contentDetails?.duration;
  //   views = statistics.viewCount;
  // } else  {
  //   duration = videoDetails?.contentDetails?.duration;
  //   views = videoDetails?.statistics?.viewCount;
  // }

  // const seconds = moment.duration(duration).asSeconds();
  // const _duration = moment.utc(seconds * 1000).format("mm:ss");


  // const get_channel_icon = async () => {
  //   const response = await fetch(
  //     BASE_URL +
  //       `/channels?part=snippet&id=${channelId}&key=${process.env.REACT_APP_GOOGLE_API_KEY_10}`
  //   );
  //   const data = await response.json();
  //   return data?.items?.[0]?.snippet?.thumbnails?.default?.url;
  // };

  // const { data: channelIcon2 } = useQuery({
  //   queryKey: ["channelIcon", channelId],
  //   queryFn: () => get_channel_icon(channelId),
  //   refetchOnWindowFocus: false,
  //   refetchOnmount: false,
  //   refetchOnReconnect: false,
  //   retry: false,
  //   staleTime: 1000 * 60 * 60 * 24,
  //   cacheTime: 1000 * 60 * 60 * 24,
  // });

  const articleCard = article.attributes;
  const media = articleCard?.media?.data;
  const isImageType = media?.length ? media[0]?.attributes.mime?.includes('image') : '';
  const mediaUrl = media?.length > 0 ? media[0].attributes?.url ? media[0].attributes?.url : news_default : '';
  const videoRef = useRef(null);
  return (
    <article
      className="flex w-full flex-col 
     rounded-lg shadow-lg dark:bg-zinc-800 dark:text-white"
      style={{ height: '100%' }}>
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
                          className="h-56 
  w-full object-cover rounded-t-lg shadow-sm"
                        />
                      </SwiperSlide>
                    ))
                  }

                </Swiper>

              ) : (
                <>
                  <video ref={videoRef} controls={true} autoplay={true} onMouseOver={event => event?.target?.play()} muted loop name="media" class="w-full object-cover rounded-t-lg shadow-sm">
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                </>
              )
            }
          </>
        ) : articleCard.videoUrl?.url && (<div className="article-card flex flex-col" dangerouslySetInnerHTML={{ __html: articleCard.videoUrl?.url }}></div>)
      }
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col p-4">
          <h2 className="font-bold font-serif">{articleCard.title}</h2>
          {articleCard.description && <section className="mt-2 flex-1">
            <p className="text-xs line-clamp-6">{articleCard.description}</p>
          </section>
          }
          <footer
            className="text-xs flex space-x-1 pt-3 italic text-gray-400"
          >
            <p>{articleCard.source} - </p>
            <p>{moment(articleCard.publishedAt).fromNow()}</p>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
