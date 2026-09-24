import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Home, Wallet, Users, Receipt } from 'lucide-react';

const bars = [10, 18, 13, 24, 16, 28];

function OverviewCard() {
  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Home} label="Overview" />
      <div className="mt-2.5 rounded-lg bg-white p-2">
        <div className="flex items-center justify-between">
          <span className="text-[7px] uppercase tracking-wide text-black/45">Total balance</span>
          <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-medium text-emerald-600">
            +4.2%
          </span>
        </div>
        <p className="mt-1 text-[13px] font-semibold text-ink">148,240.00</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-md border border-white/10 bg-white/[0.06] p-1.5">
          <Wallet className="h-2.5 w-2.5 text-white/50" />
          <p className="mt-1 text-[7px] text-white/45">Loans</p>
          <p className="text-[9px] font-medium text-white/85">12,000</p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.06] p-1.5">
          <Users className="h-2.5 w-2.5 text-white/50" />
          <p className="mt-1 text-[7px] text-white/45">Committees</p>
          <p className="text-[9px] font-medium text-white/85">3 active</p>
        </div>
      </div>
      <div className="mt-2 flex h-10 flex-1 items-end gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1.5">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            className="w-full rounded-sm bg-white/35"
            initial={{ height: 0 }}
            animate={{ height }}
            transition={{ duration: 0.6, delay: 0.15 + index * 0.06, ease: 'easeOut' }}
          />
        ))}
      </div>
    </div>
  );
}

function LoansCard() {
  const rows = [
    { name: 'Ahmed Raza', note: 'You lent', amount: '8,000', positive: true },
    { name: 'Sara Khan', note: 'You owe', amount: '4,200', positive: false },
  ];

  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Wallet} label="Loans" />
      <div className="mt-2.5 flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[7px] font-medium text-white/70">
                {row.name.charAt(0)}
              </div>
              <div>
                <p className="text-[8.5px] font-medium text-white/85">{row.name}</p>
                <p className="text-[7px] text-white/40">{row.note}</p>
              </div>
            </div>
            <span
              className={`text-[9px] font-medium ${row.positive ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {row.amount}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[7px] text-white/45">
        Repayment schedule stays up to date automatically.
      </div>
    </div>
  );
}

function CommitteesCard() {
  const rows = [
    { name: 'Family committee', progress: 60, note: '6 of 10 rounds' },
    { name: 'Office committee', progress: 30, note: '3 of 10 rounds' },
  ];

  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Users} label="Committees" />
      <div className="mt-2.5 flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.name} className="rounded-md border border-white/10 bg-white/[0.05] p-2">
            <div className="flex items-center justify-between">
              <p className="text-[8.5px] font-medium text-white/85">{row.name}</p>
              <p className="text-[7px] text-white/40">{row.note}</p>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-white/60"
                initial={{ width: 0 }}
                animate={{ width: `${row.progress}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillsCard() {
  const rows = [
    { name: 'Electricity bill', note: 'Split 3 ways', amount: '6,000' },
    { name: 'Internet', note: 'Split 3 ways', amount: '3,000' },
  ];

  return (
    <div className="flex h-full flex-col">
      <CardHeader icon={Receipt} label="This month" />
      <div className="mt-2.5 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5 text-[8px] text-white/70">
        You owe <span className="font-medium text-white/90">Bilal Rs 2,400</span>
      </div>
      <div className="mt-2 flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.05] px-2 py-1.5"
          >
            <div>
              <p className="text-[8.5px] font-medium text-white/85">{row.name}</p>
              <p className="text-[7px] text-white/40">{row.note}</p>
            </div>
            <span className="text-[9px] font-medium text-white/80">{row.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5 px-0.5">
      <Icon className="h-3 w-3 text-white/60" />
      <span className="text-[8px] font-semibold uppercase tracking-wide text-white/60">
        {label}
      </span>
    </div>
  );
}

const screens = [
  { Component: OverviewCard },
  { Component: LoansCard },
  { Component: CommitteesCard },
  { Component: BillsCard },
];

function PhoneScreen({ index }) {
  const ActiveCard = screens[index].Component;

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#101015] to-[#0a0a0d] p-3">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-medium text-white/50">9:41</span>
        <div className="flex items-center gap-0.5">
          <span className="h-1.5 w-0.5 rounded-full bg-white/40" />
          <span className="h-2 w-0.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-0.5 rounded-full bg-white/60" />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between px-0.5">
        <span className="text-[9px] font-semibold tracking-wide text-white/60">VAULTRIX</span>
        <div className="h-3 w-3 rounded-full bg-white/20" />
      </div>

      <div className="relative mt-3 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full text-[10px]"
          >
            <ActiveCard />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-1 pt-1.5">
        {screens.map((_, dotIndex) => (
          <span
            key={dotIndex}
            className={`h-1 rounded-full transition-all duration-300 ${
              dotIndex === index ? 'w-4 bg-white/70' : 'w-1 bg-white/25'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const callouts = [
  'Real-time balance across accounts',
  'See exactly who owes whom',
  'Follow every committee round',
  'Split any bill in seconds',
];

const SCREEN_DURATION = 2800;
const OPEN_MS = 7200;
const CLOSED_MS = 1100;

const STAGE_W = 660;
const STAGE_H = 560;
const PHONE_W = 248;
const PHONE_H = 424;
const PHONE_LEFT = (STAGE_W - PHONE_W) / 2;
const PHONE_TOP = 68;
const CENTER_X = STAGE_W / 2;
const CENTER_Y = PHONE_TOP + PHONE_H / 2;

const CARD_W = 176;
const CARD_H = 152;
const GAP = 16;
const RIGHT_EDGE = PHONE_LEFT + PHONE_W + GAP;
const LEFT_EDGE = PHONE_LEFT - GAP - CARD_W;

// How far each page is swung open, in degrees. Right pages open wider than left ones.
const RIGHT_TURN = 20;
const LEFT_TURN = 16;

const TOOLTIP_TOP = 74;

function PageShell({ title, meta, children }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-gradient-to-br from-white to-[#e8e8ec] p-3.5 text-ink shadow-[0_22px_46px_-14px_rgba(0,0,0,0.75)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink/70">{title}</span>
        {meta && <span className="text-[10px] text-ink/45">{meta}</span>}
      </div>
      {children}
    </div>
  );
}

function LoansPage() {
  const rows = [
    { name: 'Ahmed Raza', note: 'You lent', amount: '8,000', tone: 'text-emerald-700' },
    { name: 'Sara Khan', note: 'You owe', amount: '4,200', tone: 'text-amber-700' },
  ];

  return (
    <PageShell title="Loans" meta="2 open">
      <div className="mt-3 flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-white">
                {row.name.charAt(0)}
              </span>
              <div>
                <p className="whitespace-nowrap text-[11.5px] font-medium leading-tight">{row.name}</p>
                <p className="text-[10px] text-ink/45">{row.note}</p>
              </div>
            </div>
            <span className={`text-[12.5px] font-semibold tabular-nums ${row.tone}`}>{row.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-ink/10 pt-2 text-[11px]">
        <span className="text-ink/50">Net position</span>
        <span className="font-semibold tabular-nums">+3,800</span>
      </div>
    </PageShell>
  );
}

function CommitteePage() {
  return (
    <PageShell title="Committee" meta="Round 6 of 10">
      <p className="mt-3 text-[14px] font-semibold leading-tight">Family committee</p>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div className="h-full w-[60%] rounded-full bg-ink" />
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="text-ink/50">Paid so far</span>
        <span className="font-semibold tabular-nums">60,000</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px]">
        <span className="text-ink/50">Next payout</span>
        <span className="font-medium">12 Nov, Hina</span>
      </div>
    </PageShell>
  );
}

function RentPage() {
  return (
    <PageShell title="Rent, split 3 ways">
      <p className="mt-2.5 text-[10.5px] text-ink/50">Your share</p>
      <p className="text-[23px] font-semibold leading-tight tabular-nums">15,000</p>
      <div className="mt-2.5 flex items-center justify-between text-[11px]">
        <span className="text-ink/50">Base rent</span>
        <span className="font-medium tabular-nums">12,000</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px]">
        <span className="text-ink/50">Utilities</span>
        <span className="font-medium tabular-nums">3,000</span>
      </div>
    </PageShell>
  );
}

function SalaryPage() {
  return (
    <PageShell title="Salary, September">
      <div className="mt-3 flex items-center justify-between text-[11.5px]">
        <span className="text-ink/50">Gross</span>
        <span className="font-medium tabular-nums">150,000</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11.5px]">
        <span className="text-ink/50">Tax</span>
        <span className="font-medium tabular-nums text-amber-700">-12,500</span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-2 text-[13px]">
        <span className="font-medium">Net</span>
        <span className="font-semibold tabular-nums">137,500</span>
      </div>
      <p className="mt-2 whitespace-nowrap text-[10.5px] text-ink/45">Fixed expenses 62,000</p>
    </PageShell>
  );
}

const pages = [
  { side: 'left', top: 110, tilt: 0, Page: LoansPage },
  { side: 'right', top: 200, tilt: 0, Page: CommitteePage },
  { side: 'left', top: 306, tilt: 0, Page: RentPage },
  { side: 'right', top: 376, tilt: 0, Page: SalaryPage },
];

const SHRUNK = 0.3;

function pageVariants(reduce) {
  return {
    hidden: (c) => ({
      x: c.hiddenX,
      y: c.hiddenY,
      scale: SHRUNK,
      opacity: 0,
      rotateY: 0,
      rotateZ: 0,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: c.outDelay },
    }),
    show: (c) => ({
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotateY: c.turn,
      rotateZ: c.tilt,
      transition: reduce
        ? { duration: 0 }
        : {
            duration: 1.05,
            ease: [0.22, 1, 0.36, 1],
            delay: c.inDelay,
            opacity: { duration: 0.4, delay: c.inDelay },
          },
    }),
  };
}

function FlyingPage({ config, order, open, reduce, variants }) {
  const { side, top, tilt, Page } = config;
  const isRight = side === 'right';
  const left = isRight ? RIGHT_EDGE : LEFT_EDGE;
  const originX = isRight ? 0 : 1;

  const custom = {
    hiddenX: CENTER_X - left - originX * CARD_W - (0.5 - originX) * CARD_W * SHRUNK,
    hiddenY: CENTER_Y - top - CARD_H / 2,
    turn: isRight ? -RIGHT_TURN : LEFT_TURN,
    tilt,
    inDelay: order * 0.16,
    outDelay: (pages.length - 1 - order) * 0.07,
  };

  return (
    <motion.div
      className="absolute z-30"
      style={{ left, top, width: CARD_W, height: CARD_H, originX, originY: 0.5 }}
      variants={variants}
      custom={custom}
      initial={reduce ? 'show' : 'hidden'}
      animate={open ? 'show' : 'hidden'}
    >
      <motion.div
        className="h-full w-full"
        animate={reduce ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 4 + order * 0.7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Page />
      </motion.div>
    </motion.div>
  );
}

function Callout({ index }) {
  return (
    <>
      <span
        className="absolute left-full z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.18)]"
        style={{ top: TOOLTIP_TOP }}
      />
      <div
        className="pointer-events-none absolute left-full z-20 flex -translate-y-1/2 items-center"
        style={{ top: TOOLTIP_TOP }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="flex items-center"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <span className="h-px w-7 bg-white/35" />
            <p className="w-[148px] rounded-lg border border-white/15 bg-white/[0.07] px-3 py-2 text-[12px] leading-snug text-white">
              {callouts[index]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function useFitScale(ref) {
  const [scale, setScale] = useState(0.8);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min(1, width / STAGE_W, height / STAGE_H));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return scale;
}

function AuthVisual() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const scale = useFitScale(wrapRef);
  const variants = pageVariants(reduce);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % screens.length);
    }, SCREEN_DURATION);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reduce) {
      setOpen(true);
      return undefined;
    }

    let timer;
    const step = (next) => {
      setOpen(next);
      timer = setTimeout(() => step(!next), next ? OPEN_MS : CLOSED_MS);
    };
    timer = setTimeout(() => step(true), 500);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <div ref={wrapRef} className="relative min-h-[420px] flex-1">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          perspective: 1800,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <motion.div
          className="absolute z-10"
          style={{ left: PHONE_LEFT, top: PHONE_TOP, width: PHONE_W, height: PHONE_H }}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: [0, -6, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        >
          <motion.div
            className="absolute inset-0 -z-10 rounded-[3rem] bg-white/[0.08] blur-2xl"
            animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative h-full w-full rounded-[3rem] border-[3px] border-[#48484f] bg-gradient-to-b from-[#2c2c31] to-[#19191c] p-[3px] shadow-2xl">
            <span className="absolute -left-[3px] top-[68px] h-4 w-[3px] rounded-l-sm bg-[#5a5a62]" />
            <span className="absolute -left-[3px] top-[92px] h-9 w-[3px] rounded-l-sm bg-[#5a5a62]" />
            <span className="absolute -left-[3px] top-[132px] h-9 w-[3px] rounded-l-sm bg-[#5a5a62]" />
            <span className="absolute -right-[3px] top-[100px] h-12 w-[3px] rounded-r-sm bg-[#5a5a62]" />

            <div className="relative h-full w-full overflow-hidden rounded-[2.7rem] border border-black/60 bg-black">
              <div className="absolute left-1/2 top-2 z-30 flex h-[18px] w-[64px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
              </div>

              <div className="relative z-0 h-full w-full overflow-hidden rounded-[2.4rem]">
                <PhoneScreen index={index} />
              </div>
            </div>
          </div>

          <Callout index={index} />
        </motion.div>

        {pages.map((config, order) => (
          <FlyingPage
            key={config.Page.name}
            config={config}
            order={order}
            open={open}
            reduce={reduce}
            variants={variants}
          />
        ))}
      </div>
    </div>
  );
}

export default AuthVisual;
