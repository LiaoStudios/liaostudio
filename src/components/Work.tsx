import { useMemo, useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import SectionHead from './SectionHead';
import { useProgetti, type UIProject } from '../hooks/useProgetti';
import type { CatKey } from '../data/projects';

const EASE = 'ease-[cubic-bezier(0.25,0.1,0.25,1)]';
type Filter = CatKey | 'all';

function Card({ p, catLabel }: { p: UIProject; catLabel: (k: string) => string }) {
  const live = !!p.url;
  const Shot = live ? 'a' : 'div';

  return (
    <article className="group">
      <Shot
        {...(live ? { href: p.url, target: '_blank', rel: 'noopener' } : {})}
        className="relative block aspect-[329/246] overflow-hidden rounded-2xl bg-gray-200 cursor-pointer"
      >
        <img
          src={`/work/${p.slug}.jpg`}
          alt={`Anteprima del sito realizzato per ${p.name}`}
          loading="lazy"
          className={`h-full w-full object-cover object-top transition-transform duration-[900ms] ${EASE} group-hover:scale-[1.04]`}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-wider text-gray-700">
          {catLabel(p.cat)}
        </span>

        {live && (
          /* pastiglia che si allarga al passaggio, come nel reference */
          <span
            className={`absolute bottom-4 left-4 flex h-9 items-center overflow-hidden rounded-full bg-[#0B1220] text-white transition-all duration-300 ease-in-out w-9 group-hover:w-[150px]`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center">
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-0 -rotate-45" />
            </span>
            <span className="whitespace-nowrap pr-4 text-[13px] font-medium opacity-0 transition-opacity duration-300 delay-100 group-hover:opacity-100">
              Visita il sito
            </span>
          </span>
        )}
      </Shot>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-[#0B1220]">{p.name}</h3>
        <span className="shrink-0 text-[11px] uppercase tracking-wider text-gray-400">{p.loc}</span>
      </div>
      <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{p.blurb}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <span key={t} className="rounded-full border border-gray-200 bg-white px-2.5 py-[3px] text-[11px] text-gray-600">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

const STEP = 6;

export default function Work() {
  const { projects, cats } = useProgetti();
  const catLabel = (k: string) => cats.find((c) => c.key === k)?.label ?? k;

  const [filter, setFilter] = useState<Filter>('all');
  const [limit, setLimit] = useState(STEP);

  const matching = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.cat === filter)),
    [filter, projects]
  );
  const shown = matching.slice(0, limit);
  const rest = matching.length - shown.length;

  const pick = (k: Filter) => { setFilter(k); setLimit(STEP); };

  const chips: { key: Filter; label: string; n: number }[] = [
    { key: 'all', label: 'Tutti', n: projects.length },
    ...cats.map((c) => ({ key: c.key as Filter, label: c.label, n: projects.filter((p) => p.cat === c.key).length })),
  ];

  return (
    <section id="lavori" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="px-5 sm:px-8 lg:px-12">
          <SectionHead n="2" label="Lavori selezionati">I nostri progetti</SectionHead>
        </div>

        <div className="px-5 sm:px-8 lg:px-12 mt-10 sm:mt-12">
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const on = filter === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(c.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 ${
                    on
                      ? 'border-[#0B1220] bg-[#0B1220] text-white'
                      : 'border-gray-300 bg-transparent text-gray-700 hover:border-[#0B1220] hover:text-[#0B1220]'
                  }`}
                >
                  {c.label}
                  <span className={`text-[11px] ${on ? 'text-white/55' : 'text-gray-400'}`}>{c.n}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-gray-400">
            {shown.length} di {matching.length} {matching.length === 1 ? 'progetto' : 'progetti'}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {shown.map((p) => <Card key={p.slug} p={p} catLabel={catLabel} />)}
          </div>

          {rest > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setLimit((n) => n + STEP)}
                className="group inline-flex items-center gap-2.5 rounded-full border border-gray-300 bg-white px-6 py-3 text-[14px] font-medium text-[#0B1220] transition-colors duration-300 hover:border-[#0B1220] hover:bg-[#0B1220] hover:text-white"
              >
                Mostra altri {Math.min(rest, STEP)}
                <Plus size={15} className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:rotate-90" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
