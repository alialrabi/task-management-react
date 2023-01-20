export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_CUSTOMER';

export interface User {
  id: string;
  email: string;
  username: string;
  activated: boolean;
  authorities?: string[];
}
