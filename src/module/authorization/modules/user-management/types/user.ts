import BaseType from "@/module/authorization/types";

export interface IListUser {
  user_id: string;
  user_name: string;
  full_name: string;
  description: string;
  roles: any[];
}

export interface IUser extends BaseType {
  user_id: string;
  user_name: string;
  password: string;
  type?: string;
  description?: string;
  online_flag: number;
}

export interface IUserDetail extends BaseType {
  profile_id: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  full_name: string;
  avatar: string;
  gender: boolean;
  date_of_birth?: Date;
  email: string;
}

export interface IUserDAO {
  user_id: string;
  profile_id?: string;
  user_name: string;
  password?: string;
  type?: string;
  description?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  full_name: string;
  avatar?: string;
  gender: number;
  date_of_birth: Date;
  email: string;
  phone_number?: string;
  is_guest?: number;
  created_by_user_id?: string;
}

export interface IUserFull extends IUser, IUserDetail {}
