
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calculator, BarChart3 } from "lucide-react";
import { Trade } from "@/types/trade";

interface SummaryStatsProps {
  trades: Trade[];
}

const SummaryStats = ({ trades }: SummaryStatsProps) => {
  const totalProfit = trades
    .filter(trade => trade.type === 'profit')
    .reduce((sum, trade) => sum + trade.amount, 0);

  const totalLoss = trades
    .filter(trade => trade.type === 'loss')
    .reduce((sum, trade) => sum + trade.amount, 0);

  const netPnL = totalProfit - totalLoss;
  const totalTrades = trades.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-card/50 border-profit/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Profit
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-profit" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-profit">
            {formatCurrency(totalProfit)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-loss/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Loss
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-loss" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-loss">
            {formatCurrency(totalLoss)}
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-card/50 ${netPnL >= 0 ? 'border-profit/20' : 'border-loss/20'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net P&L
          </CardTitle>
          <Calculator className={`h-4 w-4 ${netPnL >= 0 ? 'text-profit' : 'text-loss'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(netPnL)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Trades
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {totalTrades}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;
