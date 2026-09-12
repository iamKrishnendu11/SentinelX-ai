import {
    SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiShadcnui, SiNodedotjs, SiExpress,
    SiPostgresql, SiRedis, SiSocketdotio, SiJsonwebtokens, SiOllama, SiFastapi,
    SiDocker, SiGithubactions,
} from "react-icons/si";
import { TECH_STACK } from "@/data/siteData";
import { Reveal, Tag, SectionShell } from "./shared";

const ICONS: Record<string, any> = {
    SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiShadcnui, SiNodedotjs, SiExpress,
    SiPostgresql, SiRedis, SiSocketdotio, SiJsonwebtokens, SiOllama, SiFastapi,
    SiDocker, SiGithubactions,
};

const TechStack = () => (
    <SectionShell id="technology" className="bg-ink">
        <Reveal>
            <Tag>TECHNOLOGY</Tag>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-6xl mt-8">
                Built for <span className="text-ash">real-world security.</span>
            </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-16">
            {TECH_STACK.map((cat, i) => (
                <Reveal key={cat.cat} delay={i * 0.08} className={cat.cat === "DEVOPS" ? "lg:col-span-2" : ""}>
                    <div className="bg-panel p-8 h-full">
                        <p className="font-mono text-[10px] tracking-[0.3em] text-ash mb-6">{cat.cat}</p>
                        <div className="flex flex-wrap gap-2.5">
                            {cat.items.map((t) => {
                                const Icon = t.icon ? ICONS[t.icon] : null;
                                return (
                                    <div
                                        key={t.name}
                                        data-testid={`tech-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                        className="group flex items-center gap-2.5 border border-white/12 hover:border-lime/60 bg-black/30 px-4 py-2.5 transition-colors cursor-default"
                                    >
                                        {Icon ? (
                                            <Icon size={16} className="text-ash group-hover:text-lime transition-colors" />
                                        ) : (
                                            <span className="font-mono text-[10px] text-ash group-hover:text-lime transition-colors">{"{ }"}</span>
                                        )}
                                        <span className="font-mono text-[11px] tracking-wider text-fog group-hover:text-lime transition-colors">{t.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>
    </SectionShell>
);

export default TechStack;
