import { useState } from 'react'
import { userIsAdmin } from '../app/userIsAdmin.ts'
import { ExperienceList } from '../features/workExpierience/components/ExperienceList.tsx'
import { WorkExperienceForm } from '../features/workExpierience/components/WorkExperienceForm.tsx'
import styles from './home.module.css'

export function HomePage() {
  const { isAdmin } = userIsAdmin()
  const [isAdding, setIsAdding] = useState(false)

  return (
    <section className="panel">
      <div className={styles.hero}>
        <h2>Cole Berkley</h2>
        <p>Senior Software Engineer · Indianapolis, Indiana</p>
      </div>

      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>Experience</p>
        {isAdmin && !isAdding && (
          <button type="button" onClick={() => setIsAdding(true)}>
            + Add experience
          </button>
        )}
      </div>

      {isAdding && <WorkExperienceForm onDone={() => setIsAdding(false)} />}

      <ExperienceList isAdmin={isAdmin} />
    </section>
  )
}