import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import {
  decrement,
  increment,
  reset,
} from '../features/counter/counterSlice.ts'

export function HomePage() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <section className="panel">
      <h2>Home</h2>
      <p style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
        Redux and Router are configured. Use this page as your feature starting
        point.
      </p>

      <div className="counter-row">
        <button type="button" onClick={() => dispatch(decrement())}>
          -
        </button>
        <span className="counter-value">{count}</span>
        <button type="button" onClick={() => dispatch(increment())}>
          +
        </button>
        <button type="button" onClick={() => dispatch(reset())}>
          Reset
        </button>
      </div>
    </section>
  )
}