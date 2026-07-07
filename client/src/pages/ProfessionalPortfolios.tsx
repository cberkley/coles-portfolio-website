import { useGetProfessionalProjectsQuery } from '../features/professionalProjects/professionalProjectsApi.ts'

export function ProfessionalProjectsPage() {
  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfessionalProjectsQuery()

  return (
    <section className="panel">
      <h2>Professional Projects</h2>

      {isLoading && <p>Loading projects…</p>}

      {isError && (
        <p role="alert">
          Failed to load projects: {String(error)}{' '}
          <button type="button" onClick={() => refetch()}>
            Retry
          </button>
        </p>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <p>No professional projects yet.</p>
      )}

      <ul>
        {projects?.map((project) => (
          <li key={project.id ?? project.name}>
            <h3>{project.name}</h3>
            {project.description && <p>{project.description}</p>}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                View demo
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}