import { tags } from "../utils/constants";
// import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useEffect, useState } from "react";
import { BASE_URL } from "./../utils/constants";
import { handleScroll, isMobile } from "../utils/helper";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link, useParams } from 'react-router-dom';
import { changeCategory } from "../utils/categorySlice";

const Tags = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  const [active, setActive] = useState('All');
  let { state = localStorage.getItem('stateValue'), district = '', taluk = '', newsCategory = '' } = useParams();
  newsCategory = newsCategory === state ? '' : newsCategory;
  const handleSetHomeVideoByKeyword = (tag) => {
    if (active !== tag) {
      setActive(tag);
    }
  };

  state = decodeURIComponent(state);
  district = decodeURIComponent(district);
  taluk = decodeURIComponent(taluk);
  newsCategory = decodeURIComponent(newsCategory);

  const [tags, setTags] = useState({ path: '', items: [] });
  const districtHandler = async (state) => {
    const response = await fetch(`${BASE_URL}/districts?fields[0]=name&populate[state][fields][0]=name&filters[state][name][$in][0]=${state}`);
    const { data } = await response.json();
    setTags({ path: `/${state}`, items: data });
  }
  const talukHandler = async (district) => {
    const response = await fetch(`${BASE_URL}/taluks?fields[0]=name&populate[state][fields][0]=name&populate[district][fields][0]=name&filters[district][name][$in][0]=${district}`);
    const { data } = await response.json();
    setTags({ path: `/${state}/${district}`, items: data });
  }

  const cityHandler = async (taluk) => {
    const response = await fetch(`${BASE_URL}/localities?fields[0]=name&populate[state][fields][0]=name&populate[district][fields][0]=name&populate[taluk][fields][0]=name&filters[taluk][name][$in][0]=${taluk}`);
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
    if (!newsCategory) {
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
  }, [district, taluk, state]);

  return (
    <>
      {
        !newsCategory ? (
          <div
            className={`tags ${!isMobile ? 'mx-4' : ''} flex text-sm items-center ${isMenuOpen
              ? "lg:w-[calc(100vw-19rem)] w-[calc(100vw-8rem)]"
              : "lg:w-[calc(100vw-8rem)] w-[calc(100vw-3rem)]"
              } min-w-[250px]
      pt-2`}
          >
            <div className="tags-wrapper flex w-full overflow-x-hidden overflow-y-hidden ">
              {tags?.items?.map((tag, index) => {
                return (

                  <Link
                    replace
                    state={{ type: '', value: tag.id, item: tag }}
                    to={{
                      pathname: `${tags.path}/${tag.attributes.name}`,
                      state: tag,
                    }}
                  >
                    <button
                      className={`tag  px-3 w-fit py-2 mx-2 cursor-pointer rounded-lg ${active === tag
                        ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-900"
                        : " bg-gray-100  dark:text-white dark:bg-zinc-800"
                        }`}
                      key={index}
                      onClick={() => handleSetHomeVideoByKeyword(tag)}
                    >
                      <span className="whitespace-nowrap">{tag.attributes.name}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null
      }
    </>
  );
};

export default Tags;
