import useTeam, { type TeamMember } from '@/hooks/use-team';

const firstName = (name: string) => {
  const parts = name.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, '').trim().split(/\s+/);
  return parts[0] ?? name;
};

const PersonLine = ({ person, i, n }: { person: TeamMember; i: number; n: number }) => {
  const label = firstName(person.name);
  return (
    <li className="s-team__item" data-sr data-tone={n % 3} data-tag={n % 2} style={{ ['--i' as string]: i }}>
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
            <PersonLine key={p.$id || p.name} person={p} i={i % 3} n={i} />
          ))}
        </ul>
      )}

      {volunteers.length > 0 && (
        <div className="s-team__vols" data-sr>
          <h3>With {volunteers.length} volunteers</h3>
          <ul>
            {volunteers.map((v) => (
              <li key={v.$id || v.name}>
                {v.linkedin ? (
                  <a href={v.linkedin} target="_blank" rel="noopener noreferrer">
                    {v.name}
                  </a>
                ) : (
                  v.name
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
