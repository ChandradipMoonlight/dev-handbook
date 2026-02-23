export interface ContentMetadata {
  title: string;
  description?: string;
  category: 'languages' | 'dsa' | 'system-design' | 'interview';
  language?: string;
  topic?: string;
  folder?: string;
  order?: number;
}

export interface ContentItem {
  path: string;
  metadata: ContentMetadata;
  content: string;
}

export interface ContentIndex {
  languages: {
    [lang: string]: ContentItem[];
  };
  dsa: ContentItem[];
  systemDesign: ContentItem[];
  interview: ContentItem[];
}
