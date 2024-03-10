import React from "react";
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, } from "react-redux";
import { BsHouseDownFill } from "react-icons/bs";

const BreadCrum = () => {

    const location = useLocation();
    const category = useSelector((store) => store.newsCategory.category);
    const stateName = useSelector((store) => store.app.stateName);
  const localeName = useSelector((store) => store.app.locale);
  const districtName = useSelector((store) => store.app.districtName);
  const talukName = useSelector((store) => store.app.talukName);
  const navigate = useNavigate();
  let {state= stateName, district=districtName, taluk=talukName, mainCategory='', newsCategory=''} = useParams();
    const pathList = () => {
        const pathItem = decodeURIComponent(location.pathname)?.split('/').filter(item => item && (item !== 'news'));
        return pathItem;
    }
    const textEllipse = {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: "30%",
        overflow: 'hidden'
    };
    return (
        <>
            {
                pathList()?.length > 0 ? (
                    <nav aria-label="Breadcrumb" className="shadow-sm relative dark:bg-zinc-800 dark:text-white">
                        <ol role="list" className="flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-4">
                            <li>
                                <div className="flex items-center">
                                    <a href="/" className="text-sm hover:text-slate-600 sm:block" > 
                                        <BsHouseDownFill className="dark:text-white" size="1.2rem" />
                                    </a>
                                    <div aria-hidden="true" className="mx-2 select-none sm:block">/</div>
                                </div>
                            </li>
                            {
                                pathList()?.map((path, index) => (
                                    <li>
                                        <div className="flex items-center">
                                            <Link to={`/${pathList().slice(0, index + 1).join('/')}`} className="text-sm hover:text-slate-600 sm:block" style={path.length > 50 ? textEllipse : {whiteSpace: "nowrap"}}>{path.replaceAll('%20', ' ')}</Link>
                                            {
                                                (pathList().length - 1 !== index) ? (
                                                    <div aria-hidden="true" className="mx-2 select-none sm:block">/</div>
                                                ) : null
                                            }
                                        </div>
                                    </li>
                                ))
                            }
                        </ol>
                    </nav>
                ) : null
            }
        </>
    )
}

export default BreadCrum;