export type SendbirdCreateUserRequiredArgs = {
  user_id: string;
  nickname: string;
  profile_url: string;
};

export type SendbirdUpdateUserRequiredArgs = {
  user_id: string;
  nickname?: string;
  profile_url?: string;
};
