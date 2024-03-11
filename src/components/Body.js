import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import BreadCrum from "./BreadCrum";
import { isMobile } from '../utils/helper';

const Body = () => {
  return (
    <div className={`${isMobile ? '' : 'flex'} bg-white dark:bg-zinc-800 transition-all duration-500 `}>
      <SideBar />
      {/* {isMobile && <BreadCrum />} */}
      <Outlet />
    </div>
  );
};

export default Body;
