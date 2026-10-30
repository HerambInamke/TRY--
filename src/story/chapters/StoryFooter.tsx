import { Link } from 'react-router-dom';
import mark from '@/assets/story/mark.png';
import { links } from '../content';

const StoryFooter = () => (
  <footer className="foot" aria-label="Site footer">
    <p className="foot__big" aria-hidden="true">
      AWSUG <span>Pune</span>
    </p>
    <div className="foot__row">
      <span className="wordmark">
        <img src={mark} alt="" width={26} height={30} />
        <span>AWS User Group Pune</span>
      </span>
      <nav className="foot__links" aria-label="Elsewhere">
        <a href={links.meetup} target="_blank" rel="noopener noreferrer">Meetup</a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={links.x} target="_blank" rel="noopener noreferrer">X</a>
        <Link to="/her-tech-era">Her Tech Era</Link>
        <a href={`mailto:${links.email}`}>{links.email}</a>
        <Link to="/dashboard/login">Member login</Link>
      </nav>
    </div>
    <div className="foot__meta">
      <span>© {new Date().getFullYear()} AWS User Group Pune · Community-led, supported by AWS</span>
      <span>
        Fort sticker from a photograph of Shaniwar Wada by{' '}
        <a href="https://commons.wikimedia.org/wiki/File:Shaniwar_Wada_Main_Gate_02.jpg" target="_blank" rel="noopener noreferrer">
          Pravega
        </a>{' '}
        (CC0), Wikimedia Commons, edited
      </span>
    </div>
  </footer>
);

export default StoryFooter;
