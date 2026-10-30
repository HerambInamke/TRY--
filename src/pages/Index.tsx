import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { communityContent } from '@/content/community';
import StoryLayout from '@/story/StoryLayout';
import Sky from '@/story/chapters/Sky';
import Inside from '@/story/chapters/Inside';
import Numbers from '@/story/chapters/Numbers';
import Rooms from '@/story/chapters/Rooms';
import HerTechEra from '@/story/chapters/HerTechEra';
import Calendar from '@/story/chapters/Calendar';
import Team from '@/story/chapters/Team';
import Questions from '@/story/chapters/Questions';
import Close from '@/story/chapters/Close';
import StoryFooter from '@/story/chapters/StoryFooter';

/**
 * Home: a photocopied sticker scrapbook. You start inside a cloud, descend to Pune, and land in front of
 * Shaniwar Wada; its doors open and the scrapbook of the community begins behind the gate.
 */
const Index = () => {
  const { hash } = useLocation();

  // Arriving from another page with /#chapter: land on it once the chapters exist
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 80);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <>
      <Helmet>
        <title>{communityContent.seoTitle}</title>
        <meta name="description" content={communityContent.seoDescription} />
        <meta name="keywords" content={communityContent.seoKeywords} />
        <meta property="og:title" content={communityContent.seoTitle} />
        <meta property="og:description" content={communityContent.seoDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.awsugpune.in/" />
      </Helmet>

      <StoryLayout footer={<StoryFooter />}>
        <Sky />
        <Inside />
        <Numbers />
        <Rooms />
        <HerTechEra />
        <Calendar />
        <Team />
        <Questions />
        <Close />
      </StoryLayout>
    </>
  );
};

export default Index;
