import React from "react";
import { useLocation, Link, useParams } from 'react-router-dom';
import { BsHouseDownFill } from "react-icons/bs";

const BreadCrum = () => {

    const location = useLocation();

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
                    <nav aria-label="Breadcrumb">
                        <ol role="list" class="flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-4">
                            <li>
                                <div class="flex items-center">
                                    <Link to="/" class="font-semibold text-sm text-slate-500 hover:text-slate-600 sm:block">
                                    <BsHouseDownFill className="text-zinc-700" size="1.2rem" />
                                    </Link>
                                    <div aria-hidden="true" class="font-semibold mx-2 select-none text-slate-400 sm:block">/</div>
                                </div>
                            </li>
                            {
                                pathList()?.map((path, index) => (
                                    <li>
                                        <div class="flex items-center">
                                            <Link to={`/${pathList().slice(0, index + 1).join('/')}`} class="font-semibold text-sm text-slate-500 hover:text-slate-600 sm:block" style={path.length > 50 ? textEllipse : {whiteSpace: "nowrap"}}>{path.replaceAll('%20', ' ')}</Link>
                                            {
                                                (pathList().length - 1 !== index) ? (
                                                    <div aria-hidden="true" class="font-semibold mx-2 select-none text-slate-400 sm:block">/</div>
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