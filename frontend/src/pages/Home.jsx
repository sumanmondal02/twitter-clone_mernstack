import AppLayout from "../components/AppLayout";
import FeedList from "../components/FeedList";
import FeedTabs from "../components/FeedTabs";
import PostComposer from "../components/PostComposer";

function Home() {
  return (
    <AppLayout>
      <FeedTabs />

      <PostComposer />

      <FeedList />
    </AppLayout>
  );
}

export default Home;