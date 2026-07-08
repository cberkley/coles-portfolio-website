import { useGetWorkExperiencesQuery } from '../features/workExpierience/workExperienceApi.ts'
import { ExperienceEntryItem } from '../features/workExpierience/components/ExperienceEntryItem.tsx'
import styles from './home.module.css'

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