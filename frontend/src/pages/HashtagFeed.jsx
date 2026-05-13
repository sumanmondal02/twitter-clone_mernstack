import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import ProfilePostsSkeleton from "../components/ProfilePostsSkeleton";
import { usePost } from "../stores/postStore";
import axios from "axios";

const API = import.meta.env.VITE_URL;

function HashtagFeed() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { posts, resetFeed } = usePost();
  const [hashtagPostIds, setHashtagPostIds] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        resetFeed();
        const res = await axios.get(
          `${API}/post-api/hashtag/${encodeURIComponent(tag)}`,
          { withCredentials: true }
        );
        const fetched = res.data.payload || [];
        // inject into postStore so toggleLike works
        usePost.setState({ posts: fetched });
        setHashtagPostIds(fetched.map(p => p._id));
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [tag]);

  // read from store so likes update live
  const displayedPosts = posts.filter(p => hashtagPostIds.includes(p._id));

  return (
    <AppLayout>
      <div className="min-h-screen border-x border-[#2f3336]">
        {/* TOP BAR */}
        <div className="sticky top-0 z-30 backdrop-blur-md bg-black/70 px-4 py-3 flex items-center gap-4 border-b border-[#2f3336]">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 rounded-full hover:bg-[#16181c] transition flex items-center justify-center text-white text-[20px]"
          >
            ←
          </button>
          <div>
            <div className="text-white font-bold text-[18px]">#{tag}</div>
            <div className="text-[#71767b] text-[13px]">{displayedPosts.length} posts</div>
          </div>
        </div>

        {/* POSTS */}
        <div className="pb-20">
          {isLoading ? (
            <ProfilePostsSkeleton />
          ) : displayedPosts.length === 0 ? (
            <div className="py-16 text-center text-[#71767b]">No posts with #{tag}</div>
          ) : (
            displayedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default HashtagFeed;