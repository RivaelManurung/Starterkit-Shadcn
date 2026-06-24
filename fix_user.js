const fs = require('fs');

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
    let original = content;
    
    // Replace user.name with user.fullName, unless it's already user.fullName
    content = content.replace(/user\.name/g, 'user.fullName');
    
    // Replace user.avatarUrl with user.avatar
    content = content.replace(/user\.avatarUrl/g, 'user.avatar');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed user in', file);
    }
}
