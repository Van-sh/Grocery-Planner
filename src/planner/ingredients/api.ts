import axios, { AxiosError } from "axios";
import { API_URL } from "../../constants";
import { TIngredientsBase, TIngredientsGetAllQuery, TIngredientsResponse } from "./types";

export const getIngredients = ({ query = "", page = 1 }: TIngredientsGetAllQuery): Promise<TIngredientsResponse> => {
  const searchQueries = new URLSearchParams({ page: page.toString() });
  if (query) searchQueries.append("q", query);

  return axios
    .get(`${API_URL}/api/ingredients?${searchQueries.toString()}`)
    .then(({ data }) => data)
    .catch((error: AxiosError) => {
      throw error?.response?.data || error;
    });
};

export const createIngredient = (data: TIngredientsBase): Promise<TIngredientsBase> => {
  return axios.post(`${API_URL}/api/ingredients`, data);
};

export const updateIngredient = ({ data, id }: { data: TIngredientsBase; id: string }): Promise<TIngredientsBase> => {
  return axios.patch(`${API_URL}/api/ingredients/${id}`, data);
};

export const deleteIngredient = (id: string): Promise<void> => {
  return axios.delete(`${API_URL}/api/ingredients/${id}`);
};
