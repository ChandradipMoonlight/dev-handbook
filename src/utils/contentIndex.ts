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
    {
      path: '/src/content/dsa/twoPointer/introduction.md',
      metadata: {
        title: 'Two Pointer Technique - Introduction',
        description: 'Learn the two pointer technique and when to use it',
        category: 'dsa',
        topic: 'two-pointer-introduction',
        folder: 'Two Pointer Technique',
        order: 3,
      },
      content: '',
    },
    {
      path: '/src/content/dsa/twoPointer/two-sum.md',
      metadata: {
        title: 'Two Sum',
        description: 'Find two numbers that add up to target using two pointers',
        category: 'dsa',
        topic: 'two-sum',
        folder: 'Two Pointer Technique',
        order: 4,
      },
      content: '',
    },
    {
      path: '/src/content/dsa/twoPointer/three-sum.md',
      metadata: {
        title: 'Three Sum',
        description: 'Find all triplets that sum to zero using two pointers',
        category: 'dsa',
        topic: 'three-sum',
        folder: 'Two Pointer Technique',
        order: 5,
      },
      content: '',
    },
    {
      path: '/src/content/dsa/twoPointer/container-with-most-water.md',
      metadata: {
        title: 'Container With Most Water',
        description: 'Find maximum water container area using two pointers',
        category: 'dsa',
        topic: 'container-with-most-water',
        folder: 'Two Pointer Technique',
        order: 6,
      },
      content: '',
    },
    {
      path: '/src/content/dsa/twoPointer/remove-duplicates.md',
      metadata: {
        title: 'Remove Duplicates from Sorted Array',
        description: 'Remove duplicates in-place using two pointers',
        category: 'dsa',
        topic: 'remove-duplicates',
        folder: 'Two Pointer Technique',
        order: 7,
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
    {
      path: '/src/content/system-design/HLD/messaging-queue/phase-1-messaging-foundations.md',
      metadata: {
        title: 'Phase 1: Messaging Foundations',
        description: 'Distributed systems basics and messaging core concepts',
        category: 'system-design',
        topic: 'phase-1-messaging-foundations',
        folder: 'Messaging Queue',
        order: 2,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/messaging-queue/phase-2-rabbitmq-mastery.md',
      metadata: {
        title: 'Phase 2: RabbitMQ Mastery',
        description: 'Queue-based messaging expert - RabbitMQ architecture, exchanges, reliability, and HA',
        category: 'system-design',
        topic: 'phase-2-rabbitmq-mastery',
        folder: 'Messaging Queue',
        order: 3,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/messaging-queue/phase-3-kafka-mastery.md',
      metadata: {
        title: 'Phase 3: Kafka Mastery',
        description: 'Streaming expert - Kafka core, internals, performance, Connect & Streams',
        category: 'system-design',
        topic: 'phase-3-kafka-mastery',
        folder: 'Messaging Queue',
        order: 4,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/messaging-queue/phase-4-industrial-messaging.md',
      metadata: {
        title: 'Phase 4: Industrial Messaging',
        description: 'MQTT, OPC-UA, and Edge Gateway architecture for industrial systems',
        category: 'system-design',
        topic: 'phase-4-industrial-messaging',
        folder: 'Messaging Queue',
        order: 5,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/messaging-queue/phase-5-platform-engineering.md',
      metadata: {
        title: 'Phase 5: Platform Engineering',
        description: 'Lead level - Decision framework, event backbone, observability, HA/DR, and security',
        category: 'system-design',
        topic: 'phase-5-platform-engineering',
        folder: 'Messaging Queue',
        order: 6,
      },
      content: '',
    },
    // Enterprise Security Content
    {
      path: '/src/content/system-design/HLD/security/security-roadmap.md',
      metadata: {
        title: 'Security Learning Roadmap',
        description: 'Complete roadmap from beginner to senior lead architect level in enterprise security',
        category: 'system-design',
        topic: 'security-roadmap',
        folder: 'Enterprise Security',
        order: 7,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/security-architecture-overview.md',
      metadata: {
        title: 'Security Architecture Overview',
        description: 'Understanding the big picture of enterprise security architecture',
        category: 'system-design',
        topic: 'security-architecture-overview',
        folder: 'Enterprise Security',
        order: 8,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/01-network-security.md',
      metadata: {
        title: 'Network Security Fundamentals',
        description: 'Understanding how data flows securely across the internet - TLS, HTTPS, reverse proxy',
        category: 'system-design',
        topic: '01-network-security',
        folder: 'Enterprise Security',
        order: 9,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/02-cryptography.md',
      metadata: {
        title: 'Cryptography Fundamentals',
        description: 'Encryption, hashing, digital signatures - understanding how TLS and JWT work internally',
        category: 'system-design',
        topic: '02-cryptography',
        folder: 'Enterprise Security',
        order: 10,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/03-authentication.md',
      metadata: {
        title: 'Authentication Fundamentals',
        description: 'Verifying who you are - identity verification in enterprise systems',
        category: 'system-design',
        topic: '03-authentication',
        folder: 'Enterprise Security',
        order: 11,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/04-authorization.md',
      metadata: {
        title: 'Authorization Models',
        description: 'Controlling what users can do - RBAC, ABAC, access control in enterprise systems',
        category: 'system-design',
        topic: '04-authorization',
        folder: 'Enterprise Security',
        order: 12,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/05-api-security.md',
      metadata: {
        title: 'API Security',
        description: 'Securing REST APIs from common attacks - OWASP Top 10, input validation, rate limiting',
        category: 'system-design',
        topic: '05-api-security',
        folder: 'Enterprise Security',
        order: 13,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/06-spring-security.md',
      metadata: {
        title: 'Spring Security Deep Dive',
        description: 'Mastering Spring Security for enterprise application security',
        category: 'system-design',
        topic: '06-spring-security',
        folder: 'Enterprise Security',
        order: 14,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/07-oauth2.md',
      metadata: {
        title: 'OAuth2 Security',
        description: 'Complete guide to OAuth 2.0 authorization framework from basic to advanced',
        category: 'system-design',
        topic: '07-oauth2',
        folder: 'Enterprise Security',
        order: 15,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/08-jwt-security.md',
      metadata: {
        title: 'JWT Token Security',
        description: 'Understanding JSON Web Tokens for stateless authentication',
        category: 'system-design',
        topic: '08-jwt-security',
        folder: 'Enterprise Security',
        order: 16,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/09-microservices-security.md',
      metadata: {
        title: 'Microservices Security',
        description: 'Securing distributed microservices architectures - mTLS, service-to-service auth',
        category: 'system-design',
        topic: '09-microservices-security',
        folder: 'Enterprise Security',
        order: 17,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/10-cloud-security.md',
      metadata: {
        title: 'Cloud Security',
        description: 'Securing applications deployed on cloud platforms - AWS, GCP, Azure',
        category: 'system-design',
        topic: '10-cloud-security',
        folder: 'Enterprise Security',
        order: 18,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/11-container-security.md',
      metadata: {
        title: 'Container Security',
        description: 'Securing containerized applications and Kubernetes',
        category: 'system-design',
        topic: '11-container-security',
        folder: 'Enterprise Security',
        order: 19,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/topics/12-enterprise-security-architecture.md',
      metadata: {
        title: 'Enterprise Security Architecture',
        description: 'Designing production-grade security architectures - Zero Trust, IAM, observability',
        category: 'system-design',
        topic: '12-enterprise-security-architecture',
        folder: 'Enterprise Security',
        order: 20,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/projects/project-01-secure-api.md',
      metadata: {
        title: 'Project 1: Secure HTTPS API Service',
        description: 'Week 1 - Building a secure API with HTTPS and TLS encryption',
        category: 'system-design',
        topic: 'project-01-secure-api',
        folder: 'Enterprise Security',
        order: 21,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/projects/project-02-auth-service.md',
      metadata: {
        title: 'Project 2: Authentication Service',
        description: 'Week 2 - Building secure authentication with JWT tokens',
        category: 'system-design',
        topic: 'project-02-auth-service',
        folder: 'Enterprise Security',
        order: 22,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/projects/project-03-secure-gateway.md',
      metadata: {
        title: 'Project 3: Secure API Gateway',
        description: 'Week 4 - Centralizing security with API Gateway - JWT validation, rate limiting',
        category: 'system-design',
        topic: 'project-03-secure-gateway',
        folder: 'Enterprise Security',
        order: 23,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/projects/project-04-microservices-security.md',
      metadata: {
        title: 'Project 4: Microservices Secure Platform',
        description: 'Week 6 - Building secure microservices with JWT and mTLS',
        category: 'system-design',
        topic: 'project-04-microservices-security',
        folder: 'Enterprise Security',
        order: 24,
      },
      content: '',
    },
    {
      path: '/src/content/system-design/HLD/security/projects/project-05-enterprise-platform.md',
      metadata: {
        title: 'Project 5: Enterprise Secure Platform',
        description: 'Week 8 - Production-grade secure architecture with OAuth2, JWT, RBAC, monitoring',
        category: 'system-design',
        topic: 'project-05-enterprise-platform',
        folder: 'Enterprise Security',
        order: 25,
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
