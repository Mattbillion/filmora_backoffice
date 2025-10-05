import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_EMPLOYEES } from './rvk';
import {
  BaseResponseEmployeeResponseType,
  EmployeeCreateType,
  EmployeeUpdateType,
} from './schema';

// Auto-generated service for employees

export async function createEmployee(body: EmployeeCreateType) {
  const res = await actions.post<BaseResponseEmployeeResponseType>(
    `/employees`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function updateEmployee(
  employeeId: string,
  body: EmployeeUpdateType,
) {
  const res = await actions.put<BaseResponseEmployeeResponseType>(
    `/employees/${employeeId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([
    RVK_EMPLOYEES,
    `${RVK_EMPLOYEES}_employee_id_${employeeId}`,
  ]);

  return response;
}
