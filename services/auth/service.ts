import * as actions from '../api/actions';
import {
  BodyDashboardEmployeeLoginType,
  TokenRefreshRequestType,
} from './schema';

// Auto-generated service for auth

export async function employeeLogin(body: BodyDashboardEmployeeLoginType) {
  const res = await actions.post<any>(`/auth/employee-login`, body);

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function employeeRefreshToken(body: TokenRefreshRequestType) {
  const res = await actions.post<any>(`/auth/employee-refresh-token`, body);

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
