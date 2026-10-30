import Sticker from '../Sticker';
import { art } from '../art';

/** Through the gate: the dark doorway becomes the first page of the scrapbook. */
const Inside = () => (
  <section id="inside" className="pg-ink inside" aria-labelledby="inside-title">
    <p className="dymo dymo--orange" data-sr>
      You&rsquo;re in
    </p>
    <h2 id="inside-title" className="big" data-sr>
      Behind the gate is a <span className="hl">community.</span>
    </h2>
    <p className="lead" data-sr>
      Since June 2019, AWS User Group Pune has met every month to learn cloud by building it. Developers, students,
      architects and founders, all free, all volunteer-run. This is our scrapbook.
    </p>

    <div className="inside__collage">
      <figure className="paste paste--a" data-slap>
        <Sticker art={art.printHallway} alt="Members chatting in the hallway at an early AWS User Group Pune meetup" />
        <figcaption className="dymo dymo--sm">2019 · one room</figcaption>
      </figure>
      <div className="inside__note" data-sr>
        <p>
          A few people who build on AWS met in Pune to swap what they had learned. They came back the next month. And the
          next.
        </p>
      </div>
    </div>
  </section>
);

export default Inside;
