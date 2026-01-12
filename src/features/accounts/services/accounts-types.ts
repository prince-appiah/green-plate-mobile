export interface GetProfileResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  impact: {
    totalMealsSaved: number;
    totalCo2PreventedKg: number;
  };
  points: {
    totalPoints: number;
    reservationCount: number;
    currentBadge: string;
  };
}
