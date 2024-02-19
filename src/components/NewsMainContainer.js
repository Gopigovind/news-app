import VideoContainer from "./VideoContainer";
import Tags from "./Tags";
import Modal from './Modal';

const NewsMainContainer = () => {

  return (
    <div className=" flex-1 bg-white dark:bg-zinc-900 transition-all duration-500">
      <Modal />
      <Tags />
      <VideoContainer /> 
    </div>
  );
};

export default NewsMainContainer;
