import { axiosInstance } from "./axios";

//TODO: create an interface City
interface City {
  [key: string]: string
}

//TODO: Best to async/await
export async function searchCity(search: string): Promise<City[]> {
  const response = await axiosInstance
    .get(
      `/communes?nom=${search}&fields=departement&boost=population&limit=5`,
      { baseURL: "https://geo.api.gouv.fr", withCredentials: false }
    );
  return response.data;
}
