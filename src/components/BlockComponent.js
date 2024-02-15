import react, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { Navigation } from 'swiper/modules';
import { BASE_URL } from "./../utils/constants";
import VideoCard from './VideoCard';
import FeaturedNewsComponent from './FeaturedNewsComponent';

const BlockComponent = (props) => {

    const { component } = props;

    const [data, setData] = useState(null);

    const getData = async () => {
        const pathUrl = `${BASE_URL}/pages?populate[blocks][populate]=${component},header,banner.image,readMore.image,headlines.media,headlines.state,headlines.district`;
        const response = await fetch(pathUrl);
        const data = await response.json();
        if (data?.data?.length > 0) {
            const blocks = data.data[0]?.attributes?.blocks;
            const itemData = blocks?.length > 0 && blocks.filter((item) => item.__component === component)[0];
            setData(itemData);
        } else {
            setData(null);
        }
    };

    const dispatch = useDispatch();
  const location = useLocation();
  let {state= localStorage.getItem('stateValue'), district='', taluk='', newsCategory=''} = useParams();
  const [path, setPath] = useState('')


  
  useEffect(() => {
    if (state || district || taluk) {
      // dispatch(changeCategory({ type: decodeURIComponent(location.pathname), value: decodeURIComponent(location.pathname) }));
      const statePath = state ? `/${state}` : '';
      const districtPath = district ? `/${district}` : '';
      const talukpath = taluk ? `/${taluk}` : '';
      setPath(`/news${statePath}${districtPath}${talukpath}`);
    }
  }, [state, district, taluk]);

    useEffect(() => {
        if (component) {
            getData();
        }
    }, [component]);

    return (
        <>
            {
                component === 'blocks.hero-banner' ? (
                    <div className='justify-center justify-items-center' style={{ display: 'inherit' }}>
                        <Swiper
                            navigation={true} modules={[Navigation]}
                            className="mySwiper"
                        >
                            {
                                data?.banner?.length > 0 && data?.banner?.map((item) => (
                                    <SwiperSlide>
                                        <a href={item.href} target={item.target} title={item.label}>
                                            <img
                                                src={item?.image?.data?.attributes?.url}
                                                alt={item?.image?.data?.attributes?.name}
                                                className="h-56 
  w-full object-cover rounded-t-lg shadow-sm"
                                            />
                                        </a>
                                    </SwiperSlide>
                                ))
                            }

                        </Swiper>
                    </div>
                ) : component === 'blocks.featured-news' ? (
                    <>
                    <FeaturedNewsComponent data={data} />
                    </>
                ) : (
                    data?.headlines?.data?.length > 0 && 
                    <div className='dark:bg-zinc-800 dark:text-white' style={{ display: 'inherit' }}>
                        <div className='title-parent flex justify-between items-center py-4 px-2 '>
                            <header className='font-bold'>
                                <h3>{data?.header?.title}</h3>
                            </header>
                            <a className='font-bold' href={data?.readMore?.href} target={data?.readMore?.target}>{data?.readMore?.label}</a>
                        </div>
                        <Swiper
                            navigation={true}
                            modules={[Navigation]}
                            spaceBetween={10}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                },
                                480: {
                                    slidesPerView: 2,
                                },
                                768: {
                                    slidesPerView: 3,
                                },
                                1600: {
                                    slidesPerView: 3,
                                },
                            }}
                            className="swiper-per-view"
                        >
                            {
                                data?.headlines?.data?.map((articleCard) => (
                                    <SwiperSlide>
                                        <Link
                          className=""
                          to={{
                            pathname: `${path}/${articleCard?.attributes?.slug}`,
                            state: articleCard,
                          }}
                        >
                                        <VideoCard article={articleCard}></VideoCard>
                        </Link>
                                    </SwiperSlide>
                                ))
                            }

                        </Swiper>
                    </div>
                )
            }

        </>
    )
};

export default BlockComponent;