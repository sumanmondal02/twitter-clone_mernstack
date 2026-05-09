import * as s from "../styles/common";

function FeedTabs() {
  return (
    <div className={s.tabBar}>
      <div className={s.tabActive}>
        For you

        <div className={s.tabIndicator}></div>
      </div>

      <div className={s.tab}>
        Following
      </div>
    </div>
  );
}

export default FeedTabs;