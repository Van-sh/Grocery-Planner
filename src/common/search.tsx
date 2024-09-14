import { Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, type Dispatch } from "react";

type Props = {
   name?: string;
   query: string;
   setQuery: Dispatch<React.SetStateAction<string>>;
};

export default function Search({ name = "", query, setQuery }: Props) {
   name = name ? ` ${name}` : name;

   const [debouncedQuery, setDebouncedQuery] = useState(query);
   const previousQuery = useRef(query);

   useEffect(() => {
      const intervalId = setTimeout(() => {
         if (previousQuery.current !== debouncedQuery) {
            setQuery(debouncedQuery);
            previousQuery.current = debouncedQuery;
         }
      }, 750);

      return () => {
         clearTimeout(intervalId);
      };
   }, [debouncedQuery, setQuery]);

   return (
      <Input
         className="sm:max-w-96"
         placeholder={`Search${name}`}
         value={debouncedQuery}
         onValueChange={setDebouncedQuery}
         startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
      />
   );
}
