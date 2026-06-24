const fs = require('fs');
const path = require('path');

function replaceInFile(path, regex, replacement) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  let newContent = content.replace(regex, replacement);
  if (content !== newContent) {
    fs.writeFileSync(path, newContent);
    console.log('Fixed', path);
  }
}

// 1. users/page.tsx
replaceInFile('src/app/dashboard/users/page.tsx', /case "SUPERADMIN":/g, 'case "superadmin":');
replaceInFile('src/app/dashboard/users/page.tsx', /case "ADMIN":/g, 'case "admin":');
replaceInFile('src/app/dashboard/users/page.tsx', /case "EDITOR":/g, 'case "editor":');
replaceInFile('src/app/dashboard/users/page.tsx', /case "AUTHOR":/g, 'case "author":');
replaceInFile('src/app/dashboard/users/page.tsx', /case "VIEWER":/g, 'case "viewer":');

// 2. top-posts-table.tsx
replaceInFile('src/components/dashboard/top-posts-table.tsx', /post\.status === 'PUBLISHED'/g, "post.status === 'published'");

// 3. user-menu.tsx
replaceInFile('src/components/layout/user-menu.tsx', /entityType: 'User'/g, "entity: 'user'");

// 4. users/new/page.tsx
replaceInFile('src/app/dashboard/users/new/page.tsx', /avatarUrl: ""/g, 'avatar: ""');
replaceInFile('src/app/dashboard/users/new/page.tsx', /"ADMIN" | "EDITOR" | "AUTHOR" | "VIEWER"/g, '"admin" | "editor" | "author" | "viewer"');
replaceInFile('src/app/dashboard/users/new/page.tsx', /"ADMIN"/g, '"admin"');
replaceInFile('src/app/dashboard/users/new/page.tsx', /"EDITOR"/g, '"editor"');
replaceInFile('src/app/dashboard/users/new/page.tsx', /"AUTHOR"/g, '"author"');
replaceInFile('src/app/dashboard/users/new/page.tsx', /"VIEWER"/g, '"viewer"');

// 5. users/[id]/edit/page.tsx
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /"ADMIN" | "EDITOR" | "AUTHOR" | "VIEWER"/g, '"admin" | "editor" | "author" | "viewer"');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /"ADMIN"/g, '"admin"');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /"EDITOR"/g, '"editor"');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /"AUTHOR"/g, '"author"');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /"VIEWER"/g, '"viewer"');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /avatarUrl: user\.avatarUrl/g, 'avatar: user.avatar');
replaceInFile('src/app/dashboard/users/[id]/edit/page.tsx', /avatarUrl: ""/g, 'avatar: ""');

// Fix validator.ts in .next by removing .next directory
fs.rmSync('.next', { recursive: true, force: true });
console.log('Removed .next cache to clear next types');
