import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import { getLoginUserUsingGet } from '@/services/API-frontend/userController';
import { LinkOutlined } from '@ant-design/icons';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import { App, ConfigProvider } from 'antd';
import React from 'react';
import { lang } from 'moment';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

// 首次打开页面时执行,当页面首次加载或刷新时，获取全局要保存的数据，比如用户登录信息
export async function getInitialState(): Promise<InitialState> {
  // 初始化登录用户的状态，设为undefined 代表未登录
  const state: InitialState = {
    loginUser: undefined,
  };
  try {
    // 获取当前一登录的用户信息
    const msg = await getLoginUserUsingGet();

    // 如果从后端获取的数据不为空，就把获取到的用户数据赋值给state.loginUser
    if (msg.data) {
      state.loginUser = msg.data;
    }
  } catch (error) {
    // 如果获取用户信息失败，就把页面重定向为登录页面
    history.push(loginPath);
  }
  // 返回修改后的状态
  return state;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key='doc' />, <SelectLang key='SelectLang' />],
    avatarProps: {
      src: initialState?.loginUser?.userAvatar, // 修改loginUser
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.loginUser?.userName, // 修改loginUser
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.loginUser && location.pathname !== loginPath) {
        // 修改为loginUser
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
        <Link key='openapi' to='/umi/plugin/openapi' target='_blank'>
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  // 设置后台地址
  baseURL: 'http://localhost:7529',
  // 设置cookie
  withCredentials: true,
  // ...errorConfig,
};


