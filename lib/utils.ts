import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { AxiosRequestHeaders, AxiosResponse } from 'axios';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const axiosInstance = axios.create({});



// type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// type ApiConnectorParams = {
//   method: HttpMethod;
//   url: string;
//   bodyData?: any;
//   headers?: AxiosRequestHeaders;
//   params?: Record<string, any>;
// };


// export const apiConnector = async <T = any>({
//   method,
//   url,
//   bodyData,
//   headers,
//   params,
// }: ApiConnectorParams): Promise<AxiosResponse<T>> => {
//   return axiosInstance({
//     method,
//     url,
//     ...(bodyData && { data: bodyData }), // Include `data` only if `bodyData` exists
//     ...(headers && { headers }),       // Include `headers` only if `headers` exists
//     ...(params && { params }),         // Include `params` only if `params` exists
//   });
// };




type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ApiConnectorParams<TBody = unknown, TParams = Record<string, unknown>> = {
  method: HttpMethod;
  url: string;
  bodyData?: TBody;
  headers?: AxiosRequestHeaders;
  params?: TParams;
};

export const apiConnector = async <TResponse = unknown, TBody = unknown, TParams = Record<string, unknown>>({
  method,
  url,
  bodyData,
  headers,
  params,
}: ApiConnectorParams<TBody, TParams>): Promise<AxiosResponse<TResponse>> => {
  return axiosInstance({
    method,
    url,
    ...(bodyData && { data: bodyData }), // Include `data` only if `bodyData` exists
    ...(headers && { headers }),       // Include `headers` only if `headers` exists
    ...(params && { params }),         // Include `params` only if `params` exists
  });
};
