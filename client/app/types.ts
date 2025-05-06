export type User = {
  fullName: string | null;
  email: string | null;
  image: string | null;
};

export type SignUpUser = {
  email: string;
  passwordHash: string;
};
