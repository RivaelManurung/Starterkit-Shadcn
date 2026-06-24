import { ActivityLog, ActivityAction } from '@/types';
import { usersData } from './users-data';
import { generateId } from '../utils';

const generateActivities = (): ActivityLog[] => {
  const activities: ActivityLog[] = [];
  const actions: ActivityAction[] = [
    'POST_CREATED', 'POST_UPDATED', 'POST_PUBLISHED', 'POST_DELETED',
    'CATEGORY_CREATED', 'TAG_CREATED', 'USER_ROLE_CHANGED', 'LOGIN'
  ];

  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const action = actions[i % actions.length];
    const user = usersData[i % usersData.length];
    const date = new Date(now.getTime() - i * 1000 * 60 * 60 * 2); // mundur 2 jam setiap log

    let entityType: ActivityLog['entityType'] = 'Post';
    let entityTitle = 'Artikel Baru';

    if (action.includes('CATEGORY')) {
      entityType = 'Category';
      entityTitle = 'Kategori Web';
    } else if (action.includes('TAG')) {
      entityType = 'Tag';
      entityTitle = 'Tag Baru';
    } else if (action.includes('USER') || action === 'LOGIN') {
      entityType = 'User';
      entityTitle = user.name;
    }

    activities.push({
      id: generateId(),
      action,
      userId: user.id,
      user,
      entityId: generateId(),
      entityType,
      entityTitle: `${entityTitle} ${i + 1}`,
      meta: i % 3 === 0 ? { before: 'Draft', after: 'Published' } : undefined,
      timestamp: date.toISOString(),
    });
  }

  return activities;
};

export const activityData: ActivityLog[] = generateActivities();
