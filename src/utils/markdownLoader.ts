// Use Vite's import.meta.glob to load markdown files
const markdownModules = import.meta.glob('/src/content/**/*.md', { 
  query: '?raw',
  import: 'default',
  eager: false 
});

export async function loadMarkdown(path: string): Promise<string> {
  try {
    // Normalize path to match glob pattern
    const normalizedPath = path.startsWith('/src/') ? path : `/src${path}`;
    
    // Try to get the module
    const moduleLoader = markdownModules[normalizedPath];
    
    if (!moduleLoader) {
      throw new Error(`Markdown file not found: ${path}`);
    }
    
    // Load the module (returns the raw markdown content)
    const content = await moduleLoader();
    return content as string;
  } catch (error) {
    console.error(`Error loading markdown from ${path}:`, error);
    throw error;
  }
}

export function getMarkdownPath(category: string, ...segments: string[]): string {
  return `/src/content/${category}/${segments.join('/')}.md`;
}
