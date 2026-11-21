import useTeam, { type TeamMember } from '@/hooks/use-team';

// Lives inside the name's own <li>, so a line break can never split a star from the name it leads.
const Star = () => (
  <span className="s-team__star" aria-hidden="true">
    <svg viewBox="0 0 120 120">
      <path d="M60 4 L71 40 L108 30 L84 60 L108 90 L71 80 L60 116 L49 80 L12 90 L36 60 L12 30 L49 40 Z" fill="currentColor" />
    </svg>
  </span>
);

const firstName = (name: string) => {
  const parts = name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, '').trim().split(/\s+/);
  return parts[0] ?? name;
};

const PersonLine = ({ person, i, n }: { person: TeamMember; i: number; n: number }) => {
  const label = firstName(person.name);
  return (
    <li className="s-team__item" data-sr data-tone={n % 3} data-tag={n % 2} style={{ ['--i' as string]: i }}>
      <Star />
      <div className="s-team__name">
        {person.linkedin ? (
          <a
            className="s-team__first"
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${person.name} on LinkedIn`}
          >
            {label}
          </a>
        ) : (
          <span className="s-team__first">{label}</span>
        )}
        <span className="s-team__detail">
          {person.name}, {person.role || 'core team'}
        </span>
      </div>
    </li>
  );
};

const Team = () => {
  const { core, volunteers, loading } = useTeam();

  return (
    <section id="people" className="pg-ink crew" aria-labelledby="team-title" aria-busy={loading}>
      <p className="dymo dymo--orange" data-sr>
        The crew
      </p>
      <h2 id="team-title" className="big" data-sr>
        Run by <span className="hl">volunteers.</span>
      </h2>

      {core.length > 0 && (
        <ul className="s-team__list" aria-label="Core team">
          {core.map((p, i) => (
            <PersonLine key={p.$id || p.name} person={p} i={i} n={i} />
          ))}
        </ul>
      )}

      {volunteers.length > 0 && (
        <div className="s-team__vols" data-sr>
          <h3>With {volunteers.length} volunteers</h3>
          <ul>
            {/* A–Z by the first letter of the first name (titles like "Dr." skipped); same letter keeps the CMS order */}
            {[...volunteers]
              .sort((a, b) => firstName(a.name)[0].localeCompare(firstName(b.name)[0], undefined, { sensitivity: 'base' }))
              .map((v) => (
              <li key={v.$id || v.name}>
                {v.linkedin ? (
                  <a href={v.linkedin} target="_blank" rel="noopener noreferrer">
                    {v.name}
                  </a>
                ) : (
                  <span>{v.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Team;
