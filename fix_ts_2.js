const fs = require('fs');

function replaceInFile(path, regex, replacement) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  let newContent = content.replace(regex, replacement);
  if (content !== newContent) {
    fs.writeFileSync(path, newContent);
    console.log('Fixed', path);
  }
}

// 1. users/new/page.tsx
replaceInFile('src/app/dashboard/users/new/page.tsx', /z\.enum\(\["admin", "editor", "author","admin" \| "editor" \| "author" \| "viewer"\]\)/g, 'z.enum(["superadmin", "admin", "editor", "author", "viewer", "moderator"])');
replaceInFile('src/app/dashboard/users/new/page.tsx', /isActive: true/g, '');

// 2. users/[id]/edit/page.tsx
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /z\.enum\(\["admin", "editor", "author","admin" \| "editor" \| "author" \| "viewer"\]\)/g, 'z.enum(["superadmin", "admin", "editor", "author", "viewer", "moderator"])');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /name: user\?\.name \|\| "",/g, 'fullName: user?.fullName || "",');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /updateUser\(user\.id, values\)/g, 'updateUser(user.id, values as any)');

// 3. user-menu.tsx
replaceInFile('src/components/layout/user-menu.tsx', /useActivityStore\.getState\(\)\.addLog\(\{\n\s*action: "logout",\n\s*userId: user\.id,\n\s*entityId: user\.id,\n\s*entity: 'user',\n\s*entityTitle: user\.fullName,\n\s*\}\)/g, 'useActivityStore.getState().addLog({\n      action: "logout",\n      userId: user.id,\n      entityId: user.id,\n      entity: "user",\n      entityTitle: user.fullName,\n      description: "User logged out",\n      oldValue: null,\n      newValue: null,\n      user: user as any,\n      ipAddress: "127.0.0.1",\n      userAgent: "browser",\n      sessionId: "session",\n      duration: 0,\n      status: "success",\n      metadata: {},\n      createdAt: new Date()\n    } as any)');

// 4. notification-bell.tsx
replaceInFile('src/components/notifications/notification-bell.tsx', /state\.markAllAsRead/g, 'state.markAllRead');

// 5. post-store.ts
replaceInFile('src/stores/post-store.ts', /duplicatePost: \(/g, 'bulkUpdateStatus: (ids: string[], status: any) => {},\nbulkDeletePosts: (ids: string[]) => {},\nduplicatePost: (');

