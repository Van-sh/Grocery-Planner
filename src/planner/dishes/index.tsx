import { useGetDishesQuery } from "./api";
import Loader from "../../common/loader";
import GetErrorScreen from "../../common/getErrorScreen";
import { getErrorMessage } from "../../helper";
import List from "./list";

export default function Dishes() {
  const {
    isLoading,
    isError: isGetError,
    error,
    isSuccess: isGetSuccess,
    data: { data = [] } = {},
    refetch,
  } = useGetDishesQuery();

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl">Dishes</h1>
        {isLoading && <Loader />}
        {isGetSuccess && <List data={data}/>}
        {isGetError && (
          <GetErrorScreen errorMsg={getErrorMessage(error)} onRetry={refetch} />
        )}
      </div>
    </div>
  );
}
