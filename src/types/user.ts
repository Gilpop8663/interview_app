export interface User {
  id: number;
  email: string;
  point: number;
  nickname: string;
  role: 'ADMIN' | 'USER';
  subscriptionType: 'FREE' | 'PREMIUM';
  lastActive: string;
  lastLoginDate: string;
  answerSubmittedCount: number;
}
