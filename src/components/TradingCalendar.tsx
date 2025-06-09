
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Trade, DailyPnL } from "@/types/trade";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

interface TradingCalendarProps {
  trades: Trade[];
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const TradingCalendar = ({ 
  trades, 
  currentDate, 
  onDateSelect, 
  onPrevMonth, 
  onNextMonth 
}: TradingCalendarProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDailyPnL = (date: Date): DailyPnL => {
    const dayTrades = trades.filter(trade => 
      isSameDay(new Date(trade.date), date)
    );
    
    const totalPnL = dayTrades.reduce((sum, trade) => {
      return trade.type === 'profit' ? sum + trade.amount : sum - trade.amount;
    }, 0);

    return {
      date: format(date, 'yyyy-MM-dd'),
      totalPnL,
      trades: dayTrades
    };
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPrevMonth}>
              ←
            </Button>
            <Button variant="outline" size="sm" onClick={onNextMonth}>
              →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(date => {
            const dailyPnL = getDailyPnL(date);
            const hasTrades = dailyPnL.trades.length > 0;
            const pnlAmount = dailyPnL.totalPnL;
            
            return (
              <Button
                key={date.toISOString()}
                variant="ghost"
                className={`
                  h-16 p-1 flex flex-col items-center justify-center text-xs
                  hover:bg-accent/50 transition-colors
                  ${isToday(date) ? 'ring-2 ring-primary' : ''}
                  ${hasTrades ? 'bg-card border' : ''}
                `}
                onClick={() => onDateSelect(date)}
              >
                <span className={`font-medium ${isToday(date) ? 'text-primary' : ''}`}>
                  {format(date, 'd')}
                </span>
                {hasTrades && (
                  <span className={`text-xs font-bold ${
                    pnlAmount > 0 ? 'text-profit' : 
                    pnlAmount < 0 ? 'text-loss' : 'text-neutral'
                  }`}>
                    {pnlAmount > 0 ? '+' : ''}{formatCurrency(pnlAmount)}
                  </span>
                )}
                {hasTrades && (
                  <span className="text-xs text-muted-foreground">
                    {dailyPnL.trades.length} trade{dailyPnL.trades.length !== 1 ? 's' : ''}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingCalendar;
