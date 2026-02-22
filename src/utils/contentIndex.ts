import type { ContentItem, ContentIndex } from '@/types/content';

// Content index - in a real app, this could be generated or loaded from a JSON file
export const contentIndex: ContentIndex = {
  languages: {
    java: [
      {
        path: '/src/content/languages/java/introduction.md',
        metadata: {
          title: 'Introduction to Java',
          description: 'Learn the basics of Java programming',
          category: 'languages',
          language: 'java',
          topic: 'introduction',
          order: 1,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/basics.md',
        metadata: {
          title: 'Java Basics',
          description: 'Variables, data types, and basic syntax',
          category: 'languages',
          language: 'java',
          topic: 'basics',
          order: 2,
        },
        content: '',
      },
    ],
    python: [
      {
        path: '/src/content/languages/python/introduction.md',
        metadata: {
          title: 'Introduction to Python',
          description: 'Get started with Python programming',
          category: 'languages',
          language: 'python',
          topic: 'introduction',
          order: 1,
        },
        content: '',
      },
    ],
  },
  dsa: [
    {
      path: '/src/content/dsa/arrays.md',
      metadata: {
        title: 'Arrays',
        description: 'Understanding arrays and their operations',
        category: 'dsa',
        topic: 'arrays',
        order: 1,
      },
      content: '',
    },
    {
      path: '/src/content/dsa/linked-lists.md',
      metadata: {
        title: 'Linked Lists',
        description: 'Introduction to linked lists and their implementation',
        category: 'dsa',
        topic: 'linked-lists',
        order: 2,
      },
      content: '',
    },
  ],
  systemDesign: [
    {
      path: '/src/content/system-design/introduction.md',
      metadata: {
        title: 'Introduction to System Design',
        description: 'Fundamentals of designing scalable systems',
        category: 'system-design',
        topic: 'introduction',
        order: 1,
      },
      content: '',
    },
  ],
  interview: [
    {
      path: '/src/content/interview/common-questions.md',
      metadata: {
        title: 'Common Interview Questions',
        description: 'Frequently asked questions in technical interviews',
        category: 'interview',
        topic: 'common-questions',
        order: 1,
      },
      content: '',
    },
  ],
};

export function getContentByPath(path: string): ContentItem | undefined {
  for (const langContents of Object.values(contentIndex.languages)) {
    const item = langContents.find((item) => item.path === path);
    if (item) return item;
  }
  
  const allItems = [
    ...contentIndex.dsa,
    ...contentIndex.systemDesign,
    ...contentIndex.interview,
  ];
  
  return allItems.find((item) => item.path === path);
}

export function getContentByCategory(
  category: 'languages' | 'dsa' | 'system-design' | 'interview',
  language?: string
): ContentItem[] {
  if (category === 'languages' && language) {
    return contentIndex.languages[language] || [];
  }
  
  switch (category) {
    case 'dsa':
      return contentIndex.dsa;
    case 'system-design':
      return contentIndex.systemDesign;
    case 'interview':
      return contentIndex.interview;
    default:
      return [];
  }
}
