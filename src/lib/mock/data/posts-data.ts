import { Post, PostStatus } from '@/types';
import { usersData } from './users-data';
import { categoriesData } from './categories-data';
import { tagsData } from './tags-data';
import { generateId } from '../utils';

const LOREM_CONTENT = `
## Pendahuluan

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Sub Judul Pertama
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

* Poin pertama
* Poin kedua
* Poin ketiga

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

### Kesimpulan
Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
`;

const generateRandomDate = (start: Date, end: Date, seed: number) => {
  return new Date(start.getTime() + (seed % (end.getTime() - start.getTime()))).toISOString();
};

const getAuthors = () => usersData.filter(u => u.role !== 'VIEWER');
const authors = getAuthors();

const generatePosts = (): Post[] => {
  const posts: Post[] = [];
  const statusDistribution: PostStatus[] = [
    ...Array(14).fill('PUBLISHED'),
    ...Array(8).fill('DRAFT'),
    ...Array(5).fill('ARCHIVED'),
    ...Array(3).fill('SCHEDULED'),
  ];

  for (let i = 0; i < 30; i++) {
    const status = statusDistribution[i];
    const category = categoriesData[i % categoriesData.length];
    
    // Pick 2-4 deterministic tags
    const numTags = (i % 3) + 2;
    const selectedTags = tagsData.slice(i % tagsData.length, (i % tagsData.length) + numTags);
    if (selectedTags.length < numTags) {
      selectedTags.push(...tagsData.slice(0, numTags - selectedTags.length));
    }
    
    const author = authors[i % authors.length];
    const title = `Artikel Menarik Tentang ${category.name} Bagian ${i + 1}`;
    const slug = `artikel-menarik-tentang-${category.slug}-bagian-${i + 1}`;
    
    const createdAt = generateRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 1), i * 1234567);
    let publishedAt: string | undefined;
    let scheduledAt: string | undefined;

    if (status === 'PUBLISHED') {
      publishedAt = generateRandomDate(new Date(createdAt), new Date(), i * 7654321);
    } else if (status === 'SCHEDULED') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      scheduledAt = generateRandomDate(tomorrow, nextWeek, i * 9876543);
    }

    posts.push({
      id: `p${i + 1}`,
      title,
      slug,
      content: LOREM_CONTENT,
      excerpt: `Ini adalah ringkasan singkat untuk artikel tentang ${category.name} yang sangat informatif dan berguna bagi para pembaca.`,
      featuredImage: `https://picsum.photos/seed/${slug}/800/450`,
      status,
      categoryId: category.id,
      category,
      tagIds: selectedTags.map(t => t.id),
      tags: selectedTags,
      authorId: author.id,
      author,
      viewCount: ((i * 743) % 14900) + 100, // deterministic
      readingTimeMin: ((i * 7) % 13) + 3, // deterministic
      seoTitle: `${title} | StarterKit`,
      seoDescription: `Pelajari lebih lanjut tentang ${category.name} di artikel ini.`,
      createdAt,
      updatedAt: createdAt,
      publishedAt,
      scheduledAt,
    });
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const postsData: Post[] = generatePosts();
