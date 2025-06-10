import CircleProgress from "@/components/global/circle-progress";
import PipelineValue from "@/components/global/pipeline-value";
import SubaccountFunnelChart from "@/components/global/subaccount-funnel-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { AreaChart, BadgeDelta } from "@tremor/react";
import {
  ClipboardIcon,
  Contact2,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Activity,
  CreditCard,
  Eye,
} from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{ subaccountId: string }>;
  searchParams: Promise<{ code: string }>;
};

type ProcessedSession = {
  id: string;
  created: number;
  createdForChart: string;
  createdFormatted: string;
  amount_total: number;
  status: string | null;
  customer_details?: {
    email?: string | null; // <-- allow null here
  } | null;
  [key: string]: any;
};

type ChartDataPoint = {
  date: string;
  amount_total: number;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { subaccountId } = await params;
  const { code } = await searchParams;

  let currency = "USD";
  let sessions: ProcessedSession[] = [];
  let totalClosedSessions: ProcessedSession[] = [];
  let totalPendingSessions: ProcessedSession[] = [];
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });

  if (!subaccountDetails) return;

  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  // Helper function to format date as DD-MM-YYYY
  const formatDateDDMMYYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Create a complete date range from start of year to current date
  const createDateRange = (): ChartDataPoint[] => {
    const dateRange: ChartDataPoint[] = [];
    const start = new Date(`${currentYear}-01-01`);
    const end = new Date();

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      dateRange.push({
        date: formatDateDDMMYYYY(new Date(date)),
        amount_total: 0,
      });
    }
    return dateRange;
  };

  if (subaccountDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: subaccountDetails.connectAccountId,
    });
    currency = response.default_currency?.toUpperCase() || "USD";

    const checkoutSessions = await stripe.checkout.sessions.list(
      { created: { gte: startDate, lte: endDate }, limit: 100 },
      {
        stripeAccount: subaccountDetails.connectAccountId,
      }
    );

    const sortedSessions = checkoutSessions.data.sort(
      (a, b) => a.created - b.created
    );

    const formatDateForSession = (timestamp: number) => {
      const date = new Date(timestamp * 1000);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    sessions = sortedSessions.map(
      (session): ProcessedSession => ({
        ...session,
        created: session.created * 1000,
        createdForChart: formatDateForSession(session.created),
        createdFormatted: new Date(session.created * 1000).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      })
    );

    totalClosedSessions = sortedSessions
      .filter((session) => session.status === "complete")
      .map(
        (session): ProcessedSession => ({
          ...session,
          created: session.created * 1000,
          createdForChart: formatDateForSession(session.created),
          createdFormatted: new Date(
            session.created * 1000
          ).toLocaleDateString(),
          amount_total: session.amount_total ? session.amount_total / 100 : 0,
        })
      );

    totalPendingSessions = sortedSessions
      .filter(
        (session) => session.status === "open" || session.status === "expired"
      )
      .map(
        (session): ProcessedSession => ({
          ...session,
          created: session.created * 1000,
          createdForChart: formatDateForSession(session.created),
          createdFormatted: new Date(
            session.created * 1000
          ).toLocaleDateString(),
          amount_total: session.amount_total ? session.amount_total / 100 : 0,
        })
      );

    net = +totalClosedSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    closingRate =
      checkoutSessions.data.length > 0
        ? +(
            (totalClosedSessions.length / checkoutSessions.data.length) *
            100
          ).toFixed(2)
        : 0;
  }

  // Create complete chart data with all dates
  const createChartData = (): ChartDataPoint[] => {
    const dateRange = createDateRange();

    if (!sessions || sessions.length === 0) {
      return dateRange;
    }

    const sessionsByDate = sessions.reduce(
      (acc: Record<string, number>, session: ProcessedSession) => {
        const date = session.createdForChart;
        acc[date] = (acc[date] || 0) + session.amount_total;
        return acc;
      },
      {}
    );

    return dateRange.map((dateItem) => ({
      ...dateItem,
      amount_total: sessionsByDate[dateItem.date] || 0,
    }));
  };

  const chartData: ChartDataPoint[] = createChartData();

  const funnels = await db.funnel.findMany({
    where: {
      subAccountId: subaccountId,
    },
    include: {
      FunnelPages: true,
    },
  });

  const funnelPerformanceMetrics = funnels.map((funnel) => ({
    ...funnel,
    totalFunnelVisits: funnel.FunnelPages.reduce(
      (total, page) => total + page.visits,
      0
    ),
  }));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 dotPattern opacity-30 dark:opacity-20" />

      {/* Stripe Connection Overlay */}
      {!subaccountDetails.connectAccountId && (
        <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/80">
          <Card className="border-2 border-primary/20 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Connect Your Stripe
              </CardTitle>
              <CardDescription className="text-base">
                You need to connect your stripe account to see metrics
              </CardDescription>
              <Link
                href={`/subaccount/${subaccountDetails.id}/launchpad`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ClipboardIcon className="w-4 h-4" />
                Launch Pad
              </Link>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="relative z-10 p-4 lg:p-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your performance and analytics for {currentYear}
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Income Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent" />
            <CardHeader className="relative">
              <CardDescription className="text-emerald-100">
                Income
              </CardDescription>
              <CardTitle className="text-4xl font-bold">
                {net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
              </CardTitle>
              <small className="text-emerald-200">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="relative text-emerald-100">
              Total revenue generated as reflected in your stripe dashboard.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-emerald-200 w-8 h-8" />
          </Card>

          {/* Potential Income Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent" />
            <CardHeader className="relative">
              <CardDescription className="text-orange-100">
                Potential Income
              </CardDescription>
              <CardTitle className="text-4xl font-bold">
                {potentialIncome
                  ? `${currency} ${potentialIncome.toFixed(2)}`
                  : `$0.00`}
              </CardTitle>
              <small className="text-orange-200">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="relative text-orange-100">
              This is how much you can close.
            </CardContent>
            <TrendingUp className="absolute right-4 top-4 text-orange-200 w-8 h-8" />
          </Card>

          {/* Pipeline Value Card */}
          <div className="xl:col-span-2">
            <PipelineValue subaccountId={subaccountId} />
          </div>
        </div>

        {/* Conversions Card */}
        <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Conversions</CardTitle>
                <CardDescription>
                  Track your conversion performance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CircleProgress
              value={closingRate}
              description={
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sessions && (
                    <div className="flex flex-col p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        Total Carts Opened
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <ShoppingCart className="text-red-600 w-5 h-5" />
                        <span className="text-2xl font-bold text-red-800 dark:text-red-200">
                          {sessions.length}
                        </span>
                      </div>
                    </div>
                  )}
                  {totalClosedSessions && (
                    <div className="flex flex-col p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        Won Carts
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <ShoppingCart className="text-green-600 w-5 h-5" />
                        <span className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {totalClosedSessions.length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Funnel Performance */}
          <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Funnel Performance</CardTitle>
                  <CardDescription>
                    Track visitor engagement across funnels
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <SubaccountFunnelChart data={funnelPerformanceMetrics} />
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Total page visits across all funnels. Hover over to get more
                  details on funnel page performance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Activity Chart */}
          <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Checkout Activity</CardTitle>
                  <CardDescription>Daily revenue trends</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <AreaChart
                  className="h-80"
                  data={chartData}
                  index="date"
                  categories={["amount_total"]}
                  colors={["blue"]}
                  yAxisWidth={60}
                  showAnimation={true}
                  showLegend={false}
                  showGridLines={true}
                  startEndOnly={true}
                  connectNulls={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Transaction History
                    <BadgeDelta
                      className="rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                      deltaType="moderateIncrease"
                      isIncreasePositive={true}
                      size="xs"
                    >
                      +12.3%
                    </BadgeDelta>
                  </CardTitle>
                  <CardDescription>
                    Recent successful transactions
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
                    <TableRow>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Time</TableHead>
                      <TableHead className="font-semibold text-right">
                        Value
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {totalClosedSessions && totalClosedSessions.length > 0 ? (
                      totalClosedSessions.map((session: ProcessedSession) => {
                        const sessionDate = new Date(session.created);
                        return (
                          <TableRow
                            key={session.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {session.customer_details?.email || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm">
                                Paid
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {sessionDate.toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {sessionDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              <span className="text-muted-foreground text-xs">
                                {currency}
                              </span>{" "}
                              <span className="text-emerald-600 dark:text-emerald-400 text-lg">
                                {session.amount_total.toFixed(2)}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <CreditCard className="w-8 h-8 text-muted-foreground/50" />
                            No transactions found
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
