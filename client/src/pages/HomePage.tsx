import { useGetWorkExperiencesQuery, type WorkExperience } from '../features/workExpierience/workExperienceApi.ts'
import styles from './home.module.css'

function ExperienceEntryItem({ entry }: { entry: WorkExperience }) {
  return (
    <li className={styles.entry}>
      <p className={styles.companyName}>
        {entry.company}
        {entry.totalDuration && (
          <span className={styles.companyDuration}>· {entry.totalDuration}</span>
        )}
      </p>

      <div className={styles.roles}>
        {entry.roles?.map((role) => (
          <div key={`${role.title}-${role.period}`} className={styles.role}>
            <p className={styles.roleTitle}>{role.title}</p>
            <p className={styles.roleMeta}>
              {role.period}
              {role.location && ` · ${role.location}`}
            </p>
            {role.bullets && (
              <ul className={styles.bullets}>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </li>
  )
}

export function HomePage() {
  const { data: experiences, isLoading, isError, error, refetch } =
    useGetWorkExperiencesQuery()

  return (
    <section className="panel">
      <div className={styles.hero}>
        <h2>Cole Berkley</h2>
        <p>Senior Software Engineer · Indianapolis, Indiana</p>
      </div>

      <p className={styles.sectionTitle}>Experience</p>

      {isLoading && <p className={styles.status}>Loading experience…</p>}

      {isError && (
        <p className={styles.error} role="alert">
          Failed to load experience: {String(error)}{' '}
          <button type="button" onClick={() => refetch()}>
            Retry
          </button>
        </p>
      )}

      {!isLoading && !isError && (
        <ul className={styles.timeline}>
          {experiences?.map((entry, index) => (
            <ExperienceEntryItem key={entry.id ?? index} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  )
}