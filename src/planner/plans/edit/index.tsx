import { useParams } from "react-router-dom";
import GetErrorScreen from "../../../common/getErrorScreen";
import Loader from "../../../common/loader";
import { DataContext } from "../../../common/mealCards/context";
import { getErrorMessage } from "../../../helper";
import { useGetPlanQuery } from "../api";
import { defaultPlan } from "./constants";
import EditPlanForm from "./editPlanForm";

export default function EditPlan() {
  const { id = "" } = useParams();
  const {
    isLoading,
    isError: isGetError,
    error,
    isSuccess: isGetSuccess,
    data: { data = defaultPlan } = {},
    refetch,
  } = useGetPlanQuery(id);

  return (
    <>
      {isLoading && <Loader />}
      {isGetSuccess && (
        <DataContext.Provider value={{ data }}>
          <EditPlanForm refetch={refetch} />
        </DataContext.Provider>
      )}
      {isGetError && <GetErrorScreen errorMsg={getErrorMessage(error)} onRetry={refetch} />}
    </>
  );
}
