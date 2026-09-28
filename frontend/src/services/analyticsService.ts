import { api } from './api';
import { AnalyticsSummary } from '../types';

export const analyticsService = {
  async getSummary(projectId?: number): Promise<AnalyticsSummary> {
    return api.getAnalytics(projectId);
  },
};
