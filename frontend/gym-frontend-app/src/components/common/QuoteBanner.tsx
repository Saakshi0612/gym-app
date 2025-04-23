import img from "../../assets/images/sidebar.png"
// src/components/common/QuoteBanner.tsx
export const QuoteSidebar = () => {
    return (
      <div className="relative  h-[90vh] hidden lg:block lg:w-[45%] my-auto  rounded-md ">
       
        <div className="absolute inset-0">
          <img
            src= {img} // Replace with actual image path
            alt="Background"
            className="h-full w-full object-cover  rounded-2xl"
          />
          <div className="absolute inset-0 /30" /> {/* Overlay */}
        </div>
 
        {/* Quote Text */}
        <div className="relative h-full flex mt-[50px] justify-center p-8">
          <p className="text-xl absolute md:text-xl font-lexend text-center text-white max-w-2xl leading-snug bottom-[166px] px-5">
            “The path to triumph is paved with the <span className="text-[#9EF300]">strength to train hard</span> and the perseverance to <span className="text-[#9EF300]">rise each time you fall.</span>”
          </p>
        </div>
      </div>
    );
  };