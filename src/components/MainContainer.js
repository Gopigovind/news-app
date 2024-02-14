import React, { useEffect, useState } from "react";
import BlockComponent from './BlockComponent';
import { BASE_URL } from "./../utils/constants";
import { isMobile } from '../utils/helper';

const MainContainer = () => {

  const [data, setData] = useState(null);
  
  const getData = async () => {
    const pathUrl = `${BASE_URL}/pages?populate=*`;
      const response = await fetch(pathUrl);
      const data = await response.json();
      setData(data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className=" flex-1 bg-white dark:bg-zinc-900 transition-all duration-500">
      {/* <Tags />
      <VideoContainer />
       */}
       {
        data?.length > 0 && data[0].attributes.blocks.map((item, index) => (
          <div
        className={`grid pt-6 ${isMobile ? 'px-2' : 'px-8'}`}
      >
        <BlockComponent component={item.__component} />
      </div>
        ))
       }
    </div>
  );
};

export default MainContainer;
