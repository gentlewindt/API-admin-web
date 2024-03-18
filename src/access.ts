/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: InitialState | undefined) {
  const { loginUser } = initialState ?? {};
  return {
    // 用户存在即为登录
    canUser: loginUser,

    // 用户存在且为管理员
    canAdmin: loginUser?.userRole === 'admin',
  };
}
