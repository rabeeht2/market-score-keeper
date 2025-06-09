
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

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            {format(currentDate, 'MMM yyyy')}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={onPrevMonth} className="h-7 w-7 p-0">
              ←
            </Button>
            <Button variant="outline" size="sm" onClick={onNextMonth} className="h-7 w-7 p-0">
              →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 flex-1 flex flex-col">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map(day => (
            <div key={day} className="p-1 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1">
          {monthDays.map(date => {
            const dailyPnL = getDailyPnL(date);
            const hasTrades = dailyPnL.trades.length > 0;
            const pnlAmount = dailyPnL.totalPnL;
            
            return (
              <Button
                key={date.toISOString()}
                variant="ghost"
                className={`
                  h-14 p-1 flex flex-col items-center justify-center text-xs
                  hover:bg-accent/50 transition-colors
                  ${isToday(date) ? 'ring-1 ring-primary' : ''}
                  ${hasTrades ? 'bg-card border' : ''}
                `}
                onClick={() => onDateSelect(date)}
              >
                <span className={`font-medium text-xs ${isToday(date) ? 'text-primary' : ''}`}>
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
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingCalendar;
