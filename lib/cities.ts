export type City = {
  id: string
  name: string
}

export const fetchLocations = async (ids: string[] = []): Promise<City[]> => {
  return ids.map((id) => ({ id, name: id }))
}
