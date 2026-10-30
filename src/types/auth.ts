/** The signed-in user, as the API's GET /api/me returns it. */
export type User = {
  id: number;
  name: string;
  email: string;
};
