export const readCookie = (name: string): string | undefined => {
  const nameEQ = name + "=";
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(nameEQ))
    ?.split("=")[1];
};
