// src/components/SchedulePopover.jsx
import { useEffect, useRef, useState } from "react";

function SchedulePopover({ scheduledDate, setScheduledDate, closeSchedule }) {
  const popoverRef = useRef(null);

  // Initialize from existing scheduledDate or default to now+1hr
  const getInitial = () => {
    const base = scheduledDate ? new Date(scheduledDate) : new Date();
    if (!scheduledDate) base.setHours(base.getHours() + 1, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    return {
      date: `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`,
      time: `${pad(base.getHours())}:${pad(base.getMinutes())}`,
    };
  };

  const initial = getInitial();
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        closeSchedule();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirm = () => {
    if (!date || !time) return;
    const combined = new Date(`${date}T${time}`);
    if (isNaN(combined.getTime())) return;
    setScheduledDate(combined);
    closeSchedule();
  };

  return (
    <div
      ref={popoverRef}
      className="
        absolute left-0 top-full mt-2
        z-[9999]
        w-[290px]
        bg-black
        border border-[#2f3336]
        rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.9)]
        p-5
        flex flex-col gap-4

        max-sm:fixed
        max-sm:left-1/2
        max-sm:-translate-x-1/2
        max-sm:bottom-[80px]
        max-sm:top-auto
        max-sm:w-[90vw]
        max-sm:max-w-[340px]
      "
    >
      <h2 className="text-white text-[17px] font-bold">Schedule Post</h2>

      {/* Date picker */}
      <div className="flex flex-col gap-1">
        <label className="text-[#71767b] text-[12px] font-semibold uppercase tracking-wide">
          Date
        </label>
        <input
          type="date"
          value={date}
          min={todayStr}
          onChange={(e) => setDate(e.target.value)}
          className="
            w-full bg-transparent
            border border-[#2f3336]
            rounded-xl px-4 py-2.5
            text-white text-[14px]
            outline-none
            focus:border-[#1d9bf0]
            transition
            [color-scheme:dark]
          "
        />
      </div>

      {/* Time picker */}
      <div className="flex flex-col gap-1">
        <label className="text-[#71767b] text-[12px] font-semibold uppercase tracking-wide">
          Time
        </label>
        <input
          type="time"
          value={time}
          min={
            date === todayStr
              ? new Date()
                  .toTimeString()
                  .slice(0, 5)
              : undefined
          }
          onChange={(e) =>
            setTime(e.target.value)
          }
          className="
            w-full bg-transparent
            border border-[#2f3336]
            rounded-xl px-4 py-2.5
            text-white text-[14px]
            outline-none
            focus:border-[#1d9bf0]
            transition
            [color-scheme:dark]
          "
        />
      </div>

      {/* Preview */}
      {date && time && (
        <p className="text-[#1d9bf0] text-[13px]">
          {" "}
          {new Date(`${date}T${time}`).toLocaleString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "numeric", minute: "2-digit",
          })}
        </p>
      )}

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        disabled={!date || !time}
        className="
          w-full bg-[#1d9bf0]
          hover:bg-[#1a8cd8]
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition text-white
          font-bold py-2.5
          rounded-full text-[15px]
        "
      >
        Confirm
      </button>
    </div>
  );
}

export default SchedulePopover;