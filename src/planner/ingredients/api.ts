import { API_URL } from "../../constants";
import { TIngredients, TIngredientsBase } from "./types";

export const getIngredients = (query: string = ""): Promise<TIngredients[]> => {
  const searchQueries = new URLSearchParams();
  if (query) searchQueries.append("q", query);
  return fetch(
    `${API_URL}/api/ingredients?${searchQueries.toString()}`
  )
     .then((response) => response.json())
     .then(({ data }) => data);
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
