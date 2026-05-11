import {
  RiBookmarkLine,
} from "react-icons/ri";

import AppLayout
from "../components/AppLayout";

function Bookmarks() {

  return (

    <AppLayout>

      <div
        className="
          min-h-screen
          relative
          overflow-hidden
          bg-black
        "
      >

        {/* TOP BAR */}
        <div
          className="
            sticky top-0
            z-20
            h-[53px]
            px-5
            flex
            flex-col
            justify-center
            backdrop-blur-md
            bg-black/80
            border-b
            border-[#2f3336]
          "
        >

          <h1
            className="
              text-[20px]
              font-bold
              leading-tight
              text-white
            "
          >
            Bookmarks
          </h1>

        </div>

        {/* WALLPAPER */}
        <div
          className="
            absolute inset-0
            opacity-[0.05]
            pointer-events-none
          "
          style={{
            backgroundImage:
              "url('https://w0.peakpx.com/wallpaper/205/291/HD-wallpaper-dark-doodle.jpg')",
            backgroundSize: "500px",
            backgroundPosition: "center",
          }}
        />

        {/* CONTENT */}
        <div
          className="
            relative z-10
            min-h-[calc(100vh-53px)]
            flex
            items-center
            justify-center
            px-6
          "
        >

          <div
            className="
              max-w-[520px]
              text-center
            "
          >

            <div
              className="
                w-24 h-24
                rounded-full
                bg-[#16181c]
                flex
                items-center
                justify-center
                mx-auto
                mb-6
              "
            >

              <RiBookmarkLine
                className="
                  text-[42px]
                  text-[#1d9bf0]
                "
              />

            </div>

            <h2
              className="
                text-[42px]
                font-extrabold
                mb-3
                text-white
              "
            >
              Bookmark feature
              coming soon...
            </h2>

            <p
              className="
                text-[#71767b]
                text-[15px]
                leading-7
              "
            >
              Save posts, organize collections,
              revisit important tweets and
              manage bookmarks easily.
            </p>

          </div>

        </div>

      </div>

    </AppLayout>

  );

}

export default Bookmarks;