/**
 * Copy and fixed content for the story landing page.
 * Live data (team, FAQs, photos, announcements) still comes from the CMS hooks;
 * everything here is the fallback or the words around it.
 */
import type { FAQItem } from '@/hooks/use-faq';


export const links = {
  meetup: 'https://www.meetup.com/aws-user-group-pune/',
  linkedin: 'https://www.linkedin.com/company/aws-user-group-pune/',
  x: 'https://x.com/AwsPune',
  email: 'aws.acd.pune@gmail.com',
  speak:
    'mailto:aws.acd.pune@gmail.com?subject=I%27d%20like%20to%20speak%20or%20volunteer%20at%20AWSUG%20Pune&body=Hi%20AWSUG%20Pune%20team%2C%0A%0AI%27d%20like%20to%20(speak%20%2F%20volunteer).%20A%20little%20about%20me%3A%0A%0A',
} as const;

/** The month the community first met. Everything on the calendar counts from here. */
export const FIRST_MEETUP = { year: 2019, month: 5 } as const; // June 2019 (0-indexed month)


export const milestones = [
  { year: 2019, title: 'Meetups begin', detail: 'The first meetup in June. Regular learning sessions in Pune become a monthly rhythm.' },
  { year: 2021, title: 'Beyond one room', detail: 'Virtual and hybrid sessions take the meetups to people far outside Pune.' },
  { year: 2025, title: 'The AI/ML edition', detail: 'Focused tracks for AI-native builders and practitioners shipping on AWS.' },
  { year: 2026, title: '700+ in one place', detail: 'AWS Community Day Pune 2026 brings more than 700 attendees together.' },
] as const;

export const fallbackFaqs: FAQItem[] = [
  { question: 'Is it free to attend?', answer: 'Yes. Our meetups and AWS Community Day Pune are free. Some workshops ask you to register in advance because seats are limited.' },
  { question: 'How much AWS do I need to know?', answer: 'None to start. Sessions range from beginner introductions to deep architecture dives, so students and seasoned architects both find something for them.' },
  { question: 'What topics do meetups cover?', answer: 'Serverless, containers and Kubernetes on AWS, AI/ML and GenAI, data engineering, DevOps, security, cost optimisation and whatever new service everyone is curious about.' },
  { question: 'How do I hear about the next event?', answer: 'Join our Meetup group for every invite, follow us on LinkedIn, or leave your email at the bottom of this page.' },
  { question: 'Can I give a talk or run a workshop?', answer: 'Please do. Email aws.acd.pune@gmail.com with your idea. First-time speakers get a mentor to help shape the talk.' },
  { question: 'How do I join Her Tech Era?', answer: 'Her Tech Era is open to everyone. Visit the Her Tech Era page, join the AWS User Group Women in Tech India group on Meetup, and follow our LinkedIn for sessions and mentorship.' },
  { question: 'How can my company sponsor or host?', answer: 'Write to aws.acd.pune@gmail.com. Hosting a meetup or sponsoring Community Day puts you in front of a 20,000-strong community of builders.' },
  { question: 'What is AWS Community Day Pune?', answer: 'A community-run conference organised by AWS User Group Pune: a full day of talks, workshops and networking around AWS, AI/ML and DevOps.' },
];
