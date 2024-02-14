import { useRef, Fragment, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import Shimmer from "./Shimmer";

import { useSelector, useDispatch } from "react-redux";

import { BASE_URL } from "./../utils/constants";
import { Link, useLocation, useParams } from "react-router-dom";
import { changeCategory } from "../utils/categorySlice";
import Tags from "./Tags";
import { isMobile } from '../utils/helper';

const FeaturedNewsComponent = ({ data }) => {
    const category = useSelector((store) => store.newsCategory.category);
    const dispatch = useDispatch();
    const location = useLocation();
    let { state = localStorage.getItem('stateValue'), district = '', taluk = '', newsCategory = '' } = useParams();

    newsCategory = newsCategory === state ? '' : newsCategory;

    state = decodeURIComponent(state);
    district = decodeURIComponent(district);
    taluk = decodeURIComponent(taluk);
    newsCategory = decodeURIComponent(newsCategory);

    const [path, setPath] = useState('');

    const [headlineData, setHeadlineData] = useState([]);

    const [tagName, setTagName] = useState('');

    const tagHandler = (data) => {
        setTagName(data?.attributes?.name);
    };

    useEffect(() => {
        if (data?.headlines?.data?.length > 0) {
            setHeadlineData(data.headlines.data);
        }
    }, [data]);

    useEffect(() => {
        if (data?.headlines?.data?.length > 0) {
            const filterData = tagName ? data?.headlines?.data.filter((item) => item.attributes.district?.data?.attributes?.name === tagName) : data;
            setHeadlineData(filterData);
        }
    }, [tagName]);

    useEffect(() => {
        if (state || district || taluk) {
            dispatch(changeCategory({ type: decodeURIComponent(location.pathname), value: decodeURIComponent(location.pathname) }));
            const statePath = state ? `/${state}` : '';
            const districtPath = district ? `/${district}` : '';
            const talukpath = taluk ? `/${taluk}` : '';
            setPath(`/news${statePath}${districtPath}${talukpath}`);
        }
    }, [state, district, taluk]);

    return (
        <>
            {
                data?.headlines?.data?.length > 0 && (
                    <>
                        <div className='dark:bg-zinc-800 dark:text-white flex justify-between items-center py-4 px-2 '>
                            <header className='font-bold'>
                                <h3>{data?.header?.title}</h3>
                            </header>
                            <a className='font-bold' href={data?.readMore?.href} target={data?.readMore?.target}>{data?.readMore?.label}</a>
                        </div>
                        <div className="w-full"><Tags tagHanler={tagHandler} /></div>
                        <div
                            className={`pt-4 grid justify-center justify-items-center grid-cols-[repeat(auto-fill,minmax(310px,_1fr))] max-xl:grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] gap-[2rem_1rem] overflow-x-hidden`}
                        >
                            {
                                headlineData?.map((article, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            className="w-full flex"
                                            to={{
                                                pathname: `${path}/${article?.attributes?.slug}`,
                                                state: article,
                                            }}
                                        >
                                            <VideoCard article={article} />
                                        </Link>
                                    );
                                })}
                        </div>
                    </>
                )
            }
        </>
    );
};

export default FeaturedNewsComponent;
