import { MagicEightBall } from "@/components/magic-eight-ball";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="stars" aria-hidden="true" />
      <header className="masthead">
        <p className="eyebrow">A small instrument of probability</p>
        <h1>The Jev Oracle</h1>
        <p className="intro">
          Ask a yes-or-no question. Jev weighs the twenty classic signs and
          reveals the strongest one.
        </p>
      </header>

      <MagicEightBall />

      <footer>
        <span className="status-dot" aria-hidden="true" />
        Powered by TypeSafe System One · For entertainment, not prophecy
      </footer>
    </main>
  );
}
