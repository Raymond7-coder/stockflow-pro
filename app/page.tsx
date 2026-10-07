"use client";

import {
  Bell,
  TrendingUp,
  Users,
  Settings,
} from "lucide-react";

const investors = [
  {
    name: "Sammy",
    deposit: 800000,
    balance: 975000,
    growth: 175000,
    growthPercent: 21.88,
    depositDate: "1st September 2026",
    stocks: ["Nvidia", "Apple", "Tesla", "Meta"],
  },
  {
    name: "Judith",
    deposit: 600000,
    balance: 698000,
    growth: 98000,
    growthPercent: 16.33,
    depositDate: "10th September 2026",
    stocks: ["Microsoft", "Amazon", "MTN Nigeria", "Airtel Africa"],
  },
  {
    name: "Christy",
    deposit: 1800000,
    balance: 2900000,
    growth: 1100000,
    growthPercent: 61.11,
    depositDate: "15th August 2026",
    stocks: ["Seplat Energy", "Dangote Cement", "Zenith Bank", "GTCO"],
  },
  {
    name: "ND",
    deposit: 500000,
    balance: 527500,
    growth: 27500,
    growthPercent: 5.5,
    depositDate: "5th October 2026",
    stocks: ["FBN Holdings", "Access Bank", "BUA Foods", "Transcorp"],
  },
  {
    name: "Udochi",
    deposit: 300000,
    balance: 450800,
    growth: 150800,
    growthPercent: 50.27,
    depositDate: "5th September 2026",
    stocks: ["Stanbic IBTC", "Netflix", "AMD", "Conoil"],
  },
];

const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;

export default function Home() {
  const totalPortfolio = investors.reduce(
    (sum, investor) => sum + investor.balance,
    0
  );

  const totalDeposits = investors.reduce(
    (sum, investor) => sum + investor.deposit,
    0
  );

  const totalGrowth = totalPortfolio - totalDeposits;

  const totalGrowthPercent = (
    (totalGrowth / totalDeposits) *
    100
  ).toFixed(2);

  return (
    <main className="min-h-screen bg-[#081426] text-white">

      <nav className="border-b border-[#1b2b43] bg-[#0e1c30]">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-6">

          <div className="flex items-center gap-8">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold">
                SF
              </div>

              <span className="font-semibold">
                StockFlow Pro
              </span>
            </div>

            <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
              <span className="text-white">Dashboard</span>
              <span>Accounts</span>
              <span>Stock History</span>
              <span>Withdrawals</span>
              <span>Settings</span>
            </div>

          </div>

          <div className="flex items-center gap-5">
            <Bell size={18} className="text-slate-400" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500">
              S
            </div>
          </div>

        </div>
      </nav>

      <div className="mx-auto max-w-[1500px] space-y-7 p-6">

        <section className="rounded-xl border border-[#173253] bg-gradient-to-br from-[#10233c] to-[#0d1d33] p-6">

          <div className="mb-6 flex items-start justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Live • Market Open
              </div>

              <h1 className="text-2xl font-bold">
                StockFlow Pro
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Live Investment Portfolio Dashboard — real-time stock tracking
                & performance reporting
              </p>
            </div>

            <div className="rounded-xl border border-emerald-900 bg-emerald-950/30 px-5 py-3 text-center">
              <Users className="mx-auto mb-1 text-emerald-400" size={18} />
              <p className="text-xs text-slate-400">Investors</p>
              <p className="font-bold">{investors.length}</p>
            </div>

          </div>

          <div className="grid gap-4 md:grid-cols-4">

            <StatCard
              label="Total Portfolio Value"
              value={formatNaira(totalPortfolio)}
              sub="Across all investments"
            />

            <StatCard
              label="Total Initial Deposits"
              value={formatNaira(totalDeposits)}
              sub="Combined investor capital"
            />

            <StatCard
              label="Net Portfolio Growth"
              value={`+${formatNaira(totalGrowth)}`}
              sub={`+${totalGrowthPercent}% overall return`}
              green
            />

            <StatCard
              label="Active Investors"
              value={investors.length.toString()}
              sub="All portfolios performing"
            />

          </div>
        </section>

        <section>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Active Portfolios
              </h2>

              <p className="text-xs text-slate-500">
                {investors.length} live investor accounts
              </p>
            </div>

            <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs text-emerald-400">
              ● All accounts active
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {investors.map((investor) => (
              <InvestorCard
                key={investor.name}
                investor={investor}
              />
            ))}

          </div>

        </section>

      </div>

    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
  green,
}: {
  label: string;
  value: string;
  sub: string;
  green?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#172b45] bg-[#0c1a2e] p-5">

      <p className="mb-2 text-xs text-slate-400">
        {label}
      </p>

      <p
        className={`text-xl font-bold ${
          green ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {sub}
      </p>

    </div>
  );
}

function InvestorCard({
  investor,
}: {
  investor: (typeof investors)[0];
}) {
  return (
    <div className="rounded-xl border border-[#1d304a] bg-[#11223a] p-5">

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {investor.name}
        </h3>

        <Settings
          size={16}
          className="text-slate-500"
        />
      </div>

      <div className="mt-5">

        <p className="text-2xl font-bold">
          {formatNaira(investor.balance)}
        </p>

        <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
          <TrendingUp size={14} />

          +{formatNaira(investor.growth)}
          {" "}
          (+{investor.growthPercent}%)
        </p>

        <p className="mt-2 text-xs text-emerald-400">
          Status: Increasing
        </p>

      </div>

      <div className="mt-6 flex h-24 items-end gap-1 rounded-lg bg-gradient-to-b from-[#102944] to-[#0d2036] p-3">

        {[25, 32, 39, 48, 55, 61, 69, 76, 82, 89].map(
          (height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-emerald-500/50"
              style={{ height: `${height}%` }}
            />
          )
        )}

      </div>

      <div className="mt-5">

        <p className="text-xs text-slate-500">
          Initial Deposit
        </p>

        <p className="mt-1 text-sm font-semibold">
          {formatNaira(investor.deposit)}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {investor.depositDate}
        </p>

      </div>

      <div className="mt-4">

        <p className="mb-2 text-xs text-slate-500">
          Active Stocks
        </p>

        <div className="flex flex-wrap gap-2">

          {investor.stocks.map((stock) => (
            <span
              key={stock}
              className="rounded-full bg-[#203957] px-2 py-1 text-[10px] text-slate-300"
            >
              {stock}
            </span>
          ))}

        </div>

      </div>

      <button
        disabled
        className="mt-5 w-full cursor-default rounded-lg bg-blue-500 py-2 text-sm font-medium text-white"
      >
        Withdraw
      </button>

    </div>
  );
}