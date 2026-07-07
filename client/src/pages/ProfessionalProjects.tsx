import { useState } from 'react'
import { userIsAdmin } from '../app/userIsAdmin.ts'
import { ProjectForm } from '../features/professionalProjects/components/ProjectForm.tsx'
import { ProjectList } from '../features/professionalProjects/components/ProjectList.tsx'
import styles from '../features/professionalProjects/components/professionalProjects.module.css'

export function ProfessionalProjectsPage() {
  const { isAdmin } = userIsAdmin()
  const [isAdding, setIsAdding] = useState(false)

  return (
    <section className="panel">
      <div className={styles.header}>
        <h2>Professional Projects</h2>
        {isAdmin && !isAdding && (
          <button type="button" onClick={() => setIsAdding(true)}>
            + Add project
          </button>
        )}
      </div>

      {isAdding && <ProjectForm onDone={() => setIsAdding(false)} />}

      <ProjectList isAdmin={isAdmin} />
    </section>
  )
}