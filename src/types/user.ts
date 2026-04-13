export type UserRole = 'admin' | 'user';

export interface User {
  id?: number;
  fullName: string;
  studentCode: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: string;
}
