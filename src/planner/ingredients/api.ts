import { TIngredientsBase, TIngredientsGetAllQuery, TIngredientsResponse } from "./types";

const API_URL = process.env.REACT_APP_API_URL

export const getIngredients = ({
  query = "",
  page = 1,
}: TIngredientsGetAllQuery): Promise<TIngredientsResponse> => {
  const searchQueries = new URLSearchParams({ page: page.toString() });
  if (query) searchQueries.append("q", query);
  return fetch(
    `${API_URL}/api/ingredients?${searchQueries.toString()}`
  ).then((response) => response.json());
};


export const createIngredient = (data: TIngredientsBase): Promise<TIngredientsBase> => {
  return fetch(`${API_URL}/api/ingredients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(({ data }) => data);
};

export const updateIngredient = ({ data, id }: { data: TIngredientsBase; id: string }): Promise<TIngredientsBase> => {
  return fetch(`${API_URL}/api/ingredients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(({ data }) => data);
};

export const deleteIngredient = (id: string): Promise<void> => {
  return fetch(`${API_URL}/api/ingredients/${id}`, {
    method: "DELETE"
  }).then(response => response.json());
};
