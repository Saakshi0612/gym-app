import SearchError from "../../assets/images/searchError.svg";

export default function ShowError() {
  return (
    <div className="flex flex-col items-center gap-3">
      <img src={SearchError} alt="" />
      <p className="text-lg text-primary-black font-bold">
        No Workouts available
      </p>
      <p className="text-primary-black text-sm">
        It looks like there are no more available slots. Please try refining
        your search
      </p>
    </div>
  );
}
