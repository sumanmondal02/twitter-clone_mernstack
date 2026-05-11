import * as s from "../styles/common";

function PostSkeleton() {
  return (
    <div className={s.tweetCard}>
      <div className={ s.skeletonCircle( "w-10 h-10")}/>
      <div className="flex-1">
        <div className="flex gap-2 mb-3">
          <div className={`${s.skeletonLine} w-[120px]`}/>
          <div className={`${s.skeletonLine} w-[80px]`}/>
        </div>
        <div className={`${s.skeletonLine} w-full mb-2`}/>
        <div className={`${s.skeletonLine} w-[70%] mb-4`}/>
        <div className={`${s.skeletonRect} h-[280px] w-full`}/>
      </div>
    </div>
  );
}

export default PostSkeleton;