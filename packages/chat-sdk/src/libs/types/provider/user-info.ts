import type { UserInfo } from '../base';
interface UserInfoAction {
  setUserInfo: (info: UserInfo) => void;
}

interface UserInfoState {
  info: UserInfo | null;
}

export type UserInfoStore = UserInfoAction & UserInfoState;
