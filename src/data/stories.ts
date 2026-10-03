export type StoryStatus = 'Mahasiswa aktif' | 'Alumni';
export type StoryTopic = 'study' | 'research' | 'career' | 'scholarship' | 'family' | 'community' | 'life';

export interface StorySection {
  heading: string;
  paragraphs: string[];
}

export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  personName: string;
  campusSlug: string;
  status: StoryStatus;
  program?: string;
  period?: string;
  currentActivity?: string;
  topics: StoryTopic[];
  publishedDate: string;
  imageUrl?: string;
  imageAlt?: string;
  quote?: string;
  featured?: boolean;
  sections: StorySection[];
}

export const storyTopicLabels: Record<StoryTopic, string> = {
  study: 'Studi',
  research: 'Riset',
  career: 'Karier',
  scholarship: 'Beasiswa',
  family: 'Keluarga',
  community: 'Komunitas',
  life: 'Kehidupan di Ishikawa'
};

// Tambahkan cerita yang sudah disetujui narasumber di sini.
// Biarkan kosong sampai cerita pertama siap dipublikasikan.
export const stories: Story[] = [];

export const featuredStories = stories.filter((story) => story.featured);

export const storiesByCampus = (campusSlug: string) =>
  stories.filter((story) => story.campusSlug === campusSlug);

export const storiesByTopic = (topic: StoryTopic) =>
  stories.filter((story) => story.topics.includes(topic));
