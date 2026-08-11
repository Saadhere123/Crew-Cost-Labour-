/**
 * The countdown labor-budget engine.
 *
 * Every task tracks how much of its dollar budget has been consumed
 * (`consumed`) and how much work has gone over budget (`overBudget`),
 * plus a running per-employee ledger (`laborBy`, `hoursBy`).
 *
 * `advanceTask` settles a task up to "now": given how much real wall-clock
 * time has passed since the task was last settled, and who is currently
 * clocked into it, it spends down the budget at the crew's combined hourly
 * rate. This is called on every read and before every mutation, so the
 * numbers returned to the client are always correct at the instant they're
 * requested — no client-side simulation, no drift.
 */
export function advanceTask(task, employees, clockedIn, paused) {
  const now = Date.now();
  const lastTick = task.lastTick || now;
  const elapsedHours = Math.max(0, (now - lastTick) / 3_600_000);
  task.lastTick = now;

  if (elapsedHours <= 0) return task;

  const activeIds = Object.entries(clockedIn)
    .filter(([, taskId]) => taskId === task.id)
    .map(([employeeId]) => employeeId);

  if (activeIds.length === 0) return task;
  if (paused) return task; // clock is frozen, but lastTick still moves so nothing bursts on resume

  const activeEmployees = activeIds
    .map((id) => employees.find((e) => e.id === id))
    .filter(Boolean);

  const crewRate = activeEmployees.reduce((sum, e) => sum + e.rate, 0);
  if (crewRate <= 0) return task;

  // credit each active employee their own hours/cost for this slice of time
  activeEmployees.forEach((emp) => {
    const cost = emp.rate * elapsedHours;
    task.laborBy[emp.id] = (task.laborBy[emp.id] || 0) + cost;
    task.hoursBy[emp.id] = (task.hoursBy[emp.id] || 0) + elapsedHours;
  });

  const tickCost = crewRate * elapsedHours;

  if (task.consumed >= task.budget) {
    // budget already gone — everything from here is over-budget labor
    task.overBudget += tickCost;
  } else if (task.consumed + tickCost > task.budget) {
    // this slice crosses zero — split it
    const overflow = task.consumed + tickCost - task.budget;
    task.overBudget += overflow;
    task.consumed = task.budget;
  } else {
    task.consumed += tickCost;
  }

  return task;
}

/** Derived, read-only figures the frontend needs but shouldn't have to compute itself. */
export function deriveTaskView(task, employees, clockedIn) {
  const activeIds = Object.entries(clockedIn)
    .filter(([, taskId]) => taskId === task.id)
    .map(([employeeId]) => employeeId);

  const crewRate = activeIds.reduce((sum, id) => {
    const emp = employees.find((e) => e.id === id);
    return sum + (emp ? emp.rate : 0);
  }, 0);

  const remainingBudget = Math.max(0, task.budget - task.consumed);
  const remainingHours = crewRate > 0 ? remainingBudget / crewRate : null;
  const exhausted = task.consumed >= task.budget;

  return {
    ...task,
    activeEmployeeIds: activeIds,
    crewRate,
    remainingBudget,
    remainingHours,
    exhausted,
    pctUsed: task.budget > 0 ? Math.min(100, (task.consumed / task.budget) * 100) : 0,
  };
}
