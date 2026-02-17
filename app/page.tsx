import HeadsUpDisplay from "../components/heads-up-display";

export default function Home() {
  return (
    <main className="relative w-full">
      <HeadsUpDisplay />

      <div className="min-h-[400vh]">
        {/* Section 1 */}
        <section className="flex h-screen w-full items-center justify-center border-b border-white/5">
          <span className="font-mono text-sm tracking-widest text-white/20">
            001 // THE SOURCE
          </span>
        </section>

        {/* Section 2 */}
        <section className="flex h-screen w-full items-center justify-center border-b border-white/5">
          <span className="font-mono text-sm tracking-widest text-white/20">
            002 // THE CRUCIBLE
          </span>
        </section>

        {/* Section 3 */}
        <section className="flex h-screen w-full items-center justify-center border-b border-white/5">
          <span className="font-mono text-sm tracking-widest text-white/20">
            003 // THE MACHINE
          </span>
        </section>

        {/* Section 4 */}
        <section className="flex h-screen w-full items-center justify-center border-b border-white/5">
          <span className="font-mono text-sm tracking-widest text-white/20">
            004 // CONTACT
          </span>
        </section>
      </div>
    </main>
  );
}
