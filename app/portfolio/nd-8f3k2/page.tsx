"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CircleDollarSign,
  Clock3,
  Eye,
  LineChart as LineChartIcon,
  PlusCircle,
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
   ========================================================= */

const portfolio = {
  name: "ND",

  openingDeposit: 500000,

  openingDepositDate: "5th October 2026",

  additionalInvestments: [
    {
      amount: 500000,
      date: "7th October 2026",
      fullTime: "7 Oct 2026 • 8:45 PM",
    },
  ],

  lastUpdated: "9th October 2026, 2:45 AM",

  allocation: [
    {
      name: "African Equities",
      percent: 30,
    },
    {
      name: "Fixed Income / Treasury Instruments",
      percent: 20,
    },
    {
      name: "Energy & Commodities",
      percent: 15,
    },
    {
      name: "Real Estate / REIT Exposure",
      percent: 15,
    },
    {
      name: "Digital Assets",
      percent: 10,
    },
    {
      name: "Cash / Liquidity Reserve",
      percent: 10,
    },
  ],
};

/* =========================================================
   PORTFOLIO HISTORY

   IMPORTANT:

   capitalAdded tells the system that part of a balance
   increase came from NEW MONEY and is NOT profit.

   Example:

   Previous balance: ₦558,000
   New capital:      ₦500,000
   New balance:      ₦1,080,000

   Actual movement:
   ₦1,080,000 - ₦558,000 - ₦500,000
   = +₦22,000 performance
   ========================================================= */

const portfolioHistory = [
  {
    time: "5 Oct",
    fullTime: "5 Oct 2026 • 7:45 PM",
    balance: 500000,
    capitalAdded: 500000,
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
  {
    time: "1:27 PM",
    fullTime: "7 Oct 2026 • 1:27 PM",
    balance: 558000,
  },
  {
    time: "8:45 PM",
    fullTime: "7 Oct 2026 • 8:45 PM",
    balance: 1080000,
    capitalAdded: 500000,
  },
  {
  time: "9 Oct",
  fullTime: "9 Oct 2026 • 2:45 AM",
  balance: 1225000,
},
];

/* =========================================================
   DO NOT EDIT BELOW UNLESS CHANGING THE DESIGN
   ========================================================= */

const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;

const totalAdditionalInvestment =
  portfolio.additionalInvestments.reduce(
    (total, investment) =>
      total + investment.amount,
    0
  );

const totalInvested =
  portfolio.openingDeposit +
  totalAdditionalInvestment;

const latestPoint =
  portfolioHistory[
    portfolioHistory.length - 1
  ];

const currentBalance =
  latestPoint.balance;

const netGrowth =
  currentBalance - totalInvested;

const growthPercent =
  totalInvested > 0
    ? (netGrowth / totalInvested) * 100
    : 0;

/* =========================================================
   TRUE PERFORMANCE MOVEMENT

   Removes any new deposits from the movement calculation.
   ========================================================= */

const getPerformanceMovement = (
  index: number
) => {
  if (index <= 0) return 0;

  const current =
    portfolioHistory[index];

  const previous =
    portfolioHistory[index - 1];

  const capitalAdded =
    current.capitalAdded ?? 0;

  return (
    current.balance -
    previous.balance -
    capitalAdded
  );
};

const currentMovement =
  getPerformanceMovement(
    portfolioHistory.length - 1
  );

const currentMovementPositive =
  currentMovement >= 0;

/* =========================================================
   DYNAMIC CHART SEGMENTS
   ========================================================= */

const segments = portfolioHistory
  .slice(0, -1)
  .map((item, index) => {
    const performanceMovement =
      getPerformanceMovement(index + 1);

    return {
      key: `segment${index}`,
      positive:
        performanceMovement >= 0,
    };
  });

const chartData = portfolioHistory.map(
  (item, pointIndex) => {
    const row: Record<
      string,
      string | number | null | undefined
    > = {
      ...item,
    };

    segments.forEach(
      (segment, segmentIndex) => {
        if (
          pointIndex === segmentIndex ||
          pointIndex ===
            segmentIndex + 1
        ) {
          row[segment.key] =
            item.balance;
        } else {
          row[segment.key] = null;
        }
      }
    );

    return row;
  }
);

/* =========================================================
   DYNAMIC ACTIVITY
   ========================================================= */

const movementActivity =
  portfolioHistory
    .slice(1)
    .flatMap((item, index) => {
      const absoluteIndex =
        index + 1;

      const movement =
        getPerformanceMovement(
          absoluteIndex
        );

      const capitalAdded =
        item.capitalAdded ?? 0;

      const records: {
        title: string;
        description: string;
        date: string;
        amount: number;
        type: string;
      }[] = [];

      if (movement !== 0) {
        records.push({
          title:
            movement >= 0
              ? "Portfolio Value Updated"
              : "Portfolio Adjustment",

          description:
            movement >= 0
              ? "Investment performance increased"
              : "Investment performance decreased",

          date: item.fullTime,

          amount:
            Math.abs(movement),

          type:
            movement >= 0
              ? "gain"
              : "loss",
        });
      }

      if (capitalAdded > 0) {
        records.push({
          title:
            "Additional Investment",

          description:
            "New capital added to portfolio",

          date: item.fullTime,

          amount: capitalAdded,

          type: "deposit",
        });
      }

      return records;
    })
    .reverse();

const recentActivity = [
  ...movementActivity,

  {
    title: "Opening Deposit",
    description:
      "Portfolio initially funded",
    date:
      portfolioHistory[0]
        .fullTime,
    amount:
      portfolio.openingDeposit,
    type: "deposit",
  },
];

/* =========================================================
   PAGE
   ========================================================= */

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

  const minChartValue =
    useMemo(() => {
      const minimum = Math.min(
        ...portfolioHistory.map(
          (item) =>
            item.balance
        )
      );

      return (
        Math.floor(
          (minimum - 20000) /
            10000
        ) * 10000
      );
    }, []);

  const maxChartValue =
    useMemo(() => {
      const maximum = Math.max(
        ...portfolioHistory.map(
          (item) =>
            item.balance
        )
      );

      return (
        Math.ceil(
          (maximum + 30000) /
            10000
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
                Active monitoring view •
                Last updated{" "}
                {portfolio.lastUpdated}
              </p>

            </div>

            {/* CURRENT MOVEMENT */}

            <div className="w-fit rounded-xl border border-[#1d3958] bg-[#10223a] px-5 py-4">

              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                Current Performance
              </p>

              <div
                className={`mt-2 flex items-center gap-2 ${
                  currentMovementPositive
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >

                {currentMovementPositive ? (
                  <TrendingUp
                    size={18}
                  />
                ) : (
                  <TrendingDown
                    size={18}
                  />
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

              <p className="mt-1 text-[10px] text-slate-600">
                Excludes new capital
              </p>

            </div>

          </div>

        </section>

        {/* SUMMARY */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            icon={
              <Wallet size={18} />
            }
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
            label="Total Invested"
            value={formatNaira(
              totalInvested
            )}
          />

          <SummaryCard
            icon={
              <TrendingUp
                size={18}
              />
            }
            label="Net Growth"
            value={`${
              netGrowth >= 0
                ? "+"
                : "-"
            }${formatNaira(
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

          <SummaryCard
            icon={
              <LineChartIcon
                size={18}
              />
            }
            label="Return"
            value={`${
              growthPercent >= 0
                ? "+"
                : ""
            }${growthPercent.toFixed(
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

        {/* CAPITAL UPDATE */}

        <section className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5 sm:p-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">

                <PlusCircle
                  size={20}
                />

              </div>

              <div>

                <p className="text-sm font-semibold text-white">
                  Additional Investment Recorded
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Additional capital was added to the portfolio on 7th October 2026.
                </p>

              </div>

            </div>

            <div className="sm:text-right">

              <p className="text-xl font-bold text-blue-400">
                +₦500,000
              </p>

              <p className="mt-1 text-[11px] text-slate-600">
                New capital
              </p>

            </div>

          </div>

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
                  Portfolio value and recorded investment performance
                </p>

              </div>

              <div className="sm:text-right">

                <p className="text-xs text-slate-500">
                  Current Return
                </p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    growthPercent >=
                    0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >

                  {growthPercent >=
                  0
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
                  data={
                    chartData
                  }
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
                        stopOpacity={
                          0
                        }
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    stroke="#1c334e"
                    strokeDasharray="3 3"
                    vertical={
                      false
                    }
                  />

                  <XAxis
                    dataKey="time"
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
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
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
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

                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="none"
                    fill="url(#portfolioArea)"
                  />

                  {segments.map(
                    (
                      segment
                    ) => (

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

                  {portfolioHistory.map(
                    (
                      item,
                      index
                    ) => {

                      const capitalAdded =
                        item.capitalAdded ??
                        0;

                      if (
                        index === 0
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
                              5
                            }
                            fill="#3b82f6"
                            stroke="#bfdbfe"
                            strokeWidth={
                              2
                            }
                          />
                        );
                      }

                      const movement =
                        getPerformanceMovement(
                          index
                        );

                      const positive =
                        movement >=
                        0;

                      const isLatest =
                        index ===
                        portfolioHistory.length -
                          1;

                      const isDeposit =
                        capitalAdded >
                        0;

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
                            isDeposit
                              ? "#3b82f6"
                              : positive
                              ? "#10b981"
                              : "#ef4444"
                          }
                          stroke={
                            isDeposit
                              ? "#bfdbfe"
                              : positive
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

              <div className="flex items-center gap-2 text-blue-400">

                <span className="h-2 w-2 rounded-full bg-blue-400" />

                Capital Added

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
                label="Opening Deposit"
                value={formatNaira(
                  portfolio.openingDeposit
                )}
              />

              <InfoRow
                label="Opening Date"
                value={
                  portfolio.openingDepositDate
                }
              />

              <InfoRow
                label="Additional Investment"
                value={`+${formatNaira(
                  totalAdditionalInvestment
                )}`}
                blue
              />

              <InfoRow
                label="Total Invested"
                value={formatNaira(
                  totalInvested
                )}
              />

              <InfoRow
                label="Current Balance"
                value={formatNaira(
                  currentBalance
                )}
              />

              <InfoRow
                label="Net Growth"
                value={`${
                  netGrowth >= 0
                    ? "+"
                    : "-"
                }${formatNaira(
                  Math.abs(
                    netGrowth
                  )
                )}`}
                positive={
                  netGrowth >=
                  0
                }
                negative={
                  netGrowth < 0
                }
              />

              <InfoRow
                label="Return"
                value={`${
                  growthPercent >=
                  0
                    ? "+"
                    : ""
                }${growthPercent.toFixed(
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

            {/* ALLOCATION */}

            <div className="mt-8">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                    Portfolio Allocation
                  </p>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Current exposure by investment category
                  </p>

                </div>

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-400">
                  MULTI-ASSET
                </span>

              </div>

              <div className="space-y-4">

                {portfolio.allocation.map(
                  (
                    item
                  ) => (

                    <div
                      key={
                        item.name
                      }
                    >

                      <div className="mb-2 flex items-center justify-between gap-4">

                        <span className="text-xs text-slate-300">
                          {
                            item.name
                          }
                        </span>

                        <span className="text-xs font-semibold text-white">
                          {
                            item.percent
                          }
                          %
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[#091827]">

                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-700"
                          style={{
                            width: `${item.percent}%`,
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#1b314a] pt-4">

                <span className="text-xs text-slate-500">
                  Total allocation
                </span>

                <span className="text-xs font-semibold text-emerald-400">
                  100%
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* RECENT PORTFOLIO MOVEMENT */}

        <section className="mt-6 rounded-2xl border border-[#1c3049] bg-[#102139] p-5 shadow-xl shadow-black/10 sm:p-6">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>

              <h3 className="text-lg font-semibold">
                Recent Portfolio Movement
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Latest recorded performance changes
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

                  const difference =
                    getPerformanceMovement(
                      absoluteIndex
                    );

                  const positive =
                    difference >=
                    0;

                  const capitalAdded =
                    item.capitalAdded ??
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

                        <span className="ml-1 text-slate-600">
                          performance
                        </span>

                      </div>

                      {capitalAdded >
                        0 && (

                        <div className="mt-3 border-t border-[#1b3551] pt-3">

                          <p className="text-[11px] font-medium text-blue-400">

                            +
                            {formatNaira(
                              capitalAdded
                            )}{" "}
                            capital added

                          </p>

                        </div>

                      )}

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
              This is a read-only monitoring view. Portfolio values,
              investment activity and account records shown here are for
              viewing purposes only. Transactions cannot be initiated from
              this page.
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

              <X
                size={18}
              />

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
              performance, recorded investment activity and account history.
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

/* =========================================================
   SUMMARY CARD
   ========================================================= */

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

/* =========================================================
   INFO ROW
   ========================================================= */

function InfoRow({
  label,
  value,
  positive,
  negative,
  blue,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
  blue?: boolean;
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
            : blue
            ? "text-blue-400"
            : "text-white"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   TOOLTIP
   ========================================================= */

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

  const movement =
    index > 0
      ? getPerformanceMovement(
          index
        )
      : 0;

  const capitalAdded =
    item.capitalAdded ?? 0;

  return (
    <div className="min-w-[190px] rounded-xl border border-[#294663] bg-[#09182a] px-4 py-3 shadow-2xl">

      <p className="text-xs text-slate-500">
        {item.fullTime}
      </p>

      <p className="mt-2 text-base font-semibold text-white">
        {formatNaira(
          item.balance
        )}
      </p>

      {capitalAdded > 0 &&
        index > 0 && (

        <p className="mt-2 text-xs text-blue-400">
          +
          {formatNaira(
            capitalAdded
          )}{" "}
          capital added
        </p>

      )}

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
            Math.abs(
              movement
            )
          )}

          {" performance movement"}

        </p>

      )}

    </div>
  );
}