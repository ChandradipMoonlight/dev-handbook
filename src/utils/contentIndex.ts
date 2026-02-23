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
          folder: '',
          order: 1,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/basics/basics.md',
        metadata: {
          title: 'Java Basics',
          description: 'Variables, data types, and basic syntax',
          category: 'languages',
          language: 'java',
          topic: 'basics',
          folder: 'Basics',
          order: 2,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/class-and-object.md',
        metadata: {
          title: 'Class and Object',
          description: 'Understanding classes and objects in Java',
          category: 'languages',
          language: 'java',
          topic: 'class-and-object',
          folder: 'OOPs',
          order: 3,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/constructor.md',
        metadata: {
          title: 'Constructor',
          description: 'Learn about constructors in Java',
          category: 'languages',
          language: 'java',
          topic: 'constructor',
          folder: 'OOPs',
          order: 4,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/this-keyword.md',
        metadata: {
          title: 'This Keyword',
          description: 'Understanding the this keyword in Java',
          category: 'languages',
          language: 'java',
          topic: 'this-keyword',
          folder: 'OOPs',
          order: 5,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/static-keyword.md',
        metadata: {
          title: 'Static Keyword',
          description: 'Learn about static variables and methods',
          category: 'languages',
          language: 'java',
          topic: 'static-keyword',
          folder: 'OOPs',
          order: 6,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/final-keyword.md',
        metadata: {
          title: 'Final Keyword',
          description: 'Understanding final keyword in Java',
          category: 'languages',
          language: 'java',
          topic: 'final-keyword',
          folder: 'OOPs',
          order: 7,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/encapsulation.md',
        metadata: {
          title: 'Encapsulation',
          description: 'Learn about encapsulation and data hiding',
          category: 'languages',
          language: 'java',
          topic: 'encapsulation',
          folder: 'OOPs',
          order: 8,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/abstraction.md',
        metadata: {
          title: 'Abstraction',
          description: 'Understanding abstraction in Java',
          category: 'languages',
          language: 'java',
          topic: 'abstraction',
          folder: 'OOPs',
          order: 9,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/inheritance.md',
        metadata: {
          title: 'Inheritance',
          description: 'Learn about inheritance in Java',
          category: 'languages',
          language: 'java',
          topic: 'inheritance',
          folder: 'OOPs',
          order: 10,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/polymorphism.md',
        metadata: {
          title: 'Polymorphism',
          description: 'Understanding polymorphism in Java',
          category: 'languages',
          language: 'java',
          topic: 'polymorphism',
          folder: 'OOPs',
          order: 11,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/interface.md',
        metadata: {
          title: 'Interface',
          description: 'Learn about interfaces in Java',
          category: 'languages',
          language: 'java',
          topic: 'interface',
          folder: 'OOPs',
          order: 12,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/method-overriding.md',
        metadata: {
          title: 'Method Overriding',
          description: 'Understanding method overriding in Java',
          category: 'languages',
          language: 'java',
          topic: 'method-overriding',
          folder: 'OOPs',
          order: 13,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/method-overloading.md',
        metadata: {
          title: 'Method Overloading',
          description: 'Learn about method overloading in Java',
          category: 'languages',
          language: 'java',
          topic: 'method-overloading',
          folder: 'OOPs',
          order: 14,
        },
        content: '',
      },
      {
        path: '/src/content/languages/java/OOPs/super-keyword.md',
        metadata: {
          title: 'Super Keyword',
          description: 'Understanding the super keyword in Java',
          category: 'languages',
          language: 'java',
          topic: 'super-keyword',
          folder: 'OOPs',
          order: 15,
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
