import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TREND_DATA, SURFACE_DATA, RISK_DATA, AGENT_ACTIVITY, SECURITY_EVENTS, PATCHES } from "../../data/siteData";
import { Reveal, Tag, SectionShell, Counter } from "./shared";

const tooltipStyle = {
    contentStyle: { background: "#0D0F0D", border: "1px solid rgba(255,255,255,0.15)", fontFamily: "JetBrains Mono", fontSize: 11 },
    labelStyle: { color: "#8B8F88" },
};

const Card = ({ title, children, className = "", testId }) => (
    <div data-testid={testId} className={`border border-white/10 bg-panel p-6 flex flex-col ${className}`}>
        <p className="font-mono text-[10px] tracking-[0.25em] text-ash mb-5">{title}</p>
        {children}
    </div>
);

const sevColor = (s) =>
    s === "CRITICAL" ? "text-[#FF5F56] border-[#FF5F56]/40" : s === "HIGH" ? "text-[#FFB020] border-[#FFB020]/40" : "text-ash border-white/20";

const Dashboard = () => (
    <SectionShell id="dashboard" className="bg-ink">
        <Reveal>
            <Tag>SECURITY INTELLIGENCE</Tag>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-8">
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl">
                    One dashboard. <br />
                    <span className="text-ash">Total visibility.</span>
                </h2>
                <p className="font-mono text-[10px] tracking-[0.2em] text-ash flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" /> LIVE · PROJECT: CHECKOUT-SERVICE · SCAN #4821
                </p>
            </div>
        </Reveal>

        <Reveal delay={0.15}>
            <div data-testid="dashboard-grid" className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 mt-16">
                <Card title="SECURITY SCORE" testId="dash-score">
                    <div className="flex items-end gap-2">
                        <span className="font-display text-6xl font-bold text-lime"><Counter to={94} /></span>
                        <span className="font-mono text-ash text-sm mb-2">/100</span>
                    </div>
                    <p className="font-mono text-[10px] text-lime mt-3">▲ +12 SINCE LAST SPRINT</p>
                </Card>

                <Card title="OPEN VULNERABILITIES" testId="dash-severity">
                    <div className="grid grid-cols-2 gap-4">
                        {[["CRITICAL", "02", "text-[#FF5F56]"], ["HIGH", "05", "text-[#FFB020]"], ["MEDIUM", "11", "text-fog"], ["LOW", "08", "text-ash"]].map(([l, v, c]) => (
                            <div key={l}>
                                <p className={`font-display text-3xl font-bold ${c}`}>{v}</p>
                                <p className="font-mono text-[9px] tracking-[0.2em] text-ash mt-1">{l}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="VULNERABILITY TREND" testId="dash-trend" className="lg:col-span-2 min-h-[220px]">
                    <div className="flex-1 min-h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                <XAxis dataKey="t" tick={{ fill: "#8B8F88", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                                <Tooltip {...tooltipStyle} />
                                <Area type="monotone" dataKey="found" name="Discovered" stroke="#FF5F56" fill="#FF5F56" fillOpacity={0.08} strokeWidth={1.5} />
                                <Area type="monotone" dataKey="fixed" name="Resolved" stroke="#B7FF00" fill="#B7FF00" fillOpacity={0.1} strokeWidth={1.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="ATTACK SURFACE" testId="dash-surface" className="lg:col-span-2 min-h-[220px]">
                    <div className="flex-1 min-h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SURFACE_DATA} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                <XAxis dataKey="name" tick={{ fill: "#8B8F88", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                                <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                                <Bar dataKey="v" name="Entry points" fill="#B7FF00" fillOpacity={0.75} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="RISK DISTRIBUTION" testId="dash-risk" className="min-h-[220px]">
                    <div className="flex-1 min-h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={RISK_DATA} dataKey="value" innerRadius="55%" outerRadius="85%" stroke="#050505" strokeWidth={2}>
                                    {RISK_DATA.map((r) => (
                                        <Cell key={r.name} fill={r.color} />
                                    ))}
                                </Pie>
                                <Tooltip {...tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="PATCH STATUS" testId="dash-patches">
                    <div className="space-y-5">
                        {PATCHES.map((p) => (
                            <div key={p.id}>
                                <div className="flex justify-between font-mono text-[10px] mb-2">
                                    <span className="text-fog">{p.id} {p.name}</span>
                                    <span className={p.state === "MERGED" ? "text-lime" : "text-ash"}>{p.state}</span>
                                </div>
                                <div className="h-1 bg-white/10">
                                    <div className="h-full bg-lime" style={{ width: `${p.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="AGENT ACTIVITY" testId="dash-activity" className="lg:col-span-2">
                    <div className="space-y-3 font-mono text-[11px]">
                        {AGENT_ACTIVITY.map((a) => (
                            <div key={a.msg} className="flex items-center gap-4">
                                <span className="text-lime w-20 shrink-0">{a.agent}</span>
                                <span className="text-fog flex-1">{a.msg}</span>
                                <span className="text-ash/60 text-[10px]">{a.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="RECENT SECURITY EVENTS" testId="dash-events" className="lg:col-span-2">
                    <div className="space-y-3 font-mono text-[11px]">
                        {SECURITY_EVENTS.map((e) => (
                            <div key={e.text} className="flex items-center gap-4">
                                <span className={`border px-1.5 py-0.5 text-[9px] tracking-wider shrink-0 ${sevColor(e.sev)}`}>{e.sev}</span>
                                <span className="text-fog flex-1">{e.text}</span>
                                <span className="text-ash/60 text-[10px]">{e.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </Reveal>
    </SectionShell>
);

export default Dashboard;
