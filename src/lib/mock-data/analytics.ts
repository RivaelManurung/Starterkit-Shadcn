export const generateAnalyticsData = (days: number = 90) => {
  const data = []
  let pageviews = 1000
  let uniqueVisitors = 800
  let sessions = 850
  
  const now = new Date("2026-06-25T12:00:00Z")
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    
    // Add some deterministic noise and a slight upward trend
    const pseudoRand = ((i * 13.51) % 100) / 100
    const pseudoRand2 = ((i * 7.33) % 100) / 100
    const pseudoRand3 = ((i * 19.87) % 100) / 100
    
    const noise = pseudoRand * 200 - 100
    pageviews = Math.floor(Math.max(500, pageviews + noise + 5))
    uniqueVisitors = Math.floor(pageviews * (0.6 + pseudoRand2 * 0.2))
    sessions = Math.floor(uniqueVisitors * (1.1 + pseudoRand3 * 0.2))
    
    // Weekly pattern (less traffic on weekends)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const multiplier = isWeekend ? 0.7 : 1.1
    
    data.push({
      date: date.toISOString().split('T')[0],
      pageviews: Math.floor(pageviews * multiplier),
      uniqueVisitors: Math.floor(uniqueVisitors * multiplier),
      sessions: Math.floor(sessions * multiplier),
      bounceRate: 40 + (((i * 5.11) % 100) / 100) * 20, // 40-60%
      avgSessionDuration: 120 + (((i * 8.43) % 100) / 100) * 180, // 2-5 minutes in seconds
    })
  }
  
  return data
}

export const mockAnalytics = {
  overview: {
    totalPageviews: 125430,
    pageviewsChange: 12.5,
    uniqueVisitors: 84210,
    uniqueVisitorsChange: 8.2,
    bounceRate: 45.2,
    bounceRateChange: -2.1,
    avgSessionDuration: 245, // seconds
    avgSessionDurationChange: 5.4,
  },
  traffic: generateAnalyticsData(90),
  topContent: Array.from({ length: 10 }).map((_, i) => ({
    id: `post_${i}`,
    title: `Artikel Populer ${i + 1}`,
    views: 10000 - i * 500 + Math.floor((((i * 3.1) % 100) / 100) * 200),
    uniqueVisitors: 8000 - i * 400 + Math.floor((((i * 4.2) % 100) / 100) * 150),
    avgTime: 180 + (((i * 5.3) % 100) / 100) * 100,
    bounceRate: 35 + (((i * 6.4) % 100) / 100) * 15,
    conversions: 2 + (((i * 7.5) % 100) / 100) * 5
  })),
  sources: {
    pie: [
      { name: "Organic Search", value: 45 },
      { name: "Direct", value: 25 },
      { name: "Referral", value: 15 },
      { name: "Social", value: 10 },
      { name: "Email", value: 5 }
    ],
    referrers: [
      { domain: "google.com", views: 45000 },
      { domain: "twitter.com", views: 8000 },
      { domain: "facebook.com", views: 5000 },
      { domain: "github.com", views: 3000 },
      { domain: "linkedin.com", views: 2500 }
    ]
  },
  audience: {
    countries: [
      { country: "Indonesia", value: 75 },
      { country: "Malaysia", value: 10 },
      { country: "Singapore", value: 5 },
      { country: "United States", value: 3 },
      { country: "Others", value: 7 }
    ],
    devices: [
      { name: "Mobile", value: 55 },
      { name: "Desktop", value: 40 },
      { name: "Tablet", value: 5 }
    ],
    browsers: [
      { name: "Chrome", value: 65 },
      { name: "Safari", value: 20 },
      { name: "Firefox", value: 8 },
      { name: "Edge", value: 5 },
      { name: "Others", value: 2 }
    ]
  }
}
