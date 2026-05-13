function ProfilePostsSkeleton() {
  return (
    <div className="animate-pulse">
      {[1,2,3].map((item) => (
        <div
          key={item}
          className="
            border-b
            border-[#2f3336]
            px-4
            py-4
            flex
            gap-3
          "
        >
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-[#202327]
            "
          />

          <div className="flex-1">
            <div
              className="
                h-4
                w-[140px]
                rounded-full
                bg-[#202327]
                mb-3
              "
            />

            <div
              className="
                h-3
                w-[90px]
                rounded-full
                bg-[#202327]
                mb-4
              "
            />

            <div
              className="
                h-4
                w-full
                rounded-full
                bg-[#202327]
                mb-2
              "
            />

            <div
              className="
                h-4
                w-[80%]
                rounded-full
                bg-[#202327]
              "
            />

          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfilePostsSkeleton;