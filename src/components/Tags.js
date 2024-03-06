import { tags } from "../utils/constants";
// import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { BASE_URL } from "./../utils/constants";
import { handleScroll, isMobile } from "../utils/helper";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link, useParams } from 'react-router-dom';
import { changeCategory } from "../utils/categorySlice";

const Tags = ({ tagHanler }) => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  const stateName = useSelector((store) => store.app.stateName);
  const districtName = useSelector((store) => store.app.districtName);
  const talukName = useSelector((store) => store.app.talukName);
  let { state = stateName, district = districtName, taluk = talukName, mainCategory = '' } = useParams();
  mainCategory = mainCategory === state ? '' : mainCategory;


  state = decodeURIComponent(state);
  district = decodeURIComponent(district);
  taluk = decodeURIComponent(taluk);
  mainCategory = decodeURIComponent(mainCategory);
  const localeName = useSelector((store) => store.app.locale);

  const [active, setActive] = useState(district || '');

  const handleSetHomeVideoByKeyword = (tag) => {
    if (active !== tag) {
      setActive(tag);
      tagHanler && tagHanler(tag);
    }
  };

  const [tags, setTags] = useState({ path: '', items: [] });
  const districtHandler = async (state) => {
    const response = await fetch(`${BASE_URL}/districts?locale=${localeName}&fields[0]=name&populate[state][fields][0]=name&filters[state][name][$in][0]=${state}`);
    const { data } = await response.json();
    setTags({ path: `/${state}`, items: data });
  }
  const talukHandler = async (district) => {
    const response = await fetch(`${BASE_URL}/taluks?locale=${localeName}&fields[0]=name&populate[state][fields][0]=name&populate[district][fields][0]=name&filters[district][name][$in][0]=${district}`);
    const { data } = await response.json();
    setTags({ path: `/${state}/${district}`, items: data });
  }

  const cityHandler = async (taluk) => {
    const response = await fetch(`${BASE_URL}/localities?locale=${localeName}&fields[0]=name&populate[state][fields][0]=name&populate[district][fields][0]=name&populate[taluk][fields][0]=name&filters[taluk][name][$in][0]=${taluk}`);
    const { data } = await response.json();
    setTags(data);
  }

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

  useEffect(() => {
    if (!taluk) {
      handleScroll("tags-wrapper");
    }
  }, []);


  useEffect(() => {
    if (!district) {
      districtHandler(state);
    }
    if (district && !taluk) {
      talukHandler(district);
    }
  }, [district, taluk, state, localeName]);

  return (
    <>
      {
        !taluk ? (
          <div
            className={`tags ${!isMobile ? 'mx-4' : ''} flex text-sm items-center pt-2`}
          >
            <div className="tags-wrapper flex w-full overflow-x-hidden overflow-y-hidden ">
              <Swiper
                navigation={!isMobile} modules={[Navigation]}
                spaceBetween={20}
                breakpoints={{
                  320: {
                    slidesPerView: 2.5
                  },
                  480: {
                    slidesPerView: 3.5
                  },
                  640: {
                    slidesPerView: 4
                  },
                  768: {
                    slidesPerView: 5
                  },
                  1024: {
                    slidesPerView: 6.5,
                  },
                }}
                className="mySwiper"
              >
                {tags?.items?.map((tag, index) => {
                  return (
                    <SwiperSlide>
                      <Link
                        replace
                        state={{ type: '', value: tag.id, item: tag }}
                        to={{
                          pathname: `${mainCategory ? `/${mainCategory}` : (localStorage.getItem('mainCategory') || '')}${tags.path}/${tag.attributes.name}`,
                          state: tag,
                        }}
                      >
                        <button
                          className={`tag px-2 w-full py-2 cursor-pointer rounded-lg ${active === tag
                            ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-900"
                            : " bg-gray-100  dark:text-white dark:bg-zinc-800"
                            }`}
                          key={index}
                          onClick={() => handleSetHomeVideoByKeyword(tag)}
                        >
                          <span className="whitespace-nowrap">{tag.attributes.name}</span>
                        </button>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        ) : null
      }
    </>
  );
};

export default Tags;
