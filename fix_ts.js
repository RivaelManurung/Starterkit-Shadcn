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

// 1. Fix user-menu.tsx import
let userMenuPath = 'src/components/layout/user-menu.tsx';
replaceInFile(userMenuPath, /export function UserMenu\(\) \{\n  import \{ useAuthStore \} from "@\/stores\/auth-store"/, 'import { useAuthStore } from "@/stores/auth-store"\n\nexport function UserMenu() {');

// 2. nav-user.tsx fullName -> name
let navUserPath = 'src/components/nav-user.tsx';
replaceInFile(navUserPath, /user\.fullName/g, 'user.name');

// 3. post-data-table.tsx getPosts -> posts
let postDataTablePath = 'src/components/posts/post-data-table.tsx';
replaceInFile(postDataTablePath, /const posts = usePostStore\(state => state\.getPosts\)/, 'const posts = usePostStore(state => state.posts)');
// Also getStats -> just posts array manipulation? wait, top-posts-table uses getStats

// 4. top-posts-table.tsx getStats
let topPostsTablePath = 'src/components/dashboard/top-posts-table.tsx';
replaceInFile(topPostsTablePath, /const \{ recentPosts \} = getStats\(\)/, 'const recentPosts = usePostStore(state => state.posts).slice(0, 5)');
replaceInFile(topPostsTablePath, /const getStats = usePostStore\(state => state\.getStats\)/, '');

// 5. notification-bell.tsx clearNotifications -> markAllAsRead
let notifBellPath = 'src/components/notifications/notification-bell.tsx';
replaceInFile(notifBellPath, /state\.clearNotifications/g, 'state.markAllAsRead');

// 6. users/page.tsx Role badge types
let usersPagePath = 'src/app/dashboard/users/page.tsx';
replaceInFile(usersPagePath, /case "ADMIN":/g, 'case "SUPERADMIN":\n      case "ADMIN":');

