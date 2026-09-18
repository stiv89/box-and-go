import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  GitBranch,
  LayoutDashboard,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Equipo | Box & Go",
  description: "Guía de trabajo, Jira, GitHub y asignaciones del hackathon Box & Go.",
};

const JIRA_BOARD =
  "https://chocolaton.atlassian.net/jira/software/projects/KAN/boards/2";
const GITHUB_REPO = "https://github.com/stiv89/box-and-go";
const VERCEL_APP = "https://box-and-go.vercel.app";

const quickLinks = [
  {
    label: "Jira Board (KAN)",
    href: JIRA_BOARD,
    description: "Backlog, asignaciones y estado de cada ticket.",
    icon: LayoutDashboard,
  },
  {
    label: "GitHub Repository",
    href: GITHUB_REPO,
    description: "Código fuente, ramas y pull requests.",
    icon: GitBranch,
  },
  {
    label: "Deploy (Vercel)",
    href: VERCEL_APP,
    description: "Preview de la app en producción/staging.",
    icon: ExternalLink,
  },
];

const workflowSteps = [
  {
    title: "1. Clonar e instalar",
    code: `git clone ${GITHUB_REPO}.git\ncd box-and-go\nnpm install`,
  },
  {
    title: "2. Sincronizar con develop",
    code: `git fetch origin\ngit checkout develop\ngit pull origin develop\nnpm run lint && npm run build`,
  },
  {
    title: "3. Trabajar en tu rama",
    code: `# Esteban — integración / polish\ngit checkout -b feature/tu-tarea develop\n\n# Fernando — export\ngit checkout feature/production-export\ngit merge develop\n\n# Manuel — drag & drop\ngit checkout feature/box-builder\ngit merge develop`,
  },
  {
    title: "4. Antes de mergear a develop",
    code: `git checkout develop && git pull origin develop\ngit checkout tu-rama\ngit merge develop\nnpm run lint && npm run build\ngit push origin tu-rama`,
  },
];

type IssueStatus = "done" | "todo";

interface JiraIssue {
  key: string;
  title: string;
  status: IssueStatus;
}

interface TeamMember {
  name: string;
  branch: string;
  folders: string;
  issues: JiraIssue[];
}

const epic: JiraIssue = {
  key: "KAN-4",
  title: "Box & Go — Hackathon MVP",
  status: "todo",
};

const completed: JiraIssue[] = [
  { key: "KAN-5", title: "Initialize Next.js project and shared architecture", status: "done" },
  { key: "KAN-6", title: "Implement Product Experience MVP", status: "done" },
];

const team: TeamMember[] = [
  {
    name: "Esteban",
    branch: "develop / feature/* propias",
    folders: "src/features/product-experience/, layout, integración",
    issues: [
      { key: "KAN-7", title: "Branded chocolate placement", status: "todo" },
      { key: "KAN-8", title: "Product polish", status: "todo" },
      { key: "KAN-9", title: "Vercel deployment", status: "todo" },
      { key: "KAN-10", title: "Feature integration", status: "todo" },
      { key: "KAN-11", title: "End-to-end QA", status: "todo" },
      { key: "KAN-12", title: "Release & presentation", status: "todo" },
    ],
  },
  {
    name: "Fernando",
    branch: "feature/production-export",
    folders: "src/features/production/, src/components/production/",
    issues: [
      { key: "KAN-13", title: "Production specification", status: "todo" },
      { key: "KAN-14", title: "JSON export", status: "todo" },
      { key: "KAN-15", title: "Printable production sheet", status: "todo" },
      { key: "KAN-16", title: "Client visual proof", status: "todo" },
    ],
  },
  {
    name: "Manuel",
    branch: "feature/box-builder",
    folders: "src/features/box-builder/, src/components/box-builder/",
    issues: [
      { key: "KAN-17", title: "Drag and drop", status: "todo" },
      { key: "KAN-18", title: "Slot interactions", status: "todo" },
      { key: "KAN-19", title: "Grid validation", status: "todo" },
    ],
  },
];

const rules = [
  "Trabajar solo en tu rama asignada — nunca mergear feature → main directo.",
  "Integrar siempre en develop. main solo cuando el equipo decida release.",
  "No force-push en ramas compartidas (main, develop).",
  "Coordinar cambios en src/types/ y src/stores/use-box-store.ts.",
  "No editar carpetas de otro dev sin avisar.",
  "Marcar tu ticket en Jira cuando empieces y cuando termines.",
];

function IssueRow({ issue }: { issue: JiraIssue }) {
  const Icon = issue.status === "done" ? CheckCircle2 : Circle;
  return (
    <li className="flex items-start gap-2 text-sm">
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          issue.status === "done" ? "text-emerald-600" : "text-muted-foreground",
        )}
      />
      <span>
        <span className="font-mono text-xs text-[var(--gold-dark)]">{issue.key}</span>
        {" — "}
        {issue.title}
      </span>
    </li>
  );
}

export default function EquipoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--gold-dark)]">
          Hackathon · Cocoa Dolce
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[var(--chocolate-dark)]">
          Guía del equipo
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Todo lo que necesitás para trabajar en Box &amp; Go: links, flujo Git,
          tickets de Jira y responsabilidades por persona.
        </p>
      </header>

      {/* Quick links */}
      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-[var(--chocolate-light)]/25 bg-card p-5 transition-all hover:border-[var(--gold)]/50 hover:shadow-md"
          >
            <link.icon className="size-5 text-[var(--chocolate)]" />
            <p className="mt-3 font-medium text-[var(--chocolate-dark)] group-hover:text-[var(--chocolate)]">
              {link.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--gold-dark)]">
              Abrir <ExternalLink className="size-3" />
            </span>
          </a>
        ))}
      </section>

      {/* Workflow */}
      <section className="mb-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--chocolate-dark)]">
          Cómo trabajar
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Rama de integración: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">develop</code>
          {" · "}
          Producción: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">main</code>
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {workflowSteps.map((step) => (
            <Card key={step.title} className="border-[var(--chocolate-light)]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-[var(--chocolate-dark)] p-3 text-xs leading-relaxed text-[var(--cream)]">
                  {step.code}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Jira backlog */}
      <section className="mb-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--chocolate-dark)]">
          Backlog Jira — 16 issues
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Proyecto{" "}
          <a
            href={JIRA_BOARD}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--chocolate)] underline-offset-2 hover:underline"
          >
            KAN
          </a>
          . Backlog completo — 1 Epic + 15 Tasks.
        </p>

        <Card className="mt-6 border-[var(--chocolate-light)]/20">
          <CardHeader>
            <CardTitle className="text-base">Epic</CardTitle>
          </CardHeader>
          <CardContent>
            <IssueRow issue={epic} />
          </CardContent>
        </Card>

        <Card className="mt-4 border-emerald-200/50 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="text-base text-emerald-800">Completadas</CardTitle>
            <CardDescription>Ya integradas en develop</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {completed.map((issue) => (
                <IssueRow key={issue.key} issue={issue} />
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name} className="border-[var(--chocolate-light)]/20">
              <CardHeader>
                <CardTitle className="font-[family-name:var(--font-display)] text-xl">
                  {member.name}
                </CardTitle>
                <CardDescription>
                  Rama:{" "}
                  <code className="text-xs">{member.branch}</code>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Carpetas: <span className="font-mono">{member.folders}</span>
                </p>
                <ul className="space-y-2">
                  {member.issues.map((issue) => (
                    <IssueRow key={issue.key} issue={issue} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--chocolate-dark)]">
          Reglas del equipo
        </h2>
        <ul className="mt-4 space-y-2">
          {rules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/builder"
          className={cn(buttonVariants({ size: "lg" }), "gap-2 bg-[var(--chocolate)] text-[var(--cream)]")}
        >
          Ir al builder
          <ArrowRight className="size-4" />
        </Link>
        <a
          href={JIRA_BOARD}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
        >
          Abrir Jira
          <ExternalLink className="size-4" />
        </a>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Más detalle técnico en{" "}
        <code className="rounded bg-muted px-1">TEAM_TASKS.md</code> y{" "}
        <code className="rounded bg-muted px-1">README.md</code> del repo.
      </p>
    </div>
  );
}
