import { useQuery } from '@tanstack/react-query';
import {
  databases,
  APPWRITE_DATABASE_ID,
  COLLECTIONS,
  Query,
  isAppwriteConfigured,
} from '@/lib/appwrite';

export interface Announcement {
  $id: string;
  message: string;
  meetupLink: string;
  link?: string;
  badge?: 'UPCOMING' | 'LATEST' | string;
  date?: string;
  platform?: 'meetup' | 'luma' | 'event';
  isActive: boolean;
  order: number;
}

export const fallbackAnnouncements: Announcement[] = [
  {
    $id: 'ann-1',
    message: 'AWS Community Day Pune 2026 — Flagship Annual Conference',
    meetupLink: 'https://lu.ma/acdpune2026',
    badge: 'UPCOMING',
    date: 'Aug 2026',
    platform: 'luma',
    isActive: true,
    order: 1,
  },
  {
    $id: 'ann-2',
    message: 'GenAI & Multi-Agent Systems on AWS Bedrock',
    meetupLink: 'https://www.meetup.com/aws-user-group-pune/events/',
    badge: 'UPCOMING',
    date: 'May 16, 2026',
    platform: 'meetup',
    isActive: true,
    order: 2,
  },
  {
    $id: 'ann-3',
    message: 'Women in Tech Pune: Cloud Architecture & Leadership',
    meetupLink: 'https://www.meetup.com/aws-user-group-women-in-tech-india/',
    badge: 'UPCOMING',
    date: 'June 20, 2026',
    platform: 'meetup',
    isActive: true,
    order: 3,
  },
  {
    $id: 'ann-4',
    message: 'Hands-on Workshop: Serverless & Kubernetes on AWS',
    meetupLink: 'https://lu.ma/awsugpune',
    badge: 'LATEST',
    date: 'Recent Recap',
    platform: 'luma',
    isActive: true,
    order: 4,
  },
  {
    $id: 'ann-5',
    message: 'AWS Cloud Security & Well-Architected Deep Dive',
    meetupLink: 'https://www.meetup.com/aws-user-group-pune/events/',
    badge: 'LATEST',
    date: 'Session Slides',
    platform: 'meetup',
    isActive: true,
    order: 5,
  },
];

async function fetchAnnouncements(): Promise<Announcement[]> {
  if (!isAppwriteConfigured) return [];

  const response = await databases.listDocuments({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: COLLECTIONS.ANNOUNCEMENTS,
    queries: [
      Query.equal('isActive', true),
      Query.orderAsc('order'),
      Query.limit(10),
    ],
  });

  return response.documents as unknown as Announcement[];
}

export function useAnnouncements() {
  const { data, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  const announcements = data && data.length > 0 ? data : fallbackAnnouncements;

  return {
    announcements,
    loading: isLoading,
  };
}
