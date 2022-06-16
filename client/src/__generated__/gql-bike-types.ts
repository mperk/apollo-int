export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface Bike {
  __typename?: 'Bike';
  bike_id?: Maybe<Scalars['String']>;
  is_disabled?: Maybe<Scalars['Boolean']>;
  is_reserved?: Maybe<Scalars['Boolean']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  vehicle_type?: Maybe<Scalars['String']>;
}

export interface LoginResponse {
  __typename?: 'LoginResponse';
  token: Scalars['String'];
  user: User;
}

export interface Mutation {
  __typename?: 'Mutation';
  createUser?: Maybe<User>;
  login: LoginResponse;
}


export interface MutationCreateUserArgs {
  password: Scalars['String'];
  username: Scalars['String'];
}


export interface MutationLoginArgs {
  password: Scalars['String'];
  username: Scalars['String'];
}

export interface Query {
  __typename?: 'Query';
  bikes?: Maybe<ResponseBikes>;
}


export interface QueryBikesArgs {
  bikeId?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  vehicleType?: InputMaybe<Scalars['String']>;
}

export interface ResponseBikes {
  __typename?: 'ResponseBikes';
  data?: Maybe<Array<Maybe<Bike>>>;
  last_updated?: Maybe<Scalars['String']>;
  nextPage?: Maybe<Scalars['Boolean']>;
  total_count?: Maybe<Scalars['Int']>;
  ttl?: Maybe<Scalars['Int']>;
}

export interface User {
  __typename?: 'User';
  company?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
}
