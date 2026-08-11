import React, { useState } from "react";
import { Plus, Trash2, Check, LayoutDashboard, UserPlus, ClipboardList, Link2 } from "lucide-react";
import { PhaseCard, PhaseFooter } from "../components/PhaseCard.jsx";
import { money } from "../utils/format.js";
import { api } from "../api.js";

export default function AdminScene({ state, setState, onGoDashboard }) {
  const { employees, tasks } = state;
  const [phase, setPhase] = useState(1);
  const [dir, setDir] = useState("r");
  const [empName, setEmpName] = useState("");
  const [empRate, setEmpRate] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskBudget, setTaskBudget] = useState("");
  const [busy, setBusy] = useState(false);

  const goto = (p) => { setDir(p > phase ? "r" : "l"); setPhase(p); };

  const run = async (fn) => {
    setBusy(true);
    try {
      const next = await fn();
      setState(next);
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const phases = [
    { n: 1, label: "Employees", icon: <UserPlus size={14} /> },
    { n: 2, label: "Tasks", icon: <ClipboardList size={14} /> },
    { n: 3, label: "Assign crew", icon: <Link2 size={14} /> },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="anim-fadeup mb-8">
        <div className="text-[11px] text-[#8A93A3] disp tracking-wider mb-1">Setup</div>
        <h1 className="disp text-3xl font-semibold">Admin workspace</h1>
        <p className="text-sm text-[#8A93A3] mt-1">Build out your crew, define labor budgets, then assign people to tasks.</p>
      </div>

      <div className="flex items-center gap-2 mb-8 anim-fadeup" style={{ animationDelay: ".05s" }}>
        {phases.map((p, i) => (
          <React.Fragment key={p.n}>
            <button
              onClick={() => goto(p.n)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                phase === p.n
                  ? "bg-[#F5A623] text-[#12151A] border-[#F5A623]"
                  : "bg-[#171B22] text-[#8A93A3] border-[#252B34] hover:border-[#3a4250]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${phase === p.n ? "bg-[#12151A] text-[#F5A623]" : "bg-[#242B35]"}`}>
                {phase > p.n ? <Check size={10} /> : p.n}
              </span>
              {p.icon} {p.label}
            </button>
            {i < phases.length - 1 && <div className="flex-1 h-px bg-[#252B34]" />}
          </React.Fragment>
        ))}
      </div>

      <div key={phase} className={dir === "r" ? "anim-slide-r" : "anim-slide-l"}>
        {phase === 1 && (
          <PhaseCard title="Employees & hourly rates" subtitle="Everyone who can clock into a task, and what they cost per hour.">
            <div className="flex gap-2 mb-4">
              <input value={empName} onChange={(e) => setEmpName(e.target.value)} placeholder="Employee name"
                className="flex-1 bg-[#12151A] border border-[#2A303B] rounded-md px-3 py-2 text-sm outline-none focus:border-[#F5A623]" />
              <input value={empRate} onChange={(e) => setEmpRate(e.target.value)} placeholder="$/hr" type="number"
                className="w-28 bg-[#12151A] border border-[#2A303B] rounded-md px-3 py-2 text-sm outline-none focus:border-[#F5A623] mono" />
              <button
                disabled={busy}
                onClick={() => run(async () => {
                  const r = await api.addEmployee(empName, Number(empRate));
                  setEmpName(""); setEmpRate("");
                  return r;
                })}
                className="flex items-center gap-1.5 bg-[#F5A623] text-[#12151A] text-sm font-semibold px-4 rounded-md hover:bg-[#ffb84d] disabled:opacity-60"
              >
                <Plus size={15} /> Add
              </button>
            </div>
            <div className="stagger space-y-1.5">
              {employees.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-3 py-2.5 rounded-md bg-[#12151A] border border-[#242B35]">
                  <span className="text-sm font-medium">{e.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="mono text-sm text-[#8A93A3]">{money(e.rate)}/hr</span>
                    <button onClick={() => run(() => api.removeEmployee(e.id))} className="text-[#8A93A3] hover:text-[#FF4E33] p-1"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {employees.length === 0 && <div className="text-sm text-[#8A93A3] py-3">No employees yet — add your first one above.</div>}
            </div>
            <PhaseFooter onNext={() => goto(2)} nextLabel="Next: Tasks" />
          </PhaseCard>
        )}

        {phase === 2 && (
          <PhaseCard title="Tasks & labor budgets" subtitle="Each task gets a fixed dollar budget that its crew burns through.">
            <div className="flex gap-2 mb-4">
              <input value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Task name"
                className="flex-1 bg-[#12151A] border border-[#2A303B] rounded-md px-3 py-2 text-sm outline-none focus:border-[#F5A623]" />
              <input value={taskBudget} onChange={(e) => setTaskBudget(e.target.value)} placeholder="Budget $" type="number"
                className="w-32 bg-[#12151A] border border-[#2A303B] rounded-md px-3 py-2 text-sm outline-none focus:border-[#F5A623] mono" />
              <button
                disabled={busy}
                onClick={() => run(async () => {
                  const r = await api.addTask(taskName, Number(taskBudget));
                  setTaskName(""); setTaskBudget("");
                  return r;
                })}
                className="flex items-center gap-1.5 bg-[#F5A623] text-[#12151A] text-sm font-semibold px-4 rounded-md hover:bg-[#ffb84d] disabled:opacity-60"
              >
                <Plus size={15} /> Add
              </button>
            </div>
            <div className="stagger space-y-1.5">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-3 py-2.5 rounded-md bg-[#12151A] border border-[#242B35]">
                  <span className="text-sm font-medium">{t.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="mono text-sm text-[#8A93A3]">{money(t.budget)} budget</span>
                    <button onClick={() => run(() => api.removeTask(t.id))} className="text-[#8A93A3] hover:text-[#FF4E33] p-1"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <div className="text-sm text-[#8A93A3] py-3">No tasks yet — add your first one above.</div>}
            </div>
            <PhaseFooter onBack={() => goto(1)} onNext={() => goto(3)} nextLabel="Next: Assign crew" />
          </PhaseCard>
        )}

        {phase === 3 && (
          <PhaseCard title="Assign crew to tasks" subtitle="Tick who's eligible to clock into each task. You'll clock people in and out live from the Dashboard.">
            <div className="stagger space-y-4">
              {tasks.map((t) => (
                <div key={t.id} className="rounded-md border border-[#242B35] bg-[#12151A] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="mono text-xs text-[#8A93A3]">{money(t.budget)} budget</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {employees.map((e) => {
                      const on = t.assigned.includes(e.id);
                      return (
                        <button
                          key={e.id}
                          onClick={() => run(() => on ? api.unassign(t.id, e.id) : api.assign(t.id, e.id))}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-all ${
                            on ? "bg-[#3DDC84]/15 border-[#3DDC84]/50 text-[#3DDC84]" : "bg-[#171B22] border-[#2A303B] text-[#8A93A3] hover:border-[#3a4250]"
                          }`}
                        >
                          {on ? <Check size={12} /> : <Plus size={12} />} {e.name}
                        </button>
                      );
                    })}
                    {employees.length === 0 && <span className="text-xs text-[#8A93A3]">Add employees in phase 1 first.</span>}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <div className="text-sm text-[#8A93A3]">Add a task in phase 2 first.</div>}
            </div>
            <PhaseFooter
              onBack={() => goto(2)}
              onNext={() => onGoDashboard(tasks[0]?.id)}
              nextLabel="Go to live dashboard"
              nextIcon={<LayoutDashboard size={15} />}
            />
          </PhaseCard>
        )}
      </div>
    </main>
  );
}
