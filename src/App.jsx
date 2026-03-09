import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

// ─── API HELPER ───────────────────────────────────────────────────────────────
const apiFetch = async (path, options = {}, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ path, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);
const Icons = {
  ball:     "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  plus:     "M12 5v14M5 12h14",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  lock:     "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  globe:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  repeat:   "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  check:    "M20 6L9 17l-5-5",
  chart:    "M18 20V10M12 20V4M6 20v-6",
  clock:    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  location: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  key:      "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=IBM+Plex+Mono:wght@400;500&family=Barlow:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --orange: #F97316; --orange-dim: #c25a0e; --amber: #FBBF24;
    --bg: #0B0C0E; --surface: #141518; --surface2: #1C1E24; --surface3: #252830;
    --border: #2A2D36; --text: #E8E9EE; --muted: #6B7280;
    --green: #22C55E; --red: #EF4444; --blue: #3B82F6;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Barlow', sans-serif; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 100; }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-text { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 900; letter-spacing: 2px; color: var(--orange); }
  .logo-sub { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1px; }
  .nav { display: flex; gap: 4px; }
  .nav-btn { background: none; border: none; cursor: pointer; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 14px; border-radius: 6px; transition: all 0.15s; }
  .nav-btn:hover { color: var(--text); background: var(--surface2); }
  .nav-btn.active { color: var(--orange); background: rgba(249,115,22,0.1); }
  .header-right { display: flex; align-items: center; gap: 12px; }
  .user-chip { display: flex; align-items: center; gap: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 5px 14px 5px 10px; font-size: 13px; }
  .user-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, var(--orange), var(--amber)); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #000; }
  .role-badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--orange); letter-spacing: 1px; background: rgba(249,115,22,0.12); border-radius: 3px; padding: 1px 5px; }
  .icon-btn { background: none; border: 1px solid var(--border); cursor: pointer; color: var(--muted); padding: 6px; border-radius: 6px; display: flex; align-items: center; transition: all 0.15s; }
  .icon-btn:hover { color: var(--text); border-color: var(--text); }
  .auth-wrap { flex: 1; display: flex; align-items: center; justify-content: center; background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(249,115,22,0.1), transparent); padding: 24px; }
  .auth-card { width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; }
  .auth-title { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 900; color: var(--orange); letter-spacing: 3px; line-height: 1; margin-bottom: 6px; }
  .auth-sub { color: var(--muted); font-size: 14px; margin-bottom: 28px; }
  .auth-switch { text-align: center; margin-top: 20px; font-size: 13px; color: var(--muted); }
  .auth-link { color: var(--orange); cursor: pointer; background: none; border: none; font-size: 13px; text-decoration: underline; }
  .main { flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 32px 24px; }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
  .page-title { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 900; letter-spacing: 2px; line-height: 1; }
  .page-sub { color: var(--muted); font-size: 14px; margin-top: 4px; }
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .stat-card-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .stat-card-val { font-family: 'Barlow Condensed', sans-serif; font-size: 36px; font-weight: 900; color: var(--orange); }
  .stat-card-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .games-grid { display: grid; gap: 16px; }
  .game-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 24px; cursor: pointer; transition: all 0.15s; position: relative; overflow: hidden; }
  .game-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--orange); }
  .game-card.completed::before { background: var(--muted); }
  .game-card.invite-only::before { background: var(--amber); }
  .game-card:hover { border-color: var(--orange); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .game-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
  .game-title { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 1px; }
  .badge-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .badge { font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 4px; border: 1px solid; text-transform: uppercase; }
  .badge-orange { color: var(--orange); border-color: rgba(249,115,22,0.4); background: rgba(249,115,22,0.08); }
  .badge-amber  { color: var(--amber);  border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.08); }
  .badge-green  { color: var(--green);  border-color: rgba(34,197,94,0.4);  background: rgba(34,197,94,0.08); }
  .badge-muted  { color: var(--muted);  border-color: var(--border);        background: var(--surface2); }
  .badge-blue   { color: var(--blue);   border-color: rgba(59,130,246,0.4); background: rgba(59,130,246,0.08); }
  .game-meta { display: flex; gap: 20px; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
  .spots-bar { margin-top: 14px; }
  .spots-label { font-size: 12px; color: var(--muted); margin-bottom: 5px; display: flex; justify-content: space-between; }
  .bar-track { height: 4px; background: var(--surface3); border-radius: 2px; overflow: hidden; }
  .bar-fill { height: 100%; background: var(--orange); border-radius: 2px; transition: width 0.4s; }
  .bar-fill.full { background: var(--red); }
  .game-card-actions { display: flex; gap: 8px; margin-top: 14px; }
  .filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .filter-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
  .filter-btn:hover { color: var(--text); border-color: var(--text); }
  .filter-btn.active { color: var(--orange); border-color: var(--orange); background: rgba(249,115,22,0.1); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; padding: 32px; }
  .modal-title { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 900; letter-spacing: 2px; margin-bottom: 24px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-full { grid-column: 1 / -1; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
  .form-input { background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: 'Barlow', sans-serif; font-size: 14px; padding: 10px 12px; border-radius: 8px; outline: none; transition: border-color 0.15s; width: 100%; }
  .form-input:focus { border-color: var(--orange); }
  .form-input option { background: var(--surface2); }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .toggle-label { font-size: 14px; font-weight: 500; }
  .toggle-desc { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .toggle { width: 44px; height: 24px; background: var(--surface3); border-radius: 12px; cursor: pointer; position: relative; transition: background 0.2s; border: none; flex-shrink: 0; }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: var(--muted); border-radius: 50%; transition: all 0.2s; }
  .toggle.on { background: var(--orange); }
  .toggle.on::after { left: 23px; background: #fff; }
  .btn { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-primary { background: var(--orange); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--orange-dim); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--text); border-color: var(--text); }
  .btn-danger { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-green { background: rgba(34,197,94,0.1); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .btn-green:hover { background: rgba(34,197,94,0.2); }
  .btn-sm { font-size: 11px; padding: 6px 12px; }
  .btn-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 28px; }
  .btn-full { width: 100%; justify-content: center; }
  .detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
  .detail-section { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
  .detail-section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .player-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .player-row:last-child { border-bottom: none; }
  .player-avatar { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--surface3), var(--surface2)); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--muted); }
  .player-name { flex: 1; font-weight: 500; font-size: 14px; }
  .stats-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .stats-table th { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; padding: 8px 12px; text-align: center; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .stats-table th:first-child { text-align: left; }
  .stats-table td { padding: 10px 12px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .stats-table td:first-child { text-align: left; font-weight: 500; }
  .stats-table tr:last-child td { border-bottom: none; }
  .stats-table tr:hover td { background: rgba(255,255,255,0.02); }
  .stats-input { background: var(--surface3); border: 1px solid var(--border); color: var(--text); font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 4px 6px; border-radius: 4px; width: 48px; text-align: center; outline: none; }
  .stats-input:focus { border-color: var(--orange); }
  .history-date { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; color: var(--orange); letter-spacing: 1px; margin-bottom: 8px; }
  .history-block { background: var(--surface2); border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; }
  .history-names { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .name-chip { background: var(--surface3); border: 1px solid var(--border); border-radius: 20px; padding: 3px 10px; font-size: 12px; }
  .lb-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .lb-row:last-child { border-bottom: none; }
  .lb-rank { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 900; width: 28px; color: var(--muted); }
  .lb-rank.top { color: var(--amber); }
  .lb-stat { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 700; color: var(--orange); min-width: 48px; text-align: right; }
  .invite-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; padding: 2px; }
  .invite-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; }
  .invite-item.selected { border-color: var(--orange); background: rgba(249,115,22,0.07); }
  .invite-cb { width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--surface3); }
  .invite-cb.checked { background: var(--orange); border-color: var(--orange); }
  .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px; color: var(--text); }
  .tabs { display: flex; gap: 2px; margin-bottom: 20px; background: var(--surface2); border-radius: 8px; padding: 3px; width: fit-content; }
  .tab { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 7px 16px; border-radius: 6px; cursor: pointer; border: none; background: none; color: var(--muted); transition: all 0.15s; }
  .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.4); }
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .section-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px; }
  .loading { display: flex; align-items: center; justify-content: center; padding: 60px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: var(--red); padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .success-msg { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: var(--green); padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .qr-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px 0; }
  .qr-wrap img { border-radius: 8px; border: 4px solid var(--surface3); }
  .mfa-code-input { font-family: 'IBM Plex Mono', monospace; font-size: 24px; letter-spacing: 8px; text-align: center; width: 100%; }
  .settings-section { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .settings-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: 1px; margin-bottom: 16px; }
  .user-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .user-table th { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .user-table td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
  .user-table tr:last-child td { border-bottom: none; }
  @media (max-width: 768px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .detail-layout { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .nav { display: none; }
  }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];
const initials = (name) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const fmtTime = (t) => { const [h, m] = t.split(":"); const hour = parseInt(h); return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`; };
const isPast = (dateStr) => new Date(dateStr + "T23:59:59") < new Date();

function Toggle({ on, onToggle }) {
  return <button className={`toggle ${on ? "on" : ""}`} onClick={onToggle} />;
}

// ─── AUTH FORMS ───────────────────────────────────────────────────────────────
function LoginForm({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mfaPending, setMfaPending] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState(null);

  const handleLogin = async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: form });
      if (data.mfa_required) {
        setTempToken(data.temp_token);
        setMfaPending(true);
      } else {
        onLogin(data.token, data.user);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleMfa = async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch("/auth/mfa/verify", { method: "POST", body: { temp_token: tempToken, code: mfaCode } });
      onLogin(data.token, data.user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleForgot = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/auth/forgot-password", { method: "POST", body: { email: forgotEmail } });
      setForgotMsg(data.message);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (showForgot) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">RESET</div>
        <div className="auth-sub">Enter your email to receive a reset link</div>
        {error && <div className="error-msg">{error}</div>}
        {forgotMsg && <div className="success-msg">{forgotMsg}</div>}
        {!forgotMsg && <>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <button className="btn btn-primary btn-full" onClick={handleForgot} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </>}
        <div className="auth-switch">
          <button className="auth-link" onClick={() => setShowForgot(false)}>Back to login</button>
        </div>
      </div>
    </div>
  );

  if (mfaPending) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">MFA</div>
        <div className="auth-sub">Enter the 6-digit code from your authenticator app</div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <input className="form-input mfa-code-input" type="text" maxLength={6} value={mfaCode}
            onChange={e => setMfaCode(e.target.value)} placeholder="000000" />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleMfa} disabled={loading || mfaCode.length !== 6}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">PICKUP<br />HOOPS</div>
        <div className="auth-sub">Sign in to your account</div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
        </div>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button className="auth-link" onClick={() => setShowForgot(true)}>Forgot password?</button>
        </div>
        <div className="auth-switch">
          Don't have an account? <button className="auth-link" onClick={onSwitch}>Sign up</button>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({ onSwitch, inviteToken }) {
  const [form, setForm] = useState({ name: "", email: inviteToken ? "" : "", password: "", confirm: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    setLoading(true); setError(null);
    try {
      const data = await apiFetch("/auth/register", { method: "POST", body: { name: form.name, email: form.email, password: form.password, invite_token: inviteToken || undefined } });
      setSuccess(data.message);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">CHECK<br />EMAIL</div>
        <div className="auth-sub" style={{ marginBottom: 0 }}>{success}</div>
        <div className="auth-switch" style={{ marginTop: 24 }}>
          <button className="auth-link" onClick={onSwitch}>Back to login</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">JOIN<br />HOOPS</div>
        <div className="auth-sub">Create your account</div>
        {inviteToken && <div className="success-msg" style={{ marginBottom: 16 }}>You have an invite — fill in your details below.</div>}
        {error && <div className="error-msg">{error}</div>}
        {["name", "email", "password", "confirm"].map((field) => (
          <div key={field} className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">{field === "confirm" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input className="form-input" type={field.includes("password") || field === "confirm" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              placeholder={field === "name" ? "Your full name" : field === "email" ? "you@example.com" : "••••••••"} />
          </div>
        ))}
        <button className="btn btn-primary btn-full" onClick={handleRegister} disabled={loading} style={{ marginTop: 8 }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <div className="auth-switch">
          Already have an account? <button className="auth-link" onClick={onSwitch}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordForm({ token, onDone }) {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    setLoading(true); setError(null);
    try {
      await apiFetch("/auth/reset-password", { method: "POST", body: { token, password: form.password } });
      setSuccess(true);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">ALL SET</div>
        <div className="auth-sub">Your password has been updated.</div>
        <button className="btn btn-primary btn-full" onClick={onDone} style={{ marginTop: 8 }}>Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">NEW<br />PASSWORD</div>
        <div className="auth-sub">Choose a new password for your account</div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">New Password</label>
          <input className="form-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
        </div>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Confirm Password</label>
          <input className="form-input" type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleReset} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView({ currentUser, token, onUserUpdate }) {
  const isAdmin = currentUser.role === "admin" || currentUser.role === "master_admin";
  const isMasterAdmin = currentUser.role === "master_admin";
  const [users, setUsers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("player");
  const [inviteMsg, setInviteMsg] = useState(null);
  const [inviteErr, setInviteErr] = useState(null);
  const [mfaStep, setMfaStep] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaMsg, setMfaMsg] = useState(null);
  const [mfaErr, setMfaErr] = useState(null);

  const api = (path, opts) => apiFetch(path, opts, token);

  useEffect(() => {
    if (isAdmin) api("/auth/users").then(setUsers).catch(() => {});
  }, []);

  const sendInvite = async () => {
    setInviteMsg(null); setInviteErr(null);
    try {
      await api("/auth/invite", { method: "POST", body: { email: inviteEmail, role: inviteRole } });
      setInviteMsg(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (err) { setInviteErr(err.message); }
  };

  const startMfaSetup = async () => {
    try {
      const data = await api("/auth/mfa/setup", { method: "POST" });
      setQrCode(data.qrCode);
      setMfaStep("scan");
    } catch (err) { setMfaErr(err.message); }
  };

  const enableMfa = async () => {
    try {
      await api("/auth/mfa/enable", { method: "POST", body: { code: mfaCode } });
      setMfaMsg("MFA enabled successfully");
      setMfaStep(null);
      onUserUpdate({ ...currentUser, mfa_enabled: true });
    } catch (err) { setMfaErr(err.message); }
  };

  const disableMfa = async () => {
    try {
      await api("/auth/mfa/disable", { method: "POST" });
      setMfaMsg("MFA disabled");
      onUserUpdate({ ...currentUser, mfa_enabled: false });
    } catch (err) { setMfaErr(err.message); }
  };

  const changeRole = async (userId, role) => {
    try {
      await api(`/auth/users/${userId}/role`, { method: "PUT", body: { role } });
      setUsers(u => u.map(x => x.id === userId ? { ...x, role } : x));
    } catch (err) { alert(err.message); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api(`/auth/users/${userId}`, { method: "DELETE" });
      setUsers(u => u.filter(x => x.id !== userId));
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">SETTINGS</div>
          <div className="page-sub">Account and security settings</div>
        </div>
      </div>

      {/* MFA */}
      <div className="settings-section">
        <div className="settings-title">Two-Factor Authentication</div>
        {mfaMsg && <div className="success-msg">{mfaMsg}</div>}
        {mfaErr && <div className="error-msg">{mfaErr}</div>}
        {!mfaStep && (
          <>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
              {currentUser.mfa_enabled ? "MFA is currently enabled on your account." : "Add an extra layer of security using an authenticator app like Google Authenticator or Authy."}
            </p>
            {currentUser.mfa_enabled
              ? <button className="btn btn-danger" onClick={disableMfa}>Disable MFA</button>
              : <button className="btn btn-primary" onClick={startMfaSetup}><Icon path={Icons.shield} size={14} /> Enable MFA</button>
            }
          </>
        )}
        {mfaStep === "scan" && (
          <div className="qr-wrap">
            <p style={{ fontSize: 14, color: "var(--muted)" }}>Scan this QR code with your authenticator app, then enter the 6-digit code below to confirm.</p>
            {qrCode && <img src={qrCode} alt="MFA QR Code" width={180} height={180} />}
            <input className="form-input mfa-code-input" type="text" maxLength={6} value={mfaCode}
              onChange={e => setMfaCode(e.target.value)} placeholder="000000" style={{ maxWidth: 200 }} />
            <button className="btn btn-primary" onClick={enableMfa} disabled={mfaCode.length !== 6}>Confirm & Enable</button>
          </div>
        )}
      </div>

      {/* INVITE (admins only) */}
      {isAdmin && (
        <div className="settings-section">
          <div className="settings-title">Invite Someone</div>
          {inviteMsg && <div className="success-msg">{inviteMsg}</div>}
          {inviteErr && <div className="error-msg">{inviteErr}</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="player@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                <option value="player">Player</option>
                {isMasterAdmin && <option value="admin">Admin</option>}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={sendInvite} disabled={!inviteEmail}>
              <Icon path={Icons.mail} size={14} /> Send Invite
            </button>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT (master admin only) */}
      {isMasterAdmin && users.length > 0 && (
        <div className="settings-section">
          <div className="settings-title">All Users</div>
          <div style={{ overflowX: "auto" }}>
            <table className="user-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>MFA</th><th></th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: "var(--muted)" }}>{u.email}</td>
                    <td>
                      {u.id !== currentUser.id ? (
                        <select className="form-input" style={{ padding: "4px 8px", fontSize: 12 }}
                          value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                          <option value="player">Player</option>
                          <option value="admin">Admin</option>
                          <option value="master_admin">Master Admin</option>
                        </select>
                      ) : <span className="badge badge-orange">{u.role}</span>}
                    </td>
                    <td><span className={`badge ${u.is_verified ? "badge-green" : "badge-muted"}`}>{u.is_verified ? "Yes" : "No"}</span></td>
                    <td><span className={`badge ${u.mfa_enabled ? "badge-green" : "badge-muted"}`}>{u.mfa_enabled ? "On" : "Off"}</span></td>
                    <td>
                      {u.id !== currentUser.id && (
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GAME FORM MODAL ──────────────────────────────────────────────────────────
function GameFormModal({ game, onSave, onClose, currentUser, token, allUsers }) {
  const isEdit = !!game?.id;
  const players = allUsers.filter(u => u.role === "player");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: game?.title || "",
    location: game?.location || "",
    date: game?.date || fmt(new Date(today.getTime() + 86400000)),
    time: game?.time?.slice(0, 5) || "18:00",
    maxSpots: game?.max_spots || 10,
    isRecurring: game?.is_recurring || false,
    recurrence: game?.recurrence || "weekly",
    isPublic: game?.is_public ?? true,
    trackStats: game?.track_stats || false,
    invitedIds: game?.invited_ids || [],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleInvite = (uid) => set("invitedIds", form.invitedIds.includes(uid) ? form.invitedIds.filter(x => x !== uid) : [...form.invitedIds, uid]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.location.trim()) return;
    setSaving(true); setError(null);
    try {
      const payload = { id: game?.id || `g${Date.now()}`, admin_id: currentUser.id, title: form.title, location: form.location, date: form.date, time: form.time, max_spots: form.maxSpots, is_recurring: form.isRecurring, recurrence: form.recurrence, is_public: form.isPublic, track_stats: form.trackStats, invited_ids: form.invitedIds, status: game?.status || "upcoming" };
      const saved = isEdit
        ? await apiFetch(`/games/${game.id}`, { method: "PUT", body: payload }, token)
        : await apiFetch("/games", { method: "POST", body: payload }, token);
      onSave(saved);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{isEdit ? "EDIT GAME" : "NEW GAME"}</div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-grid">
          <div className="form-group form-full">
            <label className="form-label">Game Title</label>
            <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Sunday Run..." />
          </div>
          <div className="form-group form-full">
            <label className="form-label">Location</label>
            <input className="form-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="Court name or address" />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input className="form-input" type="time" value={form.time} onChange={e => set("time", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Spots</label>
            <input className="form-input" type="number" min={2} max={50} value={form.maxSpots} onChange={e => set("maxSpots", parseInt(e.target.value) || 10)} />
          </div>
          <div className="form-group">
            <label className="form-label">Recurrence</label>
            <select className="form-input" disabled={!form.isRecurring} value={form.recurrence} onChange={e => set("recurrence", e.target.value)}>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          {[["isRecurring","Recurring Game","Repeats on a regular cadence"],["isPublic","Public Game","Any user can see and sign up"],["trackStats","Track Stats","Record PTS, REB, AST, STL, BLK"]].map(([k,l,d]) => (
            <div key={k} className="toggle-row">
              <div><div className="toggle-label">{l}</div><div className="toggle-desc">{d}</div></div>
              <Toggle on={form[k]} onToggle={() => set(k, !form[k])} />
            </div>
          ))}
        </div>
        {!form.isPublic && (
          <div style={{ marginTop: 20 }}>
            <div className="section-label">Invite Players</div>
            <div className="invite-list">
              {players.map(p => (
                <div key={p.id} className={`invite-item ${form.invitedIds.includes(p.id) ? "selected" : ""}`} onClick={() => toggleInvite(p.id)}>
                  <div className={`invite-cb ${form.invitedIds.includes(p.id) ? "checked" : ""}`}>
                    {form.invitedIds.includes(p.id) && <Icon path={Icons.check} size={10} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 14 }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Icon path={Icons.check} size={14} /> {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Game"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STATS ENTRY ──────────────────────────────────────────────────────────────
function StatsEntry({ gameId, attendees, dateKey, existingStats, allUsers, token, onSave }) {
  const [stats, setStats] = useState(() => {
    const init = {};
    attendees.forEach(uid => { init[uid] = existingStats?.[uid] || { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 }; });
    return init;
  });
  const [saving, setSaving] = useState(false);

  const update = (uid, field, val) => setStats(s => ({ ...s, [uid]: { ...s[uid], [field]: parseInt(val) || 0 } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/games/${gameId}/stats`, { method: "POST", body: { date: dateKey, stats } }, token);
      onSave(stats);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table className="stats-table">
          <thead><tr><th>Player</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th></tr></thead>
          <tbody>
            {attendees.map(uid => {
              const u = allUsers.find(x => x.id === uid);
              if (!u) return null;
              return (
                <tr key={uid}>
                  <td>{u.name}</td>
                  {["pts","reb","ast","stl","blk"].map(f => (
                    <td key={f}><input className="stats-input" type="number" min={0} value={stats[uid]?.[f] || 0} onChange={e => update(uid, f, e.target.value)} /></td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="btn-row">
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
          <Icon path={Icons.check} size={12} /> {saving ? "Saving..." : "Save Stats"}
        </button>
      </div>
    </div>
  );
}

// ─── GAME DETAIL ──────────────────────────────────────────────────────────────
function GameDetail({ gameId, currentUser, allUsers, token, onBack }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("roster");
  const [attendanceDate, setAttendanceDate] = useState(fmt(today));
  const [localAttended, setLocalAttended] = useState([]);
  const [editStats, setEditStats] = useState(false);
  const [editingGame, setEditingGame] = useState(false);

  const api = (path, opts) => apiFetch(path, opts, token);

  const loadGame = async () => {
    setLoading(true);
    try { const g = await api(`/games/${gameId}`); setGame(g); setLocalAttended(g.attendance?.[fmt(today)] || []); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadGame(); }, [gameId]);
  useEffect(() => { if (game) setLocalAttended(game.attendance?.[attendanceDate] || []); }, [attendanceDate]);

  if (loading) return <div className="loading">Loading game...</div>;
  if (!game) return <div className="loading">Game not found.</div>;

  const isAdmin = (currentUser.role === "admin" || currentUser.role === "master_admin") && game.admin_id === currentUser.id;
  const isSignedUp = game.signup_ids?.includes(currentUser.id);
  const isFull = (game.signup_ids?.length || 0) >= game.max_spots;
  const canSignUp = game.is_public || game.invited_ids?.includes(currentUser.id);

  const handleSignup = async () => {
    isSignedUp
      ? await api(`/games/${game.id}/signup`, { method: "DELETE", body: { user_id: currentUser.id } })
      : await api(`/games/${game.id}/signup`, { method: "POST", body: { user_id: currentUser.id } });
    await loadGame();
  };

  const removePlayer = async (uid) => {
    await api(`/games/${game.id}/signup`, { method: "DELETE", body: { user_id: uid } });
    await loadGame();
  };

  const saveAttendance = async () => {
    await api(`/games/${game.id}/attendance`, { method: "POST", body: { date: attendanceDate, user_ids: localAttended } });
    await loadGame();
  };

  const deleteGame = async () => {
    if (!window.confirm("Delete this game?")) return;
    await api(`/games/${game.id}`, { method: "DELETE" });
    onBack();
  };

  const allStats = {};
  Object.values(game.stats || {}).forEach(session => {
    Object.entries(session).forEach(([uid, s]) => {
      if (!allStats[uid]) allStats[uid] = { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, gp: 0 };
      allStats[uid].pts += s.pts; allStats[uid].reb += s.reb;
      allStats[uid].ast += s.ast; allStats[uid].stl += s.stl;
      allStats[uid].blk += s.blk; allStats[uid].gp += 1;
    });
  });

  const historyDates = Object.keys(game.attendance || {}).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 16 }}>← Back to Games</button>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="page-title">{game.title}</div>
            </div>
            <div className="badge-row" style={{ marginBottom: 12 }}>
              {game.is_recurring && <span className="badge badge-blue"><Icon path={Icons.repeat} size={9} /> {game.recurrence}</span>}
              {game.is_public ? <span className="badge badge-green"><Icon path={Icons.globe} size={9} /> Public</span>
                : <span className="badge badge-amber"><Icon path={Icons.lock} size={9} /> Invite Only</span>}
              {game.track_stats && <span className="badge badge-orange"><Icon path={Icons.chart} size={9} /> Stats On</span>}
              <span className={`badge ${game.status === "completed" ? "badge-muted" : "badge-orange"}`}>{game.status}</span>
            </div>
            <div className="game-meta">
              <div className="meta-item"><Icon path={Icons.calendar} size={13} />{fmtDate(game.date)}</div>
              <div className="meta-item"><Icon path={Icons.clock} size={13} />{fmtTime(game.time)}</div>
              <div className="meta-item"><Icon path={Icons.location} size={13} />{game.location}</div>
              <div className="meta-item"><Icon path={Icons.users} size={13} />{game.signup_ids?.length} / {game.max_spots} spots</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexDirection: "column", alignItems: "flex-end" }}>
            {!isAdmin && canSignUp && (
              <button className={`btn ${isSignedUp ? "btn-danger" : "btn-primary"}`} onClick={handleSignup} disabled={!isSignedUp && isFull}>
                {isSignedUp ? "Leave Game" : isFull ? "Full" : "Sign Up"}
              </button>
            )}
            {!isAdmin && !canSignUp && <span className="badge badge-muted">Not Invited</span>}
            {isAdmin && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingGame(true)}><Icon path={Icons.edit} size={12} /> Edit</button>
                <button className="btn btn-danger btn-sm" onClick={deleteGame}><Icon path={Icons.trash} size={12} /> Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "roster" ? "active" : ""}`} onClick={() => setTab("roster")}>Roster</button>
        {isAdmin && <button className={`tab ${tab === "attendance" ? "active" : ""}`} onClick={() => setTab("attendance")}>Attendance</button>}
        {isAdmin && <button className={`tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>History</button>}
        {game.track_stats && <button className={`tab ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>Stats</button>}
      </div>

      {tab === "roster" && (
        <div className="detail-layout">
          <div>
            <div className="detail-section">
              <div className="detail-section-title">Signed Up ({game.signup_ids?.length}/{game.max_spots})</div>
              {!game.signup_ids?.length && <div style={{ fontSize: 14, color: "var(--muted)" }}>No signups yet.</div>}
              {game.signup_ids?.map((uid, i) => {
                const u = allUsers.find(x => x.id === uid);
                if (!u) return null;
                return (
                  <div key={uid} className="player-row">
                    <div className="player-avatar">{initials(u.name)}</div>
                    <div className="player-name">{u.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>#{i + 1}</div>
                    {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => removePlayer(uid)}>Remove</button>}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="detail-section">
              <div className="detail-section-title">Spots</div>
              <div className="spots-bar">
                <div className="spots-label">
                  <span>{game.signup_ids?.length || 0} filled</span>
                  <span>{game.max_spots - (game.signup_ids?.length || 0)} open</span>
                </div>
                <div className="bar-track">
                  <div className={`bar-fill ${isFull ? "full" : ""}`} style={{ width: `${Math.min(((game.signup_ids?.length || 0) / game.max_spots) * 100, 100)}%` }} />
                </div>
              </div>
              {!game.is_public && (
                <div style={{ marginTop: 16 }}>
                  <div className="section-label">Invited</div>
                  {game.invited_ids?.map(uid => {
                    const u = allUsers.find(x => x.id === uid);
                    return u ? (
                      <div key={uid} className="player-row">
                        <div className="player-avatar">{initials(u.name)}</div>
                        <div className="player-name">{u.name}</div>
                        <span className={`badge ${game.signup_ids?.includes(uid) ? "badge-green" : "badge-muted"}`}>
                          {game.signup_ids?.includes(uid) ? "In" : "Pending"}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "attendance" && isAdmin && (
        <div className="detail-section">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="detail-section-title" style={{ margin: 0 }}>Mark Attendance</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="form-label">Date:</div>
              <input className="form-input" type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} style={{ width: 160 }} />
            </div>
          </div>
          {game.signup_ids?.map(uid => {
            const u = allUsers.find(x => x.id === uid);
            if (!u) return null;
            const present = localAttended.includes(uid);
            return (
              <div key={uid} className="player-row">
                <div className="player-avatar">{initials(u.name)}</div>
                <div className="player-name">{u.name}</div>
                <button className={`btn btn-sm ${present ? "btn-green" : "btn-ghost"}`}
                  onClick={() => setLocalAttended(prev => present ? prev.filter(x => x !== uid) : [...prev, uid])}>
                  {present ? <Icon path={Icons.check} size={12} /> : null} {present ? "Present" : "Mark Present"}
                </button>
              </div>
            );
          })}
          <div className="btn-row">
            <button className="btn btn-primary" onClick={saveAttendance}><Icon path={Icons.check} size={14} /> Save Attendance</button>
          </div>
          {game.track_stats && localAttended.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div className="divider" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="detail-section-title" style={{ margin: 0 }}>Stats for {fmtDate(attendanceDate)}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditStats(!editStats)}>{editStats ? "Cancel" : "Enter Stats"}</button>
              </div>
              {editStats && (
                <div style={{ marginTop: 16 }}>
                  <StatsEntry gameId={game.id} attendees={localAttended} dateKey={attendanceDate}
                    existingStats={game.stats?.[attendanceDate]} allUsers={allUsers} token={token}
                    onSave={() => { setEditStats(false); loadGame(); }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "history" && isAdmin && (
        <div className="detail-section">
          <div className="detail-section-title">Attendance History</div>
          {historyDates.length === 0 && <div style={{ fontSize: 14, color: "var(--muted)" }}>No attendance recorded yet.</div>}
          {historyDates.map(d => (
            <div key={d} className="history-block">
              <div className="history-date">{fmtDate(d)}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{game.attendance[d].length} players showed up</div>
              <div className="history-names">
                {game.attendance[d].map(uid => {
                  const u = allUsers.find(x => x.id === uid);
                  return u ? <span key={uid} className="name-chip">{u.name}</span> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "stats" && (
        <div className="detail-section">
          <div className="detail-section-title">Season Totals</div>
          {Object.keys(allStats).length === 0 && <div style={{ fontSize: 14, color: "var(--muted)" }}>No stats recorded yet.</div>}
          {Object.keys(allStats).length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table className="stats-table">
                <thead><tr><th>Player</th><th>GP</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th></tr></thead>
                <tbody>
                  {Object.entries(allStats).sort((a, b) => b[1].pts - a[1].pts).map(([uid, s]) => {
                    const u = allUsers.find(x => x.id === uid);
                    return u ? (
                      <tr key={uid}>
                        <td><strong>{u.name}</strong></td><td>{s.gp}</td>
                        <td style={{ color: "var(--orange)", fontWeight: 700 }}>{s.pts}</td>
                        <td>{s.reb}</td><td>{s.ast}</td><td>{s.stl}</td><td>{s.blk}</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {editingGame && (
        <GameFormModal game={game} currentUser={currentUser} token={token} allUsers={allUsers}
          onSave={() => { setEditingGame(false); loadGame(); }}
          onClose={() => setEditingGame(false)} />
      )}
    </div>
  );
}

// ─── GAMES LIST ───────────────────────────────────────────────────────────────
function GamesView({ currentUser, allUsers, token, onSelectGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const isAdmin = currentUser.role === "admin" || currentUser.role === "master_admin";

  const loadGames = async () => {
    setLoading(true);
    try { setGames(await apiFetch("/games", {}, token)); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadGames(); }, []);

  const handleSignup = async (game) => {
    const isSignedUp = game.signup_ids?.includes(currentUser.id);
    isSignedUp
      ? await apiFetch(`/games/${game.id}/signup`, { method: "DELETE", body: { user_id: currentUser.id } }, token)
      : await apiFetch(`/games/${game.id}/signup`, { method: "POST", body: { user_id: currentUser.id } }, token);
    await loadGames();
  };

  const visible = games.filter(g => {
    if (isAdmin && g.admin_id !== currentUser.id) return false;
    if (!isAdmin && !g.is_public && !g.invited_ids?.includes(currentUser.id) && !g.signup_ids?.includes(currentUser.id)) return false;
    if (filter === "upcoming") return !isPast(g.date);
    if (filter === "completed") return isPast(g.date);
    if (filter === "mine") return g.signup_ids?.includes(currentUser.id);
    return true;
  });

  const myGames = games.filter(g => g.admin_id === currentUser.id);
  const totalPlayers = new Set(myGames.flatMap(g => g.signup_ids || [])).size;
  const upcoming = myGames.filter(g => !isPast(g.date)).length;

  return (
    <div>
      {isAdmin && (
        <div className="stats-row">
          {[["Total Games", myGames.length, `${myGames.filter(g => g.is_recurring).length} recurring`],
            ["Unique Players", totalPlayers, "across all games"],
            ["Upcoming", upcoming, "scheduled games"],
            ["Completed", myGames.length - upcoming, "games played"]].map(([label, val, sub]) => (
            <div key={label} className="stat-card">
              <div className="stat-card-label">{label}</div>
              <div className="stat-card-val">{val}</div>
              <div className="stat-card-sub">{sub}</div>
            </div>
          ))}
        </div>
      )}
      <div className="page-header">
        <div>
          <div className="page-title">{isAdmin ? "MY GAMES" : "OPEN RUNS"}</div>
          <div className="page-sub">{isAdmin ? "Manage your pickup sessions" : "Sign up for a game near you"}</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Icon path={Icons.plus} size={14} /> New Game
          </button>
        )}
      </div>
      <div className="filters">
        {[["all","All"],["upcoming","Upcoming"],["completed","Completed"]].map(([v,l]) => (
          <button key={v} className={`filter-btn ${filter === v ? "active" : ""}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
        {!isAdmin && <button className={`filter-btn ${filter === "mine" ? "active" : ""}`} onClick={() => setFilter("mine")}>My Signups</button>}
      </div>
      {loading ? <div className="loading">Loading games...</div> : (
        <div className="games-grid">
          {visible.length === 0 && (
            <div className="empty">
              <div className="empty-title">No Games Found</div>
              <div style={{ fontSize: 14 }}>{isAdmin ? "Create your first game above." : "Check back later or ask an admin for an invite."}</div>
            </div>
          )}
          {visible.map(g => {
            const signupCount = g.signup_ids?.length || 0;
            const pct = (signupCount / g.max_spots) * 100;
            const past = isPast(g.date);
            const isSignedUp = g.signup_ids?.includes(currentUser.id);
            return (
              <div key={g.id} className={`game-card ${past ? "completed" : ""} ${!g.is_public ? "invite-only" : ""}`} onClick={() => onSelectGame(g.id)}>
                <div className="game-card-top">
                  <div className="game-title">{g.title}</div>
                  <div className="badge-row">
                    {g.is_recurring && <span className="badge badge-blue"><Icon path={Icons.repeat} size={9} /> {g.recurrence}</span>}
                    {g.is_public ? <span className="badge badge-green"><Icon path={Icons.globe} size={9} /> Public</span>
                      : <span className="badge badge-amber"><Icon path={Icons.lock} size={9} /> Invite Only</span>}
                    {past && <span className="badge badge-muted">Past</span>}
                  </div>
                </div>
                <div className="game-meta">
                  <div className="meta-item"><Icon path={Icons.calendar} size={13} />{fmtDate(g.date)} · {fmtTime(g.time)}</div>
                  <div className="meta-item"><Icon path={Icons.location} size={13} />{g.location}</div>
                </div>
                <div className="spots-bar">
                  <div className="spots-label">
                    <span>{signupCount} / {g.max_spots} players</span>
                    <span style={{ color: pct >= 100 ? "var(--red)" : "var(--muted)" }}>{pct >= 100 ? "Full" : `${g.max_spots - signupCount} open`}</span>
                  </div>
                  <div className="bar-track">
                    <div className={`bar-fill ${pct >= 100 ? "full" : ""}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
                {!isAdmin && (
                  <div className="game-card-actions" onClick={e => e.stopPropagation()}>
                    <button className={`btn btn-sm ${isSignedUp ? "btn-danger" : "btn-primary"}`}
                      disabled={!isSignedUp && (pct >= 100 || (!g.is_public && !g.invited_ids?.includes(currentUser.id)))}
                      onClick={() => handleSignup(g)}>
                      {isSignedUp ? "Leave" : pct >= 100 ? "Full" : !g.is_public && !g.invited_ids?.includes(currentUser.id) ? "Not Invited" : "Sign Up"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {showCreate && (
        <GameFormModal currentUser={currentUser} token={token} allUsers={allUsers}
          onSave={() => { loadGames(); setShowCreate(false); }}
          onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

// ─── STATS LEADERBOARD ────────────────────────────────────────────────────────
function StatsView({ allUsers, token }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stat, setStat] = useState("pts");
  const statLabels = { pts: "Points", reb: "Rebounds", ast: "Assists", stl: "Steals", blk: "Blocks" };

  useEffect(() => {
    const load = async () => {
      const all = await apiFetch("/games", {}, token);
      const detailed = await Promise.all(all.filter(g => g.track_stats).map(g => apiFetch(`/games/${g.id}`, {}, token)));
      setGames(detailed);
      setLoading(false);
    };
    load();
  }, []);

  const aggregated = {};
  games.forEach(g => {
    Object.values(g.stats || {}).forEach(session => {
      Object.entries(session).forEach(([uid, s]) => {
        if (!aggregated[uid]) aggregated[uid] = { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, gp: 0 };
        aggregated[uid].pts += s.pts; aggregated[uid].reb += s.reb;
        aggregated[uid].ast += s.ast; aggregated[uid].stl += s.stl;
        aggregated[uid].blk += s.blk; aggregated[uid].gp += 1;
      });
    });
  });

  const sorted = Object.entries(aggregated).sort((a, b) => b[1][stat] - a[1][stat]);

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">LEADERBOARD</div><div className="page-sub">All-time stats across every tracked game</div></div>
      </div>
      <div className="tabs">
        {Object.entries(statLabels).map(([k, v]) => (
          <button key={k} className={`tab ${stat === k ? "active" : ""}`} onClick={() => setStat(k)}>{v}</button>
        ))}
      </div>
      {loading ? <div className="loading">Loading stats...</div> : (
        <div className="detail-layout">
          <div className="detail-section">
            <div className="detail-section-title">{statLabels[stat]} Leaders</div>
            {sorted.length === 0 && <div style={{ fontSize: 14, color: "var(--muted)" }}>No stats recorded yet.</div>}
            {sorted.map(([uid, s], i) => {
              const u = allUsers.find(x => x.id === uid);
              if (!u) return null;
              return (
                <div key={uid} className="lb-row">
                  <div className={`lb-rank ${i < 3 ? "top" : ""}`}>{i + 1}</div>
                  <div className="player-avatar">{initials(u.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.gp} game{s.gp !== 1 ? "s" : ""} played</div>
                  </div>
                  <div className="lb-stat">{s[stat]}</div>
                </div>
              );
            })}
          </div>
          <div>
            <div className="detail-section">
              <div className="detail-section-title">Full Table</div>
              {sorted.length > 0 && (
                <table className="stats-table">
                  <thead><tr><th>Player</th><th>GP</th><th>PTS</th><th>REB</th><th>AST</th></tr></thead>
                  <tbody>
                    {sorted.map(([uid, s]) => {
                      const u = allUsers.find(x => x.id === uid);
                      return u ? (
                        <tr key={uid}>
                          <td>{u.name}</td><td>{s.gp}</td>
                          <td style={{ color: "var(--orange)", fontWeight: 700 }}>{s.pts}</td>
                          <td>{s.reb}</td><td>{s.ast}</td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("ph_token"));
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [authPage, setAuthPage] = useState("login");
  const [view, setView] = useState("games");
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [loading, setLoading] = useState(!!token);

  // Parse URL params for invite/reset tokens
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get("invite");
  const resetToken = params.get("token");
  const isResetPage = window.location.pathname === "/reset-password" || !!resetToken;

  useEffect(() => {
    if (inviteToken) setAuthPage("register");
  }, [inviteToken]);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch("/auth/me", {}, token)
      .then(user => { setCurrentUser(user); setLoading(false); })
      .catch(() => { localStorage.removeItem("ph_token"); setToken(null); setLoading(false); });
  }, [token]);

  useEffect(() => {
    if (!token || !currentUser) return;
    apiFetch("/users", {}, token).then(setAllUsers).catch(() => {});
  }, [token, currentUser]);

  const handleLogin = (newToken, user) => {
    localStorage.setItem("ph_token", newToken);
    setToken(newToken);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("ph_token");
    setToken(null);
    setCurrentUser(null);
    setView("games");
    setSelectedGameId(null);
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="app" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="loading">Connecting...</div>
      </div>
    </>
  );

  if (isResetPage && resetToken) return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header"><div className="logo"><Icon path={Icons.ball} size={22} color="var(--orange)" /><div className="logo-text">PICKUP.HOOPS</div></div></div>
        <ResetPasswordForm token={resetToken} onDone={() => { window.history.pushState({}, "", "/"); setAuthPage("login"); }} />
      </div>
    </>
  );

  if (!currentUser) return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header"><div className="logo"><Icon path={Icons.ball} size={22} color="var(--orange)" /><div className="logo-text">PICKUP.HOOPS</div></div></div>
        {authPage === "login"
          ? <LoginForm onLogin={handleLogin} onSwitch={() => setAuthPage("register")} />
          : <RegisterForm onSwitch={() => setAuthPage("login")} inviteToken={inviteToken} />}
      </div>
    </>
  );

  const isAdmin = currentUser.role === "admin" || currentUser.role === "master_admin";

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="logo">
            <Icon path={Icons.ball} size={22} color="var(--orange)" />
            <div><div className="logo-text">PICKUP.HOOPS</div><div className="logo-sub">COURT MANAGEMENT</div></div>
          </div>
          <nav className="nav">
            <button className={`nav-btn ${view === "games" ? "active" : ""}`} onClick={() => { setView("games"); setSelectedGameId(null); }}>Games</button>
            <button className={`nav-btn ${view === "stats" ? "active" : ""}`} onClick={() => { setView("stats"); setSelectedGameId(null); }}>Stats</button>
            <button className={`nav-btn ${view === "settings" ? "active" : ""}`} onClick={() => { setView("settings"); setSelectedGameId(null); }}>Settings</button>
          </nav>
          <div className="header-right">
            <div className="user-chip">
              <div className="user-avatar">{initials(currentUser.name)}</div>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{currentUser.name}</span>
              {isAdmin && <span className="role-badge">{currentUser.role === "master_admin" ? "MASTER" : "ADMIN"}</span>}
            </div>
            <button className="icon-btn" title="Sign out" onClick={handleLogout}><Icon path={Icons.logout} size={16} /></button>
          </div>
        </div>
        <div className="main">
          {view === "games" && !selectedGameId && <GamesView currentUser={currentUser} allUsers={allUsers} token={token} onSelectGame={setSelectedGameId} />}
          {view === "games" && selectedGameId && <GameDetail gameId={selectedGameId} currentUser={currentUser} allUsers={allUsers} token={token} onBack={() => setSelectedGameId(null)} />}
          {view === "stats" && <StatsView allUsers={allUsers} token={token} />}
          {view === "settings" && <SettingsView currentUser={currentUser} token={token} onUserUpdate={setCurrentUser} />}
        </div>
      </div>
    </>
  );
}
