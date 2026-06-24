const fs = require('fs');

let postStorePath = 'src/stores/post-store.ts';
let content = fs.readFileSync(postStorePath, 'utf8');

if (!content.includes('bulkUpdateStatus: (')) {
  let toAdd = `
      bulkUpdateStatus: (ids, status) => set((state) => ({
        posts: state.posts.map(p => ids.includes(p.id) ? { ...p, status } : p)
      })),
      bulkDeletePosts: (ids) => set((state) => ({
        posts: state.posts.filter(p => !ids.includes(p.id))
      })),
`;
  content = content.replace('duplicatePost: (id, newAuthorId) => {', toAdd + '      duplicatePost: (id, newAuthorId) => {');
  fs.writeFileSync(postStorePath, content);
  console.log('Fixed post-store.ts');
}
