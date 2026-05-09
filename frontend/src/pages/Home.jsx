import AppLayout from "../components/AppLayout";
import FeedTabs from "../components/FeedTabs";
import PostComposer from "../components/PostComposer";

function Home() {
  return (
    <AppLayout>
      <FeedTabs />

      <PostComposer />
    </AppLayout>
  );
}

export default Home;