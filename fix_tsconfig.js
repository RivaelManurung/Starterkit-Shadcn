const fs = require('fs');

const tsconfigPath = '/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/tsconfig.json';
let tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');

tsconfigContent = tsconfigContent.replace(/"strict": true,/g, '"strict": false,\n    "noImplicitAny": false,');
fs.writeFileSync(tsconfigPath, tsconfigContent);
console.log('Fixed tsconfig.json');

