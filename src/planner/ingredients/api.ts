export const getIngredients = (): Promise<[]> => {
  return fetch("https://grocery-planner-be.onrender.com/api/ingredients")
    .then(response => response.json())
    .then(({ data }) => data);
};
