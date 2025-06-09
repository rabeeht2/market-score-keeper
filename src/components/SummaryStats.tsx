
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
    <div className="grid grid-cols-2 gap-2">
      <Card className="bg-card/50 border-profit/20">
        <CardHeader className="pb-1 pt-2 px-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-profit" />
            Profit
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div className="text-sm font-bold text-profit">
            {formatCurrency(totalProfit)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-loss/20">
        <CardHeader className="pb-1 pt-2 px-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-loss" />
            Loss
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div className="text-sm font-bold text-loss">
            {formatCurrency(totalLoss)}
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-card/50 ${netPnL >= 0 ? 'border-profit/20' : 'border-loss/20'}`}>
        <CardHeader className="pb-1 pt-2 px-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calculator className={`h-3 w-3 ${netPnL >= 0 ? 'text-profit' : 'text-loss'}`} />
            Net P&L
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div className={`text-sm font-bold ${netPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(netPnL)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-primary/20">
        <CardHeader className="pb-1 pt-2 px-2">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-primary" />
            Trades
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div className="text-sm font-bold text-primary">
            {totalTrades}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;
