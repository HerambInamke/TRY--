import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import StoryLayout from '@/story/StoryLayout';
import { links } from '@/story/content';
import Sticker from '@/story/Sticker';
import { art, FORT_DOOR } from '@/story/art';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn('404: no page at', location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page not found | AWS User Group Pune</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <StoryLayout>
        <section className="pg-paper lost" aria-labelledby="lost-title">
          <div className="lost__fort landing--static" style={{ position: 'relative' }}>
            <div
              className="landing__void"
              style={{ left: `${FORT_DOOR.x * 100}%`, top: `${FORT_DOOR.y * 100}%`, width: `${FORT_DOOR.w * 100}%`, height: `${FORT_DOOR.h * 100}%` }}
            />
            <Sticker art={art.fort} eager cell={3.6} alt="A cut-out sticker of the Shaniwar Wada gate with its doors shut" />
            <div
              className="landing__doors"
              style={{ left: `${FORT_DOOR.x * 100}%`, top: `${FORT_DOOR.y * 100}%`, width: `${FORT_DOOR.w * 100}%`, height: `${FORT_DOOR.h * 100}%` }}
              aria-hidden="true"
            >
              <div className="landing__leaf landing__leaf--l" style={{ width: `${FORT_DOOR.seam * 100}%` }}>
                <Sticker art={art.doorL} eager cell={3.6} />
              </div>
              <div className="landing__leaf landing__leaf--r" style={{ width: `${(1 - FORT_DOOR.seam) * 100}%` }}>
                <Sticker art={art.doorR} eager cell={3.6} />
              </div>
            </div>
          </div>
          <p className="dymo dymo--orange">404</p>
          <h1 id="lost-title" className="big">
            This door is <span className="hl">locked.</span>
          </h1>
          <p className="lead">The link may be old, or the page may have moved. Everything else is through the main gate.</p>
          <div className="lost__actions">
            <Link to="/" className="btn btn--ink">
              Back to the gate <span aria-hidden="true">→</span>
            </Link>
            <a className="link" href={links.meetup} target="_blank" rel="noopener noreferrer">
              See events on Meetup
            </a>
          </div>
        </section>
      </StoryLayout>
    </>
  );
};

export default NotFound;
