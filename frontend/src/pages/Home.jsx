import AppLayout from "../components/AppLayout";
import FeedList from "../components/FeedList";
import FeedTabs from "../components/FeedTabs";
import PostComposer from "../components/PostComposer";
import { useAuth } from "../stores/authStore";

function Home() {
  const { currentUser } = useAuth();
  return (
    <AppLayout>
      <FeedTabs />
      {!currentUser?.isAdmin && <PostComposer />}
      <FeedList />
    </AppLayout>
  );
}

export default Home;