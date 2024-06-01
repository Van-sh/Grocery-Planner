import { TInputs } from "./createForm";

export const getIngredients = (): Promise<[]> => {
  return fetch("https://grocery-planner-be.onrender.com/api/ingredients")
    .then(response => response.json())
    .then(({ data }) => data);
};

export const createIngredient = (data: TInputs): Promise<TInputs> => {
  return fetch("https://grocery-planner-be.onrender.com/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(({ data }) => data);
};
