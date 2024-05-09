import { useQuery } from "@tanstack/react-query";
import BlankScreen from "../../common/blankScreen";
import Loader from "../../common/loader";
import { getIngredients } from "./api";

export default function Ingredients() {
  const query = useQuery({queryKey: ["ingredients"], queryFn: getIngredients})
  console.log(query);
  const { isLoading, isError: onGetError, error, isSuccess: onGetSuccess, data } = query;

  function onAdd() {
    console.log("Add ingredient");
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl">Ingredients</h1>

        {isLoading && <Loader />}
        {onGetSuccess && (data.length === 0 ? <BlankScreen name="Ingredients" onAdd={onAdd} /> : <div></div>)}
        {onGetError && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
}
