import * as s from "../styles/common";
import { useEffect } from "react";
import { usePost } from "../stores/postStore";

function FeedTabs() {

  const {
    feedType,
    setFeedType,
    fetchExploreFeed,
    fetchFollowingFeed,
    resetFeed,
  } = usePost();

  useEffect(() => { resetFeed();
    if (feedType === "explore") {
      fetchExploreFeed();
    } else {
      fetchFollowingFeed();
    }
  }, [feedType]);

  return (
    <div className={s.tabBar}>

      {/* FOR YOU */}
      <button
        onClick={() => {
          resetFeed();
          setFeedType("explore");
        }}
        className={
          feedType === "explore"
            ? s.tabActive
            : s.tab
        }
      >
        For you

        {
          feedType === "explore" && (
            <div
              className={s.tabIndicator}
            />
          )
        }
      </button>

      {/* FOLLOWING */}
      <button
        onClick={() => {
          resetFeed();
          setFeedType("following");
        }}
        className={
          feedType === "following"
            ? s.tabActive
            : s.tab
        }
      >
        Following

        {
          feedType === "following" && (
            <div
              className={s.tabIndicator}
            />
          )
        }
      </button>

    </div>
  );
}

export default FeedTabs;