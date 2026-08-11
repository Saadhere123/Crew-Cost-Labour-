import React, { useEffect, useRef, useState } from "react";
import LoginScene from "./scenes/LoginScene.jsx";
import IntroScene from "./scenes/IntroScene.jsx";
import AdminScene from "./scenes/AdminScene.jsx";
import DashboardScene from "./scenes/DashboardScene.jsx";
import TopNav from "./components/TopNav.jsx";
import { api, getToken, clearToken } from "./api.js";

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  const [screen, setScreen] = useState("intro"); // intro | admin | dashboard
  const [state, setState] = useState(null); // { employees, tasks, clockedIn, paused }
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const pollRef = useRef(null);

  // initial load once authenticated
  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    api.getState()
      .then((s) => {
        if (cancelled) return;
        setState(s);
        if (!selectedTaskId && s.tasks[0]) setSelectedTaskId(s.tasks[0].id);
      })
      .catch(() => {
        clearToken();
        setAuthed(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  // live polling — the server is the source of truth, this just keeps the UI fresh
  useEffect(() => {
    if (!authed) return;
    pollRef.current = setInterval(() => {
      api.getState().then(setState).catch(() => {
        clearToken();
        setAuthed(false);
      });
    }, 1000);
    return () => clearInterval(pollRef.current);
  }, [authed]);

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
    setScreen("intro");
    setState(null);
  };

  const togglePause = () => api.togglePause().then(setState);

  if (!authed) {
    return <LoginScene onLoggedIn={() => setAuthed(true)} />;
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8A93A3] text-sm">
        Loading…
      </div>
    );
  }

  return (
    <>
      {screen === "intro" && <IntroScene onEnter={() => setScreen("dashboard")} />}

      {screen !== "intro" && (
        <>
          <TopNav
            screen={screen}
            setScreen={setScreen}
            paused={state.paused}
            onTogglePause={togglePause}
            onLogout={handleLogout}
          />
          {screen === "admin" && (
            <AdminScene
              state={state}
              setState={setState}
              onGoDashboard={(taskId) => {
                if (taskId) setSelectedTaskId(taskId);
                setScreen("dashboard");
              }}
            />
          )}
          {screen === "dashboard" && (
            <DashboardScene
              state={state}
              setState={setState}
              selectedTaskId={selectedTaskId}
              setSelectedTaskId={setSelectedTaskId}
            />
          )}
        </>
      )}
    </>
  );
}
