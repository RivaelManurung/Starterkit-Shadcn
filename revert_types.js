const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/src');
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('Post["status"]')) {
        content = content.replace(/Post\["status"\]/g, 'PostStatus');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Reverted types in', file);
    }
}

const typesIndex = '/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/src/types/index.ts';
let typesContent = fs.readFileSync(typesIndex, 'utf8');
if (!typesContent.includes('export type PostStatus')) {
    typesContent += '\nexport type PostStatus = Post["status"];\n';
    typesContent += 'export interface PaginatedResult<T> { data: T[]; total: number; page: number; limit: number; totalPages: number; }\n';
    fs.writeFileSync(typesIndex, typesContent);
    console.log('Added PostStatus and PaginatedResult to types/index.ts');
}
