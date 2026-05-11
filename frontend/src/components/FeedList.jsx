import {
  useEffect,
  useRef,
} from "react";

import PostCard from "./PostCard";

import { usePost }
from "../stores/postStore";

function FeedList() {

  const {
    posts,
    feedType,

    fetchExploreFeed,
    fetchFollowingFeed,

    hasMore,
    isFetchingMore,
    isLoadingFeed,

  } = usePost();

  const observerRef =
    useRef(null);

  // =========================
  // INFINITE SCROLL
  // =========================
  useEffect(() => {

    if (!hasMore) return;

    const currentRef =
      observerRef.current;

    const observer =
      new IntersectionObserver(
        async (entries) => {

          const first =
            entries[0];

          if (
            first.isIntersecting &&
            !isFetchingMore
          ) {

            if (
              feedType ===
              "explore"
            ) {

              await fetchExploreFeed();

            } else {

              await fetchFollowingFeed();

            }

          }

        },
        {
          threshold: 0.1,
        }
      );

    if (currentRef) {

      observer.observe(
        currentRef
      );

    }

    return () => {

      if (currentRef) {

        observer.unobserve(
          currentRef
        );

      }

    };

  }, [
    posts.length,
    hasMore,
    isFetchingMore,
    feedType,
  ]);

  // =========================
  // INITIAL SKELETON
  // =========================
  if (
    isLoadingFeed &&
    posts.length === 0
  ) {

    return (

      <div className="space-y-4 p-4">

        {[...Array(5)].map((_, i) => (

          <div
            key={i}
            className="
              animate-pulse
              border-b
              border-[#2f3336]
              pb-5
            "
          >

            <div className="flex gap-3">

              <div
                className="
                  w-10 h-10
                  rounded-full
                  bg-[#202327]
                "
              />

              <div className="flex-1">

                <div
                  className="
                    h-4
                    w-40
                    rounded
                    bg-[#202327]
                    mb-3
                  "
                />

                <div
                  className="
                    h-4
                    w-full
                    rounded
                    bg-[#202327]
                    mb-2
                  "
                />

                <div
                  className="
                    h-4
                    w-[80%]
                    rounded
                    bg-[#202327]
                  "
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    );

  }

  return (

    <div>

      {
        posts.filter((post) => post.userId).map((post) => (

          <PostCard
            key={post._id}
            post={post}
          />

        ))
      }

      {/* LOAD MORE */}
      {
  hasMore && (

    <div ref={observerRef}>

      {
        isFetchingMore && (

          <div className="space-y-4 p-4">

            {[...Array(3)].map((_, i) => (

              <div
                key={i}
                className="
                  animate-pulse
                  border-b
                  border-[#2f3336]
                  pb-5
                "
              >

                <div className="flex gap-3">

                  <div
                    className="
                      w-10 h-10
                      rounded-full
                      bg-[#202327]
                    "
                  />

                  <div className="flex-1">

                    <div
                      className="
                        h-4
                        w-40
                        rounded
                        bg-[#202327]
                        mb-3
                      "
                    />

                    <div
                      className="
                        h-4
                        w-full
                        rounded
                        bg-[#202327]
                        mb-2
                      "
                    />

                    <div
                      className="
                        h-4
                        w-[70%]
                        rounded
                        bg-[#202327]
                      "
                    />

                  </div>

                </div>

              </div>

            ))}

          </div>

        )
      }

    </div>

  )
}

    </div>

  );

}

export default FeedList;