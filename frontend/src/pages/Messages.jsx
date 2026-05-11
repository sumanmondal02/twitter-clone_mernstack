import {
  RiChat1Line,
} from "react-icons/ri";

import AppLayout
from "../components/AppLayout";

function Messages() {

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
            items-center
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
              text-white
            "
          >
            Messages
          </h1>

        </div>

        {/* WALLPAPER */}
        <div
          className="
            absolute inset-0
            opacity-[0.045]
            pointer-events-none
          "
          style={{
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/previews/013/220/073/non_2x/doodle-school-things-background-pattern-vector.jpg')",
            backgroundSize: "420px",
          }}
        />

        {/* CONTENT */}
        <div
          className="
            relative z-10
            min-h-[calc(100vh-53px)]
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-6
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
              mb-6
            "
          >

            <RiChat1Line
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
            Chat feature coming soon...
          </h2>

          <p
            className="
              text-[#71767b]
              text-[15px]
              leading-7
              max-w-[500px]
            "
          >
            Direct messages, realtime conversations,
            media sharing and private chats
            will be added soon.
          </p>

        </div>

      </div>

    </AppLayout>

  );

}

export default Messages;