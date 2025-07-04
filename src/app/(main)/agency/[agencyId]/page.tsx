import CircleProgress from "@/components/global/circle-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { AreaChart } from "@tremor/react";
import {
  Contact2,
  DollarSign,
  Goal,
  ShoppingCart,
  TrendingUp,
  Users,
  Target,
  Activity,
  ArrowUpRight,
  Calendar,
  Zap,
  BarChart3,
  PieChart,
  Clipboard,
} from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{ agencyId: string }>;
  searchParams: Promise<{ code: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { agencyId } = await params;
  const { code } = await searchParams;

  let currency = "USD";
  let allSessions: any[] = [];
  let totalClosedSessions: any[] = [];
  let totalPendingSessions: any[] = [];
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const agencyDetails = await db.agency.findUnique({
    where: { id: agencyId },
  });
  if (!agencyDetails) return;

  const subaccounts = await db.subAccount.findMany({
    where: { agencyId: agencyId },
  });

  const formatDateForChart = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const createDateRange = () => {
    const dateRange = [];
    const start = new Date(`${currentYear}-01-01`);
    const end = new Date();

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      dateRange.push({
        date: formatDateForChart(date.getTime() / 1000),
        amount_total: 0,
      });
    }
    return dateRange;
  };

  // Aggregate data from all subaccounts with Stripe connections
  for (const subaccount of subaccounts) {
    if (subaccount.connectAccountId) {
      try {
        if (currency === "USD") {
          const response = await stripe.accounts.retrieve({
            stripeAccount: subaccount.connectAccountId,
          });
          currency = response.default_currency?.toUpperCase() || "USD";
        }

        const checkoutSessions = await stripe.checkout.sessions.list(
          {
            created: { gte: startDate, lte: endDate },
            limit: 100,
          },
          { stripeAccount: subaccount.connectAccountId }
        );

        allSessions.push(...checkoutSessions.data);

        const closedSessions = checkoutSessions.data
          .filter((session) => session.status === "complete")
          .map((session) => ({
            ...session,
            subaccountId: subaccount.id,
            subaccountName: subaccount.name,
            created: formatDateForChart(session.created),
            createdTimestamp: session.created * 1000,
            amount_total: session.amount_total ? session.amount_total / 100 : 0,
          }));

        totalClosedSessions.push(...closedSessions);

        const pendingSessions = checkoutSessions.data
          .filter(
            (session) =>
              session.status === "open" || session.status === "expired"
          )
          .map((session) => ({
            ...session,
            subaccountId: subaccount.id,
            subaccountName: subaccount.name,
            created: formatDateForChart(session.created),
            createdTimestamp: session.created * 1000,
            amount_total: session.amount_total ? session.amount_total / 100 : 0,
          }));

        totalPendingSessions.push(...pendingSessions);
      } catch (error) {
        console.error(
          `Error fetching data for subaccount ${subaccount.id}:`,
          error
        );
      }
    }
  }

  // Calculate totals from aggregated data
  net = +totalClosedSessions
    .reduce((total, session) => total + (session.amount_total || 0), 0)
    .toFixed(2);

  potentialIncome = +totalPendingSessions
    .reduce((total, session) => total + (session.amount_total || 0), 0)
    .toFixed(2);

  closingRate =
    allSessions.length > 0
      ? +((totalClosedSessions.length / allSessions.length) * 100).toFixed(2)
      : 0;

  // Create chart data with proper aggregation by date
  const createChartData = () => {
    const dateRange = createDateRange();

    if (!totalClosedSessions || totalClosedSessions.length === 0) {
      return dateRange;
    }

    // Group sessions by date and sum amounts
    const sessionsByDate = [
      ...totalClosedSessions,
      ...totalPendingSessions,
    ].reduce((acc, session) => {
      const date = session.created;
      acc[date] = (acc[date] || 0) + session.amount_total;
      return acc;
    }, {});

    // Merge with date range
    return dateRange.map((dateItem) => ({
      date: dateItem.date,
      amount_total: sessionsByDate[dateItem.date] || 0,
    }));
  };

  const chartData = createChartData();

  const goalProgress = (subaccounts.length / agencyDetails.goal) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-rose-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {!agencyDetails.connectAccountId && (
        <div className="absolute inset-0 z-50 mt-15 flex items-start justify-center pt-20 md:pt-0 backdrop-blur-xl bg-background/10 dark:bg-background/10">
          <Card className="w-full max-w-lg mx-4 border-0 shadow-2xl bg-card/95 backdrop-blur-md">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-3xl flex items-center justify-center shadow-lg animate-bounce">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Connect Your Stripe
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                  You need to connect your stripe account to see metrics
                </CardDescription>
              </div>
              <Link
                href={`/agency/${agencyDetails.id}/launchpad`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
              >
                <Clipboard className="w-6 h-6" />
                Launchpad
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="relative z-10 p-6 lg:p-8 xl:p-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent leading-tight">
                Analytics
              </h1>
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-base font-medium bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 text-violet-700 dark:text-violet-300 border-0"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {currentYear} Dashboard
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-base font-medium border-2 border-dashed border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Live
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-base font-medium border-2 border-dashed border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {
                    subaccounts.filter((sub) => sub.connectAccountId).length
                  }{" "}
                  Connected
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <PieChart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Revenue */}
          <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:via-green-500/10 group-hover:to-teal-500/10 transition-all duration-500" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <CardDescription className="text-emerald-700 dark:text-emerald-300 font-semibold text-base">
                Total Revenue
              </CardDescription>
              <CardTitle className="text-5xl font-black text-emerald-900 dark:text-emerald-100 leading-none">
                {net ? `${currency} ${net.toLocaleString()}` : `$0.00`}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-3/4 animate-pulse" />
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
                Aggregated revenue from all subaccounts
              </p>
            </CardContent>
          </Card>

          {/* Potential Income */}
          <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 group-hover:from-amber-500/10 group-hover:via-orange-500/10 group-hover:to-red-500/10 transition-all duration-500" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
              </div>
              <CardDescription className="text-amber-700 dark:text-amber-300 font-semibold text-base">
                Potential Income
              </CardDescription>
              <CardTitle className="text-5xl font-black text-amber-900 dark:text-amber-100 leading-none">
                {potentialIncome
                  ? `${currency} ${potentialIncome.toLocaleString()}`
                  : `$0.00`}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="h-2 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-2/3 animate-pulse" />
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 font-medium">
                Potential revenue from open sessions
              </p>
            </CardContent>
          </Card>

          {/* Active Clients */}
          <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Contact2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>
              <CardDescription className="text-blue-700 dark:text-blue-300 font-semibold text-base">
                Active Clients
              </CardDescription>
              <CardTitle className="text-5xl font-black text-blue-900 dark:text-blue-100 leading-none">
                {subaccounts.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-4/5 animate-pulse" />
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-3 font-medium">
                Sub accounts under management
              </p>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5 group-hover:from-violet-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Goal className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {Math.round(goalProgress)}%
                  </span>
                </div>
              </div>
              <CardDescription className="text-violet-700 dark:text-violet-300 font-semibold text-base">
                Agency Goal
              </CardDescription>
              <CardTitle className="text-3xl font-black text-violet-900 dark:text-violet-100 leading-none mb-4">
                {subaccounts.length} / {agencyDetails.goal}
              </CardTitle>
              <Progress
                value={goalProgress}
                className="h-3 bg-violet-100 dark:bg-violet-900/30"
              />
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                Progress towards client goal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Transaction Analytics
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                    Aggregated revenue flow throughout {currentYear}
                  </CardDescription>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl">
                  <BarChart3 className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl">
                {chartData && chartData.length > 0 ? (
                  <AreaChart
                    className="text-sm h-full"
                    data={chartData}
                    index="date"
                    categories={["amount_total"]}
                    colors={["violet"]}
                    yAxisWidth={80}
                    showAnimation={true}
                    showGridLines={true}
                    showLegend={false}
                    curveType="monotone"
                    startEndOnly={true}
                    connectNulls={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                    <div className="text-center space-y-3">
                      <BarChart3 className="w-12 h-12 mx-auto opacity-50" />
                      <p className="text-lg font-medium">
                        No transaction data available
                      </p>
                      <p className="text-sm">
                        Connect subaccount Stripe accounts to see charts
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Metrics */}
          <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Conversion Rate
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Aggregated success metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <CircleProgress
                  value={closingRate}
                  description={
                    <span className="text-lg font-bold">{closingRate}%</span>
                  }
                />
              </div>

              <div className="space-y-4">
                {allSessions.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-2xl border border-rose-200 dark:border-rose-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/20 rounded-xl">
                          <ShoppingCart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                          <p className="font-bold text-rose-900 dark:text-rose-100">
                            Total Sessions
                          </p>
                          <p className="text-sm text-rose-600 dark:text-rose-400">
                            All checkout sessions
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-black text-rose-700 dark:text-rose-300">
                        {allSessions.length}
                      </span>
                    </div>
                  </div>
                )}

                {totalClosedSessions.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                          <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-bold text-emerald-900 dark:text-emerald-100">
                            Successful Sales
                          </p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            Completed purchases
                          </p>
                        </div>
                      </div>
                      <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                        {totalClosedSessions.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
