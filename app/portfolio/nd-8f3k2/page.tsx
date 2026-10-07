"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CircleDollarSign,
  Clock3,
  Eye,
  LineChart as LineChartIcon,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* =========================================================
   ND PORTFOLIO SETTINGS

   MOST OF THE TIME YOU ONLY EDIT:
   1. lastUpdated
   2. portfolioHistory

   Everything else calculates automatically.
   ========================================================= */

const portfolio = {
  name: "ND",

  initialDeposit: 500000,

  depositDate: "5th October 2026",

  lastUpdated: "7th October 2026, 1:12 PM",

  holdings: [
    "FBN Holdings",
    "Access Bank",
    "BUA Foods",
    "Transcorp",
  ],
};

/* =========================================================
   PORTFOLIO HISTORY

   TO UPDATE ND:

   Add a new object at the bottom.

   Example:

   {
     time: "2:30 PM",
     fullTime: "7 Oct 2026 • 2:30 PM",
     balance: 565000,
   },

   THAT'S IT.

   Green/red chart movements and calculations happen
   automatically.
   ========================================================= */

const portfolioHistory = [
  {
    time: "5 Oct",
    fullTime: "5 Oct 2026 • 7:45 PM",
    balance: 500000,
  },
  {
    time: "6 Oct",
    fullTime: "6 Oct 2026 • 4:30 PM",
    balance: 527500,
  },
  {
    time: "9:15 AM",
    fullTime: "7 Oct 2026 • 9:15 AM",
    balance: 547900,
  },
  {
    time: "10:40 AM",
    fullTime: "7 Oct 2026 • 10:40 AM",
    balance: 527600,
  },
  {
    time: "11:52 AM",
    fullTime: "7 Oct 2026 • 11:52 AM",
    balance: 550654,
  },
  {
  time: "1:15 PM",
  fullTime: "7 Oct 2026 • 1:13 PM",
  balance: 578654,
},
];

/* =========================================================
   DO NOT EDIT BELOW UNLESS CHANGING DESIGN
   ========================================================= */

const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;

const latestPoint =
  portfolioHistory[portfolioHistory.length - 1];

const previousPoint =
  portfolioHistory.length > 1
    ? portfolioHistory[portfolioHistory.length - 2]
    : latestPoint;

const currentBalance = latestPoint.balance;

const netGrowth =
  currentBalance - portfolio.initialDeposit;

const growthPercent =
  (netGrowth / portfolio.initialDeposit) * 100;

const currentMovement =
  currentBalance - previousPoint.balance;

const currentMovementPositive =
  currentMovement >= 0;

/* =========================================================
   DYNAMIC RED / GREEN CHART SEGMENTS

   Every movement gets its own line automatically.
   ========================================================= */

const segments = portfolioHistory
  .slice(0, -1)
  .map((item, index) => {
    const next = portfolioHistory[index + 1];

    return {
      key: `segment${index}`,
      positive:
        next.balance >= item.balance,
    };
  });

const chartData = portfolioHistory.map(
  (item, pointIndex) => {
    const row: Record<string, string | number | null> = {
      ...item,
    };

    segments.forEach((segment, segmentIndex) => {
      if (
        pointIndex === segmentIndex ||
        pointIndex === segmentIndex + 1
      ) {
        row[segment.key] = item.balance;
      } else {
        row[segment.key] = null;
      }
    });

    return row;
  }
);

/* =========================================================
   DYNAMIC ACTIVITY

   Generated directly from portfolioHistory.
   ========================================================= */

const recentActivity = [
  ...portfolioHistory
    .slice(1)
    .map((item, index) => {
      const previous =
        portfolioHistory[index];

      const difference =
        item.balance - previous.balance;

      return {
        title:
          difference >= 0
            ? "Portfolio Value Updated"
            : "Portfolio Adjustment",

        description:
          difference >= 0
            ? "Portfolio value increased"
            : "Portfolio value decreased",

        date: item.fullTime,

        amount: Math.abs(difference),

        type:
          difference >= 0
            ? "gain"
            : "loss",
      };
    })
    .reverse(),

  {
    title: "Opening Deposit",
    description: "Portfolio funded",
    date: portfolioHistory[0].fullTime,
    amount: portfolio.initialDeposit,
    type: "deposit",
  },
];

export default function NDPortfolioPage() {
  const [showNotice, setShowNotice] =
    useState(false);

  useEffect(() => {
    const noticeSeen =
      localStorage.getItem(
        "nd-portfolio-notice-seen"
      );

    if (!noticeSeen) {
      setShowNotice(true);
    }
  }, []);

  const closeNotice = () => {
    localStorage.setItem(
      "nd-portfolio-notice-seen",
      "true"
    );

    setShowNotice(false);
  };

  const openNotice = () => {
    setShowNotice(true);
  };

  const minChartValue = useMemo(() => {
    const minimum = Math.min(
      ...portfolioHistory.map(
        (item) => item.balance
      )
    );

    return (
      Math.floor(
        (minimum - 10000) / 10000
      ) * 10000
    );
  }, []);

  const maxChartValue = useMemo(() => {
    const maximum = Math.max(
      ...portfolioHistory.map(
        (item) => item.balance
      )
    );

    return (
      Math.ceil(
        (maximum + 10000) / 10000
      ) * 10000
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#071426] text-white">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-[#172a42] bg-[#0b1a2e]/95 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold shadow-lg shadow-blue-500/20">
              SF
            </div>

            <div>
              <h1 className="text-sm font-semibold sm:text-base">
                StockFlow Pro
              </h1>

              <p className="text-[10px] text-slate-500 sm:text-[11px]">
                Investor Portfolio
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={openNotice}
              className="hidden items-center gap-2 text-xs text-slate-400 transition hover:text-white sm:flex"
            >
              <Eye size={14} />

              Viewing Notice
            </button>

            <div className="flex items-center gap-2 rounded-full border border-emerald-900/70 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-400">

              <ShieldCheck size={14} />

              Read Only
            </div>

          </div>

        </div>

      </header>

      <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-6">

        {/* WELCOME */}
        <section className="mb-7">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <p className="text-sm text-slate-400">
                Welcome back,
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                {portfolio.name}
              </h2>

              <div className="mt-4 flex items-center gap-3">

                <div className="relative flex h-3 w-3">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />

                </div>

                <span className="text-sm font-medium text-emerald-400">
                  Portfolio Active
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Active monitoring view • Last updated{" "}
                {portfolio.lastUpdated}
              </p>

            </div>

            {/* CURRENT MOVEMENT */}
            <div className="w-fit rounded-xl border border-[#1d3958] bg-[#10223a] px-5 py-4">

              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                Current Movement
              </p>

              <div
                className={`mt-2 flex items-center gap-2 ${
                  currentMovementPositive
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >

                {currentMovementPositive ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )}

                <span className="text-lg font-bold">

                  {currentMovementPositive
                    ? "+"
                    : "-"}

                  {formatNaira(
                    Math.abs(
                      currentMovement
                    )
                  )}

                </span>

              </div>

            </div>

          </div>

        </section>

        {/* SUMMARY */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            icon={<Wallet size={18} />}
            label="Portfolio Value"
            value={formatNaira(
              currentBalance
            )}
          />

          <SummaryCard
            icon={
              <CircleDollarSign
                size={18}
              />
            }
            label="Initial Investment"
            value={formatNaira(
              portfolio.initialDeposit
            )}
          />

          <SummaryCard
            icon={<TrendingUp size={18} />}
            label="Net Growth"
            value={`${netGrowth >= 0 ? "+" : "-"}${formatNaira(
              Math.abs(netGrowth)
            )}`}
            positive={netGrowth >= 0}
            negative={netGrowth < 0}
          />

          <SummaryCard
            icon={
              <LineChartIcon size={18} />
            }
            label="Return"
            value={`${growthPercent >= 0 ? "+" : ""}${growthPercent.toFixed(
              2
            )}%`}
            positive={
              growthPercent >= 0
            }
            negative={
              growthPercent < 0
            }
          />

        </section>

        {/* CHART + DETAILS */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_0.9fr]">

          {/* PERFORMANCE */}
          <div className="rounded-2xl border border-[#1c3049] bg-[#102139] p-5 shadow-xl shadow-black/10 sm:p-6">

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">

              <div>

                <h3 className="text-lg font-semibold">
                  Portfolio Performance
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Recorded portfolio movement since initial investment
                </p>

              </div>

              <div className="sm:text-right">

                <p className="text-xs text-slate-500">
                  Current Return
                </p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    growthPercent >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {growthPercent >= 0
                    ? "+"
                    : ""}

                  {growthPercent.toFixed(
                    2
                  )}
                  %
                </p>

              </div>

            </div>

            <div className="h-[330px] w-full sm:h-[360px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    bottom: 8,
                    left: 8,
                  }}
                >

                  <defs>

                    <linearGradient
                      id="portfolioArea"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#10b981"
                        stopOpacity={
                          0.2
                        }
                      />

                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    stroke="#1c334e"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[
                      minChartValue,
                      maxChartValue,
                    ]}
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(
                      value
                    ) =>
                      `₦${Math.round(
                        value /
                          1000
                      )}k`
                    }
                  />

                  <Tooltip
                    content={
                      <CustomTooltip />
                    }
                    cursor={{
                      stroke:
                        "#475569",
                      strokeDasharray:
                        "4 4",
                    }}
                  />

                  {/* BACKGROUND AREA */}
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="none"
                    fill="url(#portfolioArea)"
                  />

                  {/* AUTOMATIC GREEN / RED SEGMENTS */}
                  {segments.map(
                    (segment) => (

                      <Line
                        key={
                          segment.key
                        }
                        type="linear"
                        dataKey={
                          segment.key
                        }
                        stroke={
                          segment.positive
                            ? "#10b981"
                            : "#ef4444"
                        }
                        strokeWidth={
                          3
                        }
                        dot={
                          false
                        }
                        connectNulls={
                          false
                        }
                        isAnimationActive={
                          true
                        }
                      />

                    )
                  )}

                  {/* AUTOMATIC POINTS */}
                  {portfolioHistory.map(
                    (
                      item,
                      index
                    ) => {

                      if (
                        index ===
                        0
                      ) {
                        return (
                          <ReferenceDot
                            key={
                              item.fullTime
                            }
                            x={
                              item.time
                            }
                            y={
                              item.balance
                            }
                            r={
                              4
                            }
                            fill="#3b82f6"
                            stroke="#bfdbfe"
                            strokeWidth={
                              1
                            }
                          />
                        );
                      }

                      const previous =
                        portfolioHistory[
                          index -
                            1
                        ];

                      const positive =
                        item.balance >=
                        previous.balance;

                      const isLatest =
                        index ===
                        portfolioHistory.length -
                          1;

                      return (
                        <ReferenceDot
                          key={
                            item.fullTime
                          }
                          x={
                            item.time
                          }
                          y={
                            item.balance
                          }
                          r={
                            isLatest
                              ? 7
                              : 5
                          }
                          fill={
                            positive
                              ? "#10b981"
                              : "#ef4444"
                          }
                          stroke={
                            positive
                              ? "#d1fae5"
                              : "#fecaca"
                          }
                          strokeWidth={
                            isLatest
                              ? 3
                              : 2
                          }
                        />
                      );
                    }
                  )}

                </ComposedChart>

              </ResponsiveContainer>

            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-[#1c3049] pt-4 text-xs">

              <div className="flex items-center gap-2 text-emerald-400">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                Increase
              </div>

              <div className="flex items-center gap-2 text-red-400">

                <span className="h-2 w-2 rounded-full bg-red-400" />

                Decrease
              </div>

              <div className="text-slate-500">
                Hover over the chart for details
              </div>

            </div>

          </div>

          {/* DETAILS */}
          <div className="rounded-2xl border border-[#1c3049] bg-[#102139] p-5 shadow-xl shadow-black/10 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold">
                  Portfolio Details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Current account overview
                </p>

              </div>

              <Activity
                size={18}
                className="text-blue-400"
              />

            </div>

            <div className="mt-6 space-y-5">

              <InfoRow
                label="Initial Deposit"
                value={formatNaira(
                  portfolio.initialDeposit
                )}
              />

              <InfoRow
                label="Deposit Date"
                value={
                  portfolio.depositDate
                }
              />

              <InfoRow
                label="Current Balance"
                value={formatNaira(
                  currentBalance
                )}
              />

              <InfoRow
                label="Net Growth"
                value={`${netGrowth >= 0 ? "+" : "-"}${formatNaira(
                  Math.abs(
                    netGrowth
                  )
                )}`}
                positive={
                  netGrowth >= 0
                }
                negative={
                  netGrowth < 0
                }
              />

              <InfoRow
                label="Return"
                value={`${growthPercent >= 0 ? "+" : ""}${growthPercent.toFixed(
                  2
                )}%`}
                positive={
                  growthPercent >=
                  0
                }
                negative={
                  growthPercent <
                  0
                }
              />

              <InfoRow
                label="Portfolio Status"
                value={
                  currentMovement >
                  0
                    ? "Increasing"
                    : currentMovement <
                      0
                    ? "Decreasing"
                    : "Stable"
                }
                positive={
                  currentMovement >
                  0
                }
                negative={
                  currentMovement <
                  0
                }
              />

            </div>

            <div className="mt-8">

              <p className="mb-3 text-xs uppercase tracking-[0.12em] text-slate-500">
                Active Holdings
              </p>

              <div className="flex flex-wrap gap-2">

                {portfolio.holdings.map(
                  (
                    holding
                  ) => (

                    <span
                      key={
                        holding
                      }
                      className="rounded-full border border-[#2a4767] bg-[#18324f] px-3 py-1.5 text-xs text-slate-300"
                    >
                      {
                        holding
                      }
                    </span>

                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* MOVEMENT HISTORY */}
        <section className="mt-6 rounded-2xl border border-[#1c3049] bg-[#102139] p-5 shadow-xl shadow-black/10 sm:p-6">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>

              <h3 className="text-lg font-semibold">
                Recent Portfolio Movement
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Latest recorded changes in portfolio value
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <Clock3
                size={14}
              />

              Updated{" "}
              {
                portfolio.lastUpdated
              }

            </div>

          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {portfolioHistory
              .slice(1)
              .map(
                (
                  item,
                  index
                ) => {

                  const absoluteIndex =
                    index +
                    1;

                  const previous =
                    portfolioHistory[
                      absoluteIndex -
                        1
                    ];

                  const difference =
                    item.balance -
                    previous.balance;

                  const positive =
                    difference >=
                    0;

                  return (
                    <div
                      key={
                        item.fullTime
                      }
                      className="rounded-xl border border-[#1b3551] bg-[#0c1c31] p-4 transition hover:border-[#2b4d70]"
                    >

                      <p className="text-xs text-slate-500">
                        {
                          item.time
                        }
                      </p>

                      <p className="mt-2 text-xl font-bold">
                        {formatNaira(
                          item.balance
                        )}
                      </p>

                      <div
                        className={`mt-3 flex items-center gap-1 text-xs font-medium ${
                          positive
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >

                        {positive ? (
                          <TrendingUp
                            size={
                              14
                            }
                          />
                        ) : (
                          <TrendingDown
                            size={
                              14
                            }
                          />
                        )}

                        {positive
                          ? "+"
                          : "-"}

                        {formatNaira(
                          Math.abs(
                            difference
                          )
                        )}

                      </div>

                    </div>
                  );
                }
              )}

          </div>

        </section>

        {/* ACTIVITY */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-[#1c3049] bg-[#102139] p-5 shadow-xl shadow-black/10 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold">
                  Recent Activity
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Latest portfolio records
                </p>

              </div>

              <Bell
                size={18}
                className="text-slate-500"
              />

            </div>

            <div className="mt-5 space-y-3">

              {recentActivity.map(
                (
                  activity,
                  index
                ) => (

                  <div
                    key={`${activity.date}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#1b3551] bg-[#0c1c31] p-4"
                  >

                    <div className="min-w-0">

                      <p className="text-sm font-medium">
                        {
                          activity.title
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          activity.description
                        }
                      </p>

                      <p className="mt-1 text-[11px] text-slate-600">
                        {
                          activity.date
                        }
                      </p>

                    </div>

                    <div
                      className={`shrink-0 text-sm font-semibold ${
                        activity.type ===
                        "loss"
                          ? "text-red-400"
                          : activity.type ===
                            "gain"
                          ? "text-emerald-400"
                          : "text-blue-400"
                      }`}
                    >

                      {activity.type ===
                      "loss"
                        ? "-"
                        : "+"}

                      {formatNaira(
                        activity.amount
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* WITHDRAWALS */}
          <div className="rounded-2xl border border-[#1c3049] bg-[#102139] p-5 shadow-xl shadow-black/10 sm:p-6">

            <div>

              <h3 className="text-lg font-semibold">
                Withdrawal History
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Recorded portfolio withdrawals
              </p>

            </div>

            <div className="flex min-h-[330px] flex-col items-center justify-center text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400">

                <Wallet
                  size={22}
                />

              </div>

              <p className="mt-5 font-semibold">
                No Withdrawals Yet
              </p>

              <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-500">
                There are currently no withdrawals recorded on this portfolio.
              </p>

            </div>

          </div>

        </section>

        {/* NOTICE */}
        <section className="mt-6 rounded-xl border border-[#172c44] bg-[#0b1a2d] px-5 py-4">

          <div className="flex items-start gap-3">

            <ShieldCheck
              size={16}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              This is a read-only monitoring view. Portfolio values and
              account records shown here are for viewing purposes only.
              Transactions cannot be initiated from this page.
            </p>

          </div>

        </section>

      </div>

      {/* POPUP */}
      {showNotice && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">

          <div className="relative w-full max-w-md rounded-2xl border border-[#284460] bg-[#10213a] p-7 shadow-2xl shadow-black/40">

            <button
              onClick={
                closeNotice
              }
              className="absolute right-4 top-4 text-slate-500 transition hover:text-white"
            >

              <X size={18} />

            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">

              <ShieldCheck
                size={24}
              />

            </div>

            <h2 className="mt-5 text-xl font-bold">
              Portfolio Monitoring View
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              This dashboard provides a read-only view of your portfolio
              performance, recorded account activity and investment history.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Account information cannot be edited and transactions cannot
              be initiated from this page.
            </p>

            <button
              onClick={
                closeNotice
              }
              className="mt-6 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Continue to Dashboard
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  positive,
  negative,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#1c3049] bg-[#102139] p-5 shadow-xl shadow-black/10">

      <div className="flex items-center gap-2 text-slate-500">

        {icon}

        <p className="text-sm">
          {label}
        </p>

      </div>

      <p
        className={`mt-4 text-2xl font-bold tracking-tight ${
          positive
            ? "text-emerald-400"
            : negative
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

function InfoRow({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#1b314a] pb-4">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`text-right text-sm font-medium ${
          positive
            ? "text-emerald-400"
            : negative
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const item =
    payload[0]?.payload;

  if (!item) {
    return null;
  }

  const index =
    portfolioHistory.findIndex(
      (history) =>
        history.fullTime ===
        item.fullTime
    );

  const previous =
    index > 0
      ? portfolioHistory[
          index - 1
        ].balance
      : item.balance;

  const movement =
    item.balance - previous;

  return (
    <div className="rounded-xl border border-[#294663] bg-[#09182a] px-4 py-3 shadow-2xl">

      <p className="text-xs text-slate-500">
        {item.fullTime}
      </p>

      <p className="mt-2 text-base font-semibold text-white">
        {formatNaira(
          item.balance
        )}
      </p>

      {index > 0 && (

        <p
          className={`mt-1 text-xs ${
            movement >= 0
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >

          {movement >= 0
            ? "+"
            : "-"}

          {formatNaira(
            Math.abs(movement)
          )}

          {" from previous update"}

        </p>

      )}

    </div>
  );
}