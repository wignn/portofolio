<div class="rule-caption">
  <span>02 — ABOUT</span><span>THE PERSON BEHIND THE CODE</span>
</div>
<section id="about" class="about-section">
  <div class="about-copy">
    <div class="eyebrow">SOFTWARE DEVELOPER / TECHNICAL ARCHITECT</div>
    <h2>The code.<br /><em>The bigger picture.</em></h2>
    <p class="about-statement">
      I work on both sides of software:<br />how it’s structured and how
      it’s built.
    </p>
    <p>
      My projects span real-time market data, reading platforms, and Discord
      tools. Their repositories show the service boundaries, data paths, and
      implementations behind the interfaces.
    </p>
    <div class="focus-row">
      <span>01</span>
      <div>
        <h3>Architecture in practice</h3>
        <p>Service boundaries, communication, and data flow.</p>
      </div>
    </div>
    <div class="focus-row">
      <span>02</span>
      <div>
        <h3>Implementation in code</h3>
        <p>Backend services and the interfaces around them.</p>
      </div>
    </div>
    <div class="tech-stack">
      <span class="eyebrow">LANGUAGES IN PUBLIC REPOSITORIES</span>
      <div id="tech-stack">
        <span>Rust</span><span>TypeScript</span><span>Go</span><span>Dart</span>
      </div>
    </div>
  </div>
  <figure class="architecture-example">
    <div class="panel-label">
      <span>ARCHITECTURE IN PRACTICE</span><span>NOVELHIVE</span>
    </div>
    <h3>One platform.<br />Distinct responsibilities.</h3>
    <div
      class="service-diagram"
      role="img"
      aria-label="Simplified NovelHive architecture: a Go API gateway communicates over gRPC with user, novel, content, and search services. Shared infrastructure includes PostgreSQL, Redis, and Elasticsearch."
    >
      <div class="gateway-node">
        <span>ENTRY POINT</span><strong>API Gateway</strong><small>Go / REST</small>
      </div>
      <div class="diagram-trunk"><span>gRPC</span></div>
      <div class="service-nodes">
        <div><strong>User</strong><span>Go</span></div>
        <div><strong>Novel</strong><span>Go</span></div>
        <div><strong>Content</strong><span>Rust</span></div>
        <div><strong>Search</strong><span>Rust</span></div>
      </div>
      <div class="infra-label">SHARED INFRASTRUCTURE</div>
      <div class="infra-nodes">
        <span>PostgreSQL</span><span>Redis</span><span>Elasticsearch</span>
      </div>
    </div>
    <figcaption>
      Simplified from the project README.<a
        href="https://github.com/wignn/nhive#architecture"
        target="_blank"
        rel="noopener">Explore the architecture ↗</a
      >
    </figcaption>
  </figure>
</section>
