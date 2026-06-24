import { DailyAnalytics } from '@/types';

export const generateAnalytics = (days: number): DailyAnalytics[] => {
  const data: DailyAnalytics[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulasikan traffic (lebih tinggi di hari kerja)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseViews = isWeekend ? Math.floor(Math.random() * 800) + 200 : Math.floor(Math.random() * 2000) + 1000;
    
    // visitors adalah 60-80% dari views
    const visitors = Math.floor(baseViews * (0.6 + Math.random() * 0.2));
    
    const newPosts = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;

    data.push({
      date: date.toISOString(),
      views: baseViews,
      visitors,
      newPosts,
      engagementRate: Number((Math.random() * 5 + 1).toFixed(2)),
      sources: {
        direct: Math.floor(baseViews * 0.4),
        social: Math.floor(baseViews * 0.3),
        search: Math.floor(baseViews * 0.2),
        referral: Math.floor(baseViews * 0.1),
      }
    });
  }

  return data;
};

export const analyticsData: DailyAnalytics[] = generateAnalytics(90);
