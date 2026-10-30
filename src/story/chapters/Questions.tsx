import useFAQs from '@/hooks/use-faq';
import { fallbackFaqs, links } from '../content';

const Questions = () => {
  const { faqs } = useFAQs();
  const list = (faqs.length > 0 ? faqs : fallbackFaqs).slice(0, 9);

  return (
    <section id="questions" className="pg-paper faq" aria-labelledby="faq-title">
      <div className="s-faq">
        <div className="s-faq__aside">
          <p className="dymo" data-sr>
            Help desk
          </p>
          <h2 id="faq-title" className="big" data-sr>
            Questions, <span className="hl">answered.</span>
          </h2>
          <p className="s-faq__more" data-sr style={{ ['--i' as string]: 1 }}>
            Still wondering? Write to{' '}
            <a className="s-link" href={`mailto:${links.email}`}>
              {links.email}
            </a>
          </p>
        </div>

        <div className="s-faq__list">
          {list.map((f, i) => (
            <details key={f.$id || f.question} {...({ name: 'story-faq' } as Record<string, string>)} data-sr style={{ ['--i' as string]: Math.min(i, 4) }}>
              <summary>
                <span>{f.question}</span>
                <span className="plus" aria-hidden="true" />
              </summary>
              <p className="answer">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Questions;
