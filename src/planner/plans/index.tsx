import { useState } from "react";
import Loader from "../../common/loader";
import Search from "../../common/search";
import { useGetPlansQuery } from "./api";
import BlankScreen from "../../common/blankScreen";
import GetErrorScreen from "../../common/getErrorScreen";
import { getErrorMessage } from "../../helper";
import { Button } from "@nextui-org/react";
import PlusIcon from "../../assets/plus";

export default function Plans() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const {
    isLoading,
    isError: isGetError,
    error,
    isSuccess: isGetSuccess,
    data: { data = [], count = 0 } = {},
    refetch,
  } = useGetPlansQuery({ query, page });

  return (
    <div className="flex justify-center">
      <div className="max-w-[1024px] w-full px-6">
        <h1 className="text-2xl mb-6">Meal Plans</h1>
        <Search name="Plans" query={query} setQuery={setQuery} />

        {isLoading && <Loader />}
        {isGetSuccess &&
          (data.length === 0 ? <BlankScreen name="Meal Plans" onAdd={console.log} /> : <></>)}
        {isGetError && <GetErrorScreen errorMsg={getErrorMessage(error)} onRetry={refetch} />}
        <Button
          color="primary"
          variant="shadow"
          className="fixed bottom-8 right-8"
          onClick={console.log}
        >
          <PlusIcon />
          Create
        </Button>
      </div>
    </div>
  );
}
