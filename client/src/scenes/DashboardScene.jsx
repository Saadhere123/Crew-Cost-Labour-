import React from "react";
import { Plus, LogIn, LogOut, Users, AlertTriangle, Trash2 } from "lucide-react";
import BudgetGauge from "../components/BudgetGauge.jsx";
import Stat from "../components/Stat.jsx";
import { money, moneyPrecise, hoursToParts } from "../utils/format.js";
import { api } from "../api.js";

export default function DashboardScene({ state, setState, selectedTaskId, setSelectedTaskId }) {
  const { tasks, employees } = state;
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const run = async (fn) => {
    try {
      setState(await fn());
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="w-full lg:w-[280px] shrink-0 border-r border-[#252B34] p-4 scrollbar-thin overflow-y-auto lg:h-[calc(100vh-57px)]">
        <div className="disp text-[13px] text-[#8A93A3] tracking-wider mb-2">Tasks</div>
        <div className="stagger space-y-1.5">
          {tasks.map((t) => {
            const pct = t.pctUsed;
            const active = t.activeEmployeeIds.length;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className={`w-full text-left rounded-md px-3 py-2.5 border transition-all ${
                  selectedTaskId === t.id ? "border-[#F5A623] bg-[#1C2129]" : "border-transparent bg-[#171B22] hover:bg-[#1C2129]"
                } ${t.exhausted ? "pulse-danger" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{t.name}</span>
                  {active > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC84] shrink-0 ml-2 animate-pulse" />}
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-[#242B35] overflow-hidden">
                  <div className="h-full rounded-full bar-fill" style={{ width: `${pct}%`, background: t.exhausted ? "#FF4E33" : pct > 80 ? "#F5A623" : "#3DDC84" }} />
                </div>
                <div className="flex justify-between mt-1 text-[11px] mono text-[#8A93A3]">
                  <span>{money(t.consumed)} / {money(t.budget)}</span>
                  <span>{pct.toFixed(0)}%</span>
                </div>
              </button>
            );
          })}
          {tasks.length === 0 && <div className="text-sm text-[#8A93A3]">No tasks yet. Add one from Admin.</div>}
        </div>
      </aside>

      <main className="flex-1 p-6">
        {selectedTask ? (
          <div key={selectedTask.id} className="anim-fade">
            <TaskDashboard
              task={selectedTask}
              roster={selectedTask.assigned.map((id) => employees.find((e) => e.id === id)).filter(Boolean)}
              allEmployees={employees}
              onAssign={(empId) => run(() => api.assign(selectedTask.id, empId))}
              onUnassign={(empId) => run(() => api.unassign(selectedTask.id, empId))}
              onClockIn={(empId) => run(() => api.clockIn(empId, selectedTask.id))}
              onClockOut={(empId) => run(() => api.clockOut(empId))}
            />
          </div>
        ) : (
          <div className="text-[#8A93A3]">No task selected.</div>
        )}
      </main>
    </div>
  );
}

function TaskDashboard({ task, roster, allEmployees, onAssign, onUnassign, onClockIn, onClockOut }) {
  const { consumed, overBudget, remainingBudget, remainingHours, exhausted, crewRate, pctUsed, laborBy, hoursBy, activeEmployeeIds } = task;
  const pctRemaining = 100 - pctUsed;
  const parts = remainingHours != null ? hoursToParts(remainingHours) : null;
  const unassigned = allEmployees.filter((e) => !roster.find((r) => r.id === e.id));

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6 anim-fadeup">
        <div>
          <div className="text-[11px] text-[#8A93A3] disp tracking-wider mb-1">Task</div>
          <h1 className="disp text-3xl font-semibold">{task.name}</h1>
        </div>
        {exhausted ? (
          <span className="pulse-danger flex items-center gap-1.5 text-[#FF4E33] bg-[#FF4E33]/10 border border-[#FF4E33]/40 rounded-md px-3 py-1.5 text-xs font-semibold disp tracking-wide">
            <AlertTriangle size={14} /> Labor budget exhausted
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#3DDC84] bg-[#3DDC84]/10 border border-[#3DDC84]/40 rounded-md px-3 py-1.5 text-xs font-semibold disp tracking-wide">
            On budget
          </span>
        )}
      </div>

      <div className="anim-fadeup bg-[#171B22] border border-[#252B34] rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6" style={{ animationDelay: ".05s" }}>
        <BudgetGauge pctRemaining={pctRemaining} exhausted={exhausted} />
        <div className="flex-1 text-center md:text-left">
          <div className="text-[11px] disp tracking-wider text-[#8A93A3] mb-1">
            {crewRate > 0 ? "Counting down at current crew rate" : activeEmployeeIds.length === 0 && remainingHours == null ? "Awaiting first clock-in" : "Crew idle — countdown paused"}
          </div>
          {exhausted ? (
            <div className="mono text-5xl md:text-6xl font-semibold text-[#FF4E33] leading-none">00:00:00</div>
          ) : parts ? (
            <div className="mono text-5xl md:text-6xl font-semibold leading-none">
              <span key={parts.hh} className="anim-tick">{parts.hh}</span><span className="text-2xl text-[#8A93A3]">h</span>{" "}
              <span key={parts.mm} className="anim-tick">{String(parts.mm).padStart(2, "0")}</span><span className="text-2xl text-[#8A93A3]">m</span>{" "}
              <span key={parts.ss} className="anim-tick">{String(parts.ss).padStart(2, "0")}</span><span className="text-2xl text-[#8A93A3]">s</span>
            </div>
          ) : (
            <div className="mono text-4xl text-[#8A93A3] leading-none">— : — : —</div>
          )}
          <div className="text-sm text-[#8A93A3] mt-2">
            {crewRate > 0 ? (
              <>Remaining budget <span className="mono text-[#E8EAED]">{money(remainingBudget)}</span> ÷ crew rate <span className="mono text-[#E8EAED]">{money(crewRate)}/hr</span></>
            ) : "Clock an employee in to start the countdown"}
          </div>
          {exhausted && overBudget > 0 && (
            <div className="mt-2 text-sm text-[#FF4E33] font-medium">
              +{moneyPrecise(overBudget)} over budget so far — crew time is still being recorded
            </div>
          )}
        </div>
      </div>

      <div className="stagger grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Original budget" value={money(task.budget)} />
        <Stat label="Consumed" value={moneyPrecise(consumed)} />
        <Stat label="Remaining budget" value={moneyPrecise(remainingBudget)} accent={remainingBudget === 0 ? "#FF4E33" : undefined} />
        <Stat label="Over-budget cost" value={moneyPrecise(overBudget)} accent={overBudget > 0 ? "#FF4E33" : undefined} />
        <Stat label="Crew currently working" value={String(activeEmployeeIds.length)} />
        <Stat label="Current crew cost" value={crewRate > 0 ? `${money(crewRate)}/hr` : "—"} />
        <Stat label="Budget used" value={`${pctUsed.toFixed(1)}%`} />
        <Stat label="Budget remaining" value={`${pctRemaining.toFixed(1)}%`} accent={pctRemaining < 20 ? "#F5A623" : undefined} />
      </div>

      <div className="anim-fadeup bg-[#171B22] border border-[#252B34] rounded-xl p-5" style={{ animationDelay: ".1s" }}>
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-[#8A93A3]" />
          <div className="disp text-[13px] tracking-wider text-[#8A93A3]">Crew roster</div>
        </div>
        <div className="stagger space-y-2">
          {roster.length === 0 && <div className="text-sm text-[#8A93A3]">No one assigned to this task yet — assign crew from Admin.</div>}
          {roster.map((e) => {
            const active = activeEmployeeIds.includes(e.id);
            const cost = laborBy[e.id] || 0;
            const hrs = hoursBy[e.id] || 0;
            return (
              <div key={e.id} className="flex items-center justify-between gap-3 flex-wrap px-3 py-2.5 rounded-lg bg-[#12151A] border border-[#242B35]">
                <div className="flex items-center gap-2 min-w-[140px]">
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC84] animate-pulse" />}
                  <div>
                    <div className="text-sm font-medium">{e.name}</div>
                    <div className="text-[11px] mono text-[#8A93A3]">{money(e.rate)}/hr</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs mono text-[#8A93A3]">
                  <span>{hrs.toFixed(2)}h worked</span>
                  <span className="text-[#E8EAED]">{moneyPrecise(cost)} accrued</span>
                </div>
                <div className="flex items-center gap-2">
                  {active ? (
                    <button onClick={() => onClockOut(e.id)} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md bg-[#FF4E33]/15 text-[#FF4E33] hover:bg-[#FF4E33]/25 transition-colors">
                      <LogOut size={13} /> Clock out
                    </button>
                  ) : (
                    <button onClick={() => onClockIn(e.id)} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md bg-[#3DDC84]/15 text-[#3DDC84] hover:bg-[#3DDC84]/25 transition-colors">
                      <LogIn size={13} /> Clock in
                    </button>
                  )}
                  <button onClick={() => onUnassign(e.id)} title="Remove from task" className="text-[#8A93A3] hover:text-[#FF4E33] p-1.5"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
        {unassigned.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#242B35]">
            <div className="text-[11px] disp tracking-wider text-[#8A93A3] mb-2">Assign more crew</div>
            <div className="flex flex-wrap gap-2">
              {unassigned.map((e) => (
                <button key={e.id} onClick={() => onAssign(e.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-[#12151A] border border-[#2A303B] hover:border-[#F5A623] transition-colors">
                  <Plus size={12} /> {e.name} <span className="text-[#8A93A3] mono">· {money(e.rate)}/hr</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
