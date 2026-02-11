import { useEffect, useState } from 'react';
import './App.css';

const NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const CASE_STUDIES = [
  {
    id: 'onboarding',
    title: 'Streamlining onboarding for a SaaS dashboard',
    tags: ['Onboarding', 'UX Flows', 'Activation'],
    problem:
      'New users were dropping off after account creation because the product threw them into an empty dashboard with no guidance.',
    process: [
      'Mapped the first-time journey from sign-up to first value and identified friction points.',
      'Ran five remote usability sessions to understand expectations and confusion moments.',
      'Prototyped a guided checklist that gradually introduced key features instead of a single long setup form.',
    ],
    outcome:
      'Shipped a multi-step onboarding with contextual education, simple progress tracking and clear next steps.',
    metrics:
      '27% lift in week‑1 activation and a 35% reduction in setup-related support tickets over six weeks.',
  },
  {
    id: 'field-reporting',
    title: 'Redesigning an issue reporting flow for field teams',
    tags: ['Service UX', 'Mobile', 'Efficiency'],
    problem:
      'Field agents needed to log issues quickly on mobile, but the existing flow forced them through a long, desktop‑designed form.',
    process: [
      'Shadowed agents during two shifts to capture real-world constraints and workarounds.',
      'Simplified the information architecture into a three-step, thumb-friendly flow focused on essentials.',
      'Introduced inline photo capture and offline draft saving for low-connectivity scenarios.',
    ],
    outcome:
      'Launched a streamlined, mobile-first reporting experience embedded directly into the agents’ existing workflow.',
    metrics:
      'Median report time dropped from ~3 minutes to under 90 seconds and completion rate increased by 22%.',
  },
];

function SectionTitle({ label, id, eyebrow }) {
  return (
    <div className="mb-6 space-y-1">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-400">
          {eyebrow}
        </p>
      )}
      <div className="flex items-center gap-3">
        <div className="h-px w-10 bg-brand-500" />
        <h2
          id={id}
          className="text-sm font-semibold tracking-[0.25em] text-coolGray uppercase"
        >
          {label}
        </h2>
      </div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-coolGray/40 bg-slate-900/70 px-3 py-1 text-xs font-medium text-offWhite shadow-sm">
      {children}
    </span>
  );
}

function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');
  const [activeSkillTab, setActiveSkillTab] = useState('product'); // product | ux | tools
  const [view, setView] = useState('home'); // home | case
  const [activeCaseStudyId, setActiveCaseStudyId] = useState('onboarding');
  const [activeSection, setActiveSection] = useState('work');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Smooth-scroll navbar navigation
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 80; // account for sticky navbar
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleNavClick = (id) => {
    setView('home');
    scrollToSection(id);
  };

  // Active section highlight using IntersectionObserver
  useEffect(() => {
    if (view !== 'home') {
      return;
    }

    const sectionIds = ['work', 'process', 'skills', 'about', 'education', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: '-80px 0px -40% 0px',
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [view]);

  const activeCaseStudy =
    CASE_STUDIES.find((cs) => cs.id === activeCaseStudyId) ?? CASE_STUDIES[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-charcoal to-slate-950 text-offWhite">
      {/* Sticky navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-charcoal/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <button
            type="button"
            onClick={() => {
              setView('home');
              scrollToSection('top');
            }}
            className="text-sm font-semibold tracking-[0.25em] uppercase text-offWhite"
          >
            Kashish <span className="text-brand-500">Soni</span>
          </button>
          <nav className="hidden items-center gap-6 text-xs font-medium text-coolGray md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors ${
                  activeSection === item.id
                    ? 'text-brand-500'
                    : 'hover:text-brand-500'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNavClick('work')}
              className="inline-flex items-center rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-offWhite shadow-sm shadow-brand-500/30 transition hover:-translate-y-0.5 hover:bg-brand-600"
            >
              View Case Studies
            </button>
          </nav>
        </div>
      </header>

      {view === 'home' && (
        <>
          {/* Hero */}
          <section
            id="top"
            className="border-b border-slate-800 bg-gradient-to-b from-slate-950/80 via-charcoal/80 to-slate-950/80"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-400">
              UX · Product · Strategy
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              KASHISH <span className="text-brand-400">SONI</span>
            </h1>
            <p className="max-w-xl text-base text-slate-200">
              I help teams turn vague problem statements into tested product
              experiences – connecting user needs, business goals and thoughtful
              interaction design.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <Chip>Based in Damoh, Madhya Pradesh</Chip>
              <Chip>B.Tech · Computer Science</Chip>
              <Chip>Aspiring UX / Product Practitioner</Chip>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 text-sm">
              <a
                href="#contact"
                className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 font-semibold text-slate-950 shadow-lg shadow-brand-500/30 transition hover:-translate-y-0.5 hover:bg-brand-600"
              >
                Let&apos;s collaborate
              </a>
              <a
                href="#work"
                className="inline-flex items-center rounded-full border border-slate-700 px-5 py-2.5 text-offWhite hover:border-brand-500 hover:text-brand-400"
              >
                View case studies
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid w-full max-w-sm grid-cols-2 gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-xs text-slate-300 shadow-lg md:max-w-xs">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Focus
              </p>
              <p className="mt-1 font-semibold text-offWhite">
                Product discovery &amp; UX flows
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Hands‑on
              </p>
              <p className="mt-1 font-semibold text-offWhite">
                UX research &amp; prototyping
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Strength
              </p>
              <p className="mt-1 font-semibold text-offWhite">
                Explaining complex journeys clearly
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Mindset
              </p>
              <p className="mt-1 font-semibold text-offWhite">
                Curious, structured, user‑centric
              </p>
            </div>
          </div>
            </div>
          </section>

          {/* Main content stream */}
          <main className="mx-auto max-w-5xl px-4 py-12 space-y-16 md:py-16 lg:py-20">
          {/* Profile */}
          <section id="about">
            <SectionTitle label="About Me" id="about" eyebrow="Profile" />
            <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg text-sm text-slate-300 md:grid-cols-2">
              <div className="space-y-3">
            <p className="text-sm text-slate-300">
              I&apos;m a product‑minded problem solver who enjoys mapping messy
              user journeys, prioritising what really matters, and collaborating
              with designers and engineers to ship thoughtful experiences.
            </p>
            <p className="text-sm text-slate-300">
              My work leans heavily on clear storytelling – framing problems,
              choosing the right research method, prototyping quickly, and using
              metrics to validate whether a solution actually improved the
              experience.
            </p>
            </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Strengths
                </p>
                <ul className="space-y-2">
                  <li>• Translating complex journeys into clear, visual flows.</li>
                  <li>• Asking simple questions that uncover hidden assumptions.</li>
                  <li>• Keeping user stories and metrics connected.</li>
                  <li>• Communicating in a calm, concise and structured way.</li>
                </ul>
              </div>
            </div>
          </section>
          {/* Selected Work */}
          <section id="work">
            <SectionTitle
              label="Selected Work"
              id="work"
              eyebrow="Case studies"
            />
            <div className="space-y-6">
              {CASE_STUDIES.map((study) => (
                <article
                  key={study.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg transition hover:-translate-y-1 hover:border-brand-500/70 hover:shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-offWhite">
                      {study.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {study.tags.map((tag) => (
                        <Chip key={tag}>{tag}</Chip>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    <span className="font-semibold">Problem.</span> {study.problem}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCaseStudyId(study.id);
                      setView('case');
                    }}
                    className="mt-4 inline-flex items-center text-sm font-medium text-brand-400 transition group-hover:translate-x-0.5 group-hover:text-brand-300"
                  >
                    View Case Study
                    <span aria-hidden="true" className="ml-1">
                      →
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Skills (with tabs) */}
          <section id="skills">
            <SectionTitle
              label="Skills &amp; Tools"
              id="skills"
              eyebrow="Toolbox I work with"
            />
            <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
              <div className="flex flex-wrap gap-2 rounded-full bg-slate-950/70 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSkillTab('product')}
                  className={`flex-1 rounded-full px-3 py-1 font-medium transition ${
                    activeSkillTab === 'product'
                      ? 'bg-brand-500 text-offWhite'
                      : 'text-slate-300 hover:text-brand-400'
                  }`}
                >
                  Product
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSkillTab('ux')}
                  className={`flex-1 rounded-full px-3 py-1 font-medium transition ${
                    activeSkillTab === 'ux'
                      ? 'bg-brand-500 text-offWhite'
                      : 'text-slate-300 hover:text-brand-400'
                  }`}
                >
                  UX / Research
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSkillTab('tools')}
                  className={`flex-1 rounded-full px-3 py-1 font-medium transition ${
                    activeSkillTab === 'tools'
                      ? 'bg-brand-500 text-offWhite'
                      : 'text-slate-300 hover:text-brand-400'
                  }`}
                >
                  Tools
                </button>
              </div>

              {activeSkillTab === 'product' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-offWhite">
                      Product Thinking
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Problem framing, opportunity sizing, defining success
                      metrics, crafting hypotheses and translating them into
                      testable product slices.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-offWhite">
                      Collaboration &amp; Delivery
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Working closely with design, engineering and stakeholders,
                      writing clear specs, and breaking work into iterative,
                      shippable milestones.
                    </p>
                  </div>
                </div>
              )}

              {activeSkillTab === 'ux' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-offWhite">
                      UX &amp; Research
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      User interviews, surveys, journey mapping, task flows,
                      usability testing, heuristic reviews and insight synthesis.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-offWhite">
                      Design &amp; Communication
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Wireframing, low‑fidelity prototyping, documenting flows,
                      and presenting stories in a way that keeps users at the
                      centre of every decision.
                    </p>
                  </div>
                </div>
              )}

              {activeSkillTab === 'tools' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Comfortable working with a mix of collaboration, design and
                    analytics tools – and happy to adapt to a team&apos;s
                    existing stack.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Chip>Figma</Chip>
                    <Chip>Miro</Chip>
                    <Chip>Notion</Chip>
                    <Chip>FigJam</Chip>
                    <Chip>Google Analytics</Chip>
                    <Chip>Surveys &amp; Forms</Chip>
                    <Chip>Usability Testing</Chip>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Tools &amp; methods
                </p>
              </div>
            </div>

            {/* Technical Skills – Cloud / DevOps */}
            <div className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-offWhite">
                Technical Skills
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Cloud (AWS)
                  </p>
                  <p className="mt-1">
                    EC2, S3, EBS, IAM, VPC, CloudWatch, ALB, Auto Scaling, NAT Gateway,
                    Route 53 (Basic), Lambda.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    DevOps &amp; IaC
                  </p>
                  <p className="mt-1">
                    Git, GitHub, GitLab, Terraform, Open Tofu, CI/CD, Jenkins, GitHub
                    Actions, AWS CLI.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Networking &amp; Security
                  </p>
                  <p className="mt-1">
                    Subnets, Route Tables, IGW, NAT, Security Groups, NACLs, IAM
                    Policies.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    OS &amp; Monitoring
                  </p>
                  <p className="mt-1">
                    Linux (Ubuntu, Amazon Linux), CloudWatch Logs &amp; Alarms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Product / UX Process */}
          <section id="process">
            <SectionTitle
              label="Product Process"
              id="process"
              eyebrow="How I approach case studies"
            />
            <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg text-sm text-slate-300">
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  'Discover',
                  'Define',
                  'Explore',
                  'Build',
                  'Learn',
                ].map((label, index) => (
                  <div key={label} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-brand-400 shadow">
                        {`0${index + 1}`}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                        {label}
                      </span>
                    </div>
                    <div className="h-px w-full bg-slate-800 md:block" />
                  </div>
                ))}
              </div>
              <ol className="space-y-3">
                <li>
                  <span className="font-semibold text-brand-400">Discover.</span>{' '}
                  Clarify the problem, understand constraints, review existing
                  data and talk to users or internal partners.
                </li>
                <li>
                  <span className="font-semibold text-brand-400">Define.</span>{' '}
                  Shape clear problem statements, success metrics and guardrails
                  for scope.
                </li>
                <li>
                  <span className="font-semibold text-brand-400">Explore.</span>{' '}
                  Sketch flows and variants, align with engineering and design,
                  and pick the smallest meaningful experiment.
                </li>
                <li>
                  <span className="font-semibold text-brand-400">Build.</span>{' '}
                  Support implementation with clear specs, edge cases and
                  definitions of done.
                </li>
                <li>
                  <span className="font-semibold text-brand-400">Learn.</span>{' '}
                  Measure outcomes, reflect on what worked, and document next
                  steps so the story is easy to follow.
                </li>
              </ol>
            </div>
          </section>

          {/* Case studies */}
          <section>
            <SectionTitle
              label="Case Studies"
              id="projects"
              eyebrow="Selected work stories"
            />
            <div className="space-y-6">
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-offWhite">
                    Streamlining onboarding for a SaaS dashboard
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Chip>Onboarding</Chip>
                    <Chip>UX Flows</Chip>
                    <Chip>Activation</Chip>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>
                    <span className="font-semibold">Problem.</span> New users
                    were dropping off after account creation because the product
                    threw them into an empty dashboard with no guidance.
                  </li>
                  <li>
                    <span className="font-semibold">Process.</span> Mapped the
                    first‑time journey, ran 5 remote usability sessions, and
                    prototyped a guided checklist that gradually introduced key
                    features instead of a single long setup form.
                  </li>
                  <li>
                    <span className="font-semibold">Outcome.</span> Shipped a
                    multi‑step onboarding with contextual education and simple
                    progress tracking.
                  </li>
                  <li>
                    <span className="font-semibold">Metrics.</span> 27% lift in
                    week‑1 activation and a 35% reduction in support tickets
                    related to setup questions (measured over 6 weeks).
                  </li>
                </ul>
              </article>

              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-offWhite">
                    Redesigning an issue reporting flow for field teams
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Chip>Service UX</Chip>
                    <Chip>Mobile</Chip>
                    <Chip>Efficiency</Chip>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>
                    <span className="font-semibold">Problem.</span> Field agents
                    needed to log issues quickly on mobile, but the existing
                    flow forced them through a long, desktop‑designed form.
                  </li>
                  <li>
                    <span className="font-semibold">Process.</span> Shadowed
                    agents during two shifts, captured pain points, and tested a
                    simplified, step‑by‑step reporting flow optimised for thumb
                    use and low connectivity.
                  </li>
                  <li>
                    <span className="font-semibold">Outcome.</span> Introduced
                    a three‑step wizard with smart defaults, inline photo
                    capture and offline draft saving.
                  </li>
                  <li>
                    <span className="font-semibold">Metrics.</span> Median
                    report time dropped from ~3 minutes to under 90 seconds, and
                    completion rate increased by 22%.
                  </li>
                </ul>
              </article>
            </div>
          </section>

          {/* Services / How I can help */}
          <section>
            <SectionTitle
              label="How I Can Help"
              id="services"
              eyebrow="Where I add value"
            />
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg text-sm text-slate-300 space-y-3">
              <p>
                I&apos;m especially interested in early‑stage or growing teams
                where I can own slices of the product, craft clear stories and
                help the team stay close to real user problems.
              </p>
              <ul className="mt-1 space-y-2">
                <li>
                  • Turning high‑level ideas into structured problem statements,
                  user journeys and prioritised backlogs.
                </li>
                <li>
                  • Facilitating lightweight discovery and research to de‑risk
                  decisions before heavy build.
                </li>
                <li>
                  • Creating clear specs, flows and prototypes that align design
                  and engineering.
                </li>
                <li>
                  • Defining success metrics and simple dashboards that keep the
                  team focused on outcomes instead of only output.
                </li>
              </ul>
            </div>
          </section>

          {/* Education */}
          <section id="education">
            <SectionTitle
              label="Education"
              id="education"
              eyebrow="Academic background"
            />
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg space-y-3 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-offWhite">
                  B.Tech in Computer Science Engineering
                </p>
                <p className="text-slate-300">
                  Eklavya University, Damoh, Madhya Pradesh
                </p>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <p className="font-semibold text-offWhite">
                  Higher Secondary (12th – MP Board)
                </p>
                <p>Year: 2022 · Percentage: 75%</p>
              </div>
            </div>
          </section>

          {/* Contact form */}
          <section>
            <SectionTitle label="Contact" id="contact" />
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
              <p className="text-sm text-slate-300">
                I&apos;m actively interested in opportunities where thoughtful
                UX, clear product thinking and strong collaboration can make a
                meaningful difference. Feel free to reach out if you&apos;d like
                to walk through these case studies in more detail.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a
                  href="mailto:kashishsoni142005@gmail.com"
                  className="inline-flex items-center rounded-full bg-brand-500 px-4 py-2 font-semibold text-slate-950 shadow-md shadow-brand-500/30 transition hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  Email me
                </a>
                <a
                  href="https://www.linkedin.com/in/kashish-soni-18a82a6"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 font-semibold text-offWhite hover:border-brand-400 hover:text-brand-300"
                >
                  View LinkedIn
                </a>
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="text-xs font-medium text-slate-300"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-offWhite outline-none ring-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium text-slate-300"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-offWhite outline-none ring-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="text-xs font-medium text-slate-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-offWhite outline-none ring-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-500/30 transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send Message'}
                  </button>
                  {status === 'success' && (
                    <p className="text-xs text-emerald-400">
                      Message sent successfully!
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-xs text-red-400">
                      {error || 'Something went wrong.'}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </section>
        </main>
        </>
      )}

      {view === 'case' && activeCaseStudy && (
        <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <button
            type="button"
            onClick={() => {
              setView('home');
              scrollToSection('work');
            }}
            className="mb-6 inline-flex items-center text-xs font-medium text-coolGray hover:text-brand-500"
          >
            ← Back to selected work
          </button>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg space-y-6">
            <header className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-400">
                Case Study
              </p>
              <h1 className="text-2xl font-semibold text-offWhite md:text-3xl">
                {activeCaseStudy.title}
              </h1>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeCaseStudy.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </header>

            <section className="grid gap-6 text-sm text-slate-300 md:grid-cols-2">
              <div className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-coolGray">
                  Problem &amp; context
                </h2>
                <p>{activeCaseStudy.problem}</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-coolGray">
                  Role
                </h2>
                <p>
                  UX / Product practitioner collaborating with design,
                  engineering and stakeholders to bring clarity and structure to
                  the solution.
                </p>
              </div>
            </section>

            <section className="space-y-3 text-sm text-slate-300">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-coolGray">
                Process
              </h2>
              <ul className="space-y-2">
                {activeCaseStudy.process.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </section>

            <section className="grid gap-6 text-sm text-slate-300 md:grid-cols-2">
              <div className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-coolGray">
                  Solution
                </h2>
                <p>{activeCaseStudy.outcome}</p>
              </div>
              <div className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-coolGray">
                  Outcomes &amp; metrics
                </h2>
                <p>{activeCaseStudy.metrics}</p>
              </div>
            </section>
          </article>
        </main>
      )}
    </div>
  );
}

export default App;
