import api from "../api/client";

export const getAllListings = async () => {
  const response = await api.get("/api/listings");

  return response.data.data.map((item: any) => ({
    ...item,
    id: item._id, // normalize MongoDB id
  }));
};
export const getListingById = async (id: string) => {
  const response = await api.get(`/api/listings/${id}`);

  return {
    ...response.data.data,
    id: response.data.data._id, // normalize MongoDB id
  };
};
