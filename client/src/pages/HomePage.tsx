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

      <div className={styles.intro}>
        <p>
          I'm a software engineer with 15+ years of experience building web applications across
          a wide range of industries. I enjoy working across the full stack — from crafting
          clean, responsive UIs to designing APIs and cloud infrastructure.
        </p>
        <p>
          Over my career I've worked extensively with technologies including{' '}
          <strong>C#, ASP.NET Core, SQL Server, Oracle, Azure, React, TypeScript, Aurelia,
          JavaScript, HTML, CSS, and Lit</strong>.
        </p>
        <p className={styles.siteNote}>
          This site is built with <strong>React</strong>, <strong>TypeScript</strong>, and{' '}
          <strong>Vite</strong> on the front end, backed by <strong>Azure Functions (.NET)</strong>,{' '}
          <strong>Cosmos DB</strong>, and hosted on <strong>Azure Static Web Apps</strong>.
        </p>
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