const fs = require('fs');

const typesIndex = '/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/src/types/index.ts';
let typesContent = fs.readFileSync(typesIndex, 'utf8');

if (typesContent.includes('export interface PaginatedResult<T>')) {
    typesContent = typesContent.replace(
        'export interface PaginatedResult<T> { data: T[]; total: number; page: number; limit: number; totalPages: number; }',
        'export interface PaginatedResult<T> { data: T[]; total: number; page: number; pageSize: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean; }'
    );
    fs.writeFileSync(typesIndex, typesContent);
    console.log('Fixed PaginatedResult');
}
