import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    method: 'get',
    params,
    url: '/systemManage/getRoleList'
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    method: 'get',
    url: '/systemManage/getAllRoles'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    method: 'get',
    params,
    url: '/systemManage/getUserList'
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    method: 'get',
    url: '/systemManage/getMenuList/v2'
  });
}

export function addUserAPI(data: Api.SystemManage.AddUserParams) {
  return request({
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    url: '/systemManage/user'
  });
}

export function updateUserAPI(data: Api.SystemManage.UpdateUserParams) {
  return request({
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'put',
    url: '/systemManage/user'
  });
}

export function deleteUserAPI(id: number) {
  return request({
    method: 'delete',
    url: `/systemManage/user/${id}`
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    method: 'get',
    url: '/systemManage/getAllPages'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    method: 'get',
    url: '/systemManage/getMenuTree'
  });
}
