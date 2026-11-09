import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Radar,
  ScanSearch,
  BookOpenCheck,
  Radio,
  Columns3,
  Sparkles,
  FileText,
  Crosshair,
  Check,
  ChevronRight,
} from "lucide-react";
import { AccountActions } from "./account-actions";
import "./marketing.css";
import { LandingMotion } from "./landing-motion";
const features = [
  {
    icon: ScanSearch,
    title: "Go deeper than a search result.",
    text: "Build research around your business, objectives and public source URLs. Keep the context alongside the findings.",
    label: "01 / RESEARCH",
    wide: true,
  },
  {
    icon: BookOpenCheck,
    title: "Evidence within reach.",
    text: "Inspect quoted sources and verification labels. Separate what a source says from strategic interpretation.",
    label: "02 / EVIDENCE",
  },
  {
    icon: Columns3,
    title: "See the differences.",
    text: "Compare competitors side by side and explore SWOT findings and opportunities.",
    label: "03 / COMPARISONS",
  },
  {
    icon: Radio,
    title: "Keep a pulse on change.",
    text: "Monitor public websites, review snapshots and set alert rules for the signals you care about.",
    label: "04 / MONITORING",
  },
  {
    icon: Sparkles,
    title: "Ask your research a better question.",
    text: "Explore saved research with the AI copilot, then turn findings into reports you can share.",
    label: "05 / AI COPILOT",
  },
];
function Brand() {
  return (
    <Link href="/" className="rs-brand">
      <Radar aria-hidden="true" />
      RivalScope<span>AI</span>
    </Link>
  );
}
function Dashboard() {
  return (
    <figure
      className="rs-console"
      aria-label="Example RivalScope research workspace with illustrative findings"
    >
      <div className="rs-console-bar">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>RivalScope / Research workspace</span>
        <span className="rs-demo-label">EXAMPLE DASHBOARD</span>
      </div>
      <div className="rs-console-body">
        <aside className="rs-console-side">
          <div>
            <Radar size={20} /> Intelligence
          </div>
          {[
            { icon: ScanSearch, label: "Research" },
            { icon: Crosshair, label: "Competitors" },
            { icon: Columns3, label: "Comparisons" },
            { icon: Radio, label: "Monitoring" },
            { icon: Sparkles, label: "AI copilot" },
          ].map(({ icon: Icon, label }) => (
            <span key={label}>
              <Icon size={16} />
              {label}
            </span>
          ))}
          <small>
            YOUR MARKET.
            <br />
            IN FOCUS.
          </small>
        </aside>
        <div className="rs-console-main">
          <div className="rs-console-heading">
            <div>
              <span className="rs-kicker">PROJECT / EXAMPLE MARKET</span>
              <h2>From signals to strategy.</h2>
            </div>
            <span className="rs-pill">
              <Check size={12} /> Research complete
            </span>
          </div>
          <div className="rs-metrics">
            {[
              ["Research", "Source-backed"],
              ["Landscape", "Competitor profiles"],
              ["Next move", "Opportunities"],
            ].map(([a, b]) => (
              <div key={a}>
                <span>{a}</span>
                <strong>{b}</strong>
              </div>
            ))}
          </div>
          <div className="rs-findings">
            <div className="rs-finding-title">
              <BookOpenCheck size={17} /> Evidence & findings{" "}
              <span>Illustrative content</span>
            </div>
            <article>
              <div>
                <span className="rs-pill">POSITIONING</span>
                <BookOpenCheck size={16} />
              </div>
              <h3>Understand the story behind the offering.</h3>
              <p>
                Review a competitor’s public messaging alongside the source
                material.
              </p>
              <span className="rs-source">
                <span>↗</span> Example source · Product page{" "}
                <ChevronRight size={14} />
              </span>
            </article>
            <article>
              <div>
                <span className="rs-pill">STRATEGIC INTERPRETATION</span>
                <Sparkles size={16} />
              </div>
              <h3>Turn observations into questions worth exploring.</h3>
              <p>
                Use the evidence to examine potential gaps in your own
                positioning.
              </p>
            </article>
          </div>
        </div>
      </div>
      <figcaption>
        Example workspace · Sample content, not actual research results.
      </figcaption>
    </figure>
  );
}
export function Marketing() {
  return (
    <div className="rs-landing">
      <LandingMotion />
      <a className="rs-skip" href="#rs-main">
        Skip to content
      </a>
      <header className="rs-header">
        <nav className="rs-nav" aria-label="Main navigation">
          <Brand />
          <div className="rs-nav-links">
            <a href="#features">Platform</a>
            <a href="#workflow">How it works</a>
            <a href="#questions">FAQ</a>
          </div>
          <div className="rs-nav-actions">
            <Link href="/login">Login</Link>
            <Link className="rs-button rs-button-small" href="/register">
              Get started <ArrowUpRight size={15} />
            </Link>
          </div>
        </nav>
      </header>
      <Suspense>
        <AccountActions />
      </Suspense>
      <main id="rs-main">
        <section className="rs-hero">
          <div className="rs-hero-grid" aria-hidden="true" />
          <div className="rs-radar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span />
            <span />
          </div>
          <div className="rs-hero-copy">
            <span className="rs-kicker">
              <span className="rs-signal" /> YOUR MARKET DOESN’T STAND STILL
            </span>
            <h1>
              See the signals.
              <br />
              <span>Make your next move.</span>
            </h1>
            <p>
              Turn public competitor information into evidence-backed
              intelligence. Research the landscape, understand what’s changing,
              and find your edge.
            </p>
            <div className="rs-actions">
              <Link className="rs-button" href="/register">
                Build your intelligence workspace <ArrowRight size={17} />
              </Link>
              <a className="rs-secondary" href="#showcase">
                Explore the platform <ArrowUpRight size={16} />
              </a>
            </div>
            <span className="rs-hero-note">
              Research. Compare. Monitor. All in one workspace.
            </span>
          </div>
          <div id="showcase" className="rs-dashboard-wrap">
            <Dashboard />
          </div>
        </section>
        <div className="rs-capabilities">
          <span>ONE CONNECTED INTELLIGENCE WORKFLOW</span>
          <div>
            <span>
              <ScanSearch />
              Research
            </span>
            <span>
              <Columns3 />
              Comparisons
            </span>
            <span>
              <Radio />
              Monitoring
            </span>
            <span>
              <Sparkles />
              AI copilot
            </span>
            <span>
              <FileText />
              Reports
            </span>
          </div>
        </div>
        <section id="features" className="rs-section">
          <div className="rs-section-heading">
            <span className="rs-kicker">THE INTELLIGENCE LAYER</span>
            <h2>
              Less scattered information.
              <br />
              <span>More strategic clarity.</span>
            </h2>
            <p>
              Keep the question, the evidence and the next decision connected.
            </p>
          </div>
          <div className="rs-bento">
            {features.map((f) => (
              <article
                className={`rs-feature ${f.wide ? "rs-wide" : ""}`}
                key={f.title}
              >
                <div className="rs-feature-top">
                  <f.icon size={25} />
                  <span>{f.label}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                {f.label.startsWith("01") && (
                  <div className="rs-mini-flow">
                    <span>Public sources</span>
                    <ArrowRight size={16} />
                    <span>Quoted evidence</span>
                    <ArrowRight size={16} />
                    <span>Clearer decisions</span>
                  </div>
                )}
                {f.label.startsWith("05") && (
                  <div className="rs-prompt">
                    <Sparkles size={18} />
                    <span>What should we explore next?</span>
                    <ArrowUpRight size={18} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
        <ProductShowcase />
        <section id="workflow" className="rs-section rs-workflow">
          <div className="rs-section-heading">
            <span className="rs-kicker">FROM QUESTION TO PERSPECTIVE</span>
            <h2>
              A sharper workflow.
              <br />
              <span>At every step.</span>
            </h2>
          </div>
          <div className="rs-steps">
            {[
              [
                "Define your landscape",
                "Create a project with your business context and research objectives. Add public source URLs or use web discovery.",
              ],
              [
                "Follow the evidence",
                "Review findings, competitor profiles and comparisons. Inspect the sources behind the research.",
              ],
              [
                "Stay close to the market",
                "Set up website monitoring, explore saved research with the copilot, and share reports with your team.",
              ],
            ].map(([title, text], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="rs-section rs-personas">
          <span className="rs-kicker">BUILT AROUND YOUR NEXT DECISION</span>
          <h2>
            Different roles.
            <br />A shared view of the market.
          </h2>
          <div>
            {[
              [
                "Founders & strategy teams",
                "Explore your competitive landscape before deciding where to focus.",
              ],
              [
                "Product & marketing teams",
                "Compare positioning and offerings with the evidence close at hand.",
              ],
              [
                "Research & intelligence teams",
                "Organize findings, monitor changes and share the work behind your thinking.",
              ],
            ].map(([a, b]) => (
              <article key={a}>
                <ArrowUpRight />
                <h3>{a}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="questions" className="rs-section rs-faq">
          <div>
            <span className="rs-kicker">A LITTLE MORE CLARITY</span>
            <h2>
              Good questions.
              <br />
              Straight answers.
            </h2>
          </div>
          <div>
            {[
              [
                "Where does the research come from?",
                "Research uses public sources, including URLs you provide and web discovery. Findings include evidence and verification labels for review.",
              ],
              [
                "Can I keep track of website changes?",
                "Yes. Website monitoring includes snapshots and alert rules so you can review changes over time.",
              ],
              [
                "Can I work with my team?",
                "RivalScope includes organization workspaces, team roles, collaboration and shareable reports.",
              ],
              [
                "Does AI replace my judgment?",
                "No. Treat AI-generated analysis as input to your decision. Inspect the quoted evidence and distinguish observations from strategic interpretations.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronRight size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="rs-final">
          <div className="rs-final-orbit" aria-hidden="true">
            <Radar />
          </div>
          <span className="rs-kicker">YOUR NEXT MOVE STARTS HERE</span>
          <h2>
            Clarity is a<br />
            <span>competitive advantage.</span>
          </h2>
          <p>Bring your market into focus with RivalScope.</p>
          <Link className="rs-button" href="/register">
            Get started <ArrowRight size={17} />
          </Link>
        </section>
      </main>
      <footer className="rs-footer">
        <div>
          <Brand />
          <p>Evidence first. Perspective that moves you forward.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#features">Platform</a>
          <a href="#workflow">How it works</a>
          <Link href="/login">Login</Link>
          <Link href="/register">
            Get started <ArrowUpRight size={14} />
          </Link>
        </nav>
        <span>RivalScope AI · Competitive intelligence</span>
      </footer>
    </div>
  );
}
function ProductShowcase() {
  return (
    <section className="rs-section rs-showcase">
      <div className="rs-section-heading">
        <span className="rs-kicker">A CLOSER LOOK AT THE WORKSPACE</span>
        <h2>
          See the landscape.
          <br />
          <span>Then watch it evolve.</span>
        </h2>
        <p>
          Move between comparisons and website monitoring without losing the
          research context.
        </p>
      </div>
      <div className="rs-screen-grid">
        <figure>
          <figcaption>
            <Columns3 size={18} />
            <strong>Comparison matrix</strong>
            <span>EXAMPLE VIEW</span>
          </figcaption>
          <div
            className="rs-matrix"
            role="table"
            aria-label="Illustrative competitor comparison"
          >
            <div role="row">
              <span role="columnheader">Research area</span>
              <span role="columnheader">Example A</span>
              <span role="columnheader">Example B</span>
            </div>
            {[
              ["Product offering", "Documented", "Documented"],
              ["Feature evidence", "Source linked", "Source linked"],
              ["Published pricing", "Review source", "Not observed"],
            ].map((row) => (
              <div role="row" key={row[0]}>
                {row.map((cell, i) => (
                  <span role="cell" key={i}>
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <p>
            Compare offerings, documented features and published pricing with
            sources attached.
          </p>
        </figure>
        <figure>
          <figcaption>
            <Radio size={18} />
            <strong>Website monitoring</strong>
            <span>EXAMPLE VIEW</span>
          </figcaption>
          <div className="rs-monitor-url">
            <span className="rs-signal" /> example.com / product{" "}
            <span>Public page</span>
          </div>
          <div className="rs-monitor-diff">
            <span>Snapshot comparison</span>
            <div>
              <span>−</span> Previous page content
            </div>
            <div>
              <span>+</span> Updated page content
            </div>
          </div>
          <p>Review saved website snapshots and the changes between them.</p>
        </figure>
      </div>
      <span className="rs-sample-caption">
        Illustrative screens and sample content. Not actual competitor data.
      </span>
    </section>
  );
}
