
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";
import { Trade } from "@/types/trade";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import TradingCalendar from "@/components/TradingCalendar";
import TradeModal from "@/components/TradeModal";
import DayTradesModal from "@/components/DayTradesModal";
import SummaryStats from "@/components/SummaryStats";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();

  // Load trades from localStorage on component mount
  useEffect(() => {
    const savedTrades = localStorage.getItem('pnl-trades');
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  // Save trades to localStorage whenever trades change
  useEffect(() => {
    localStorage.setItem('pnl-trades', JSON.stringify(trades));
  }, [trades]);

  const addTrade = (newTrade: Omit<Trade, 'id' | 'createdAt'>) => {
    const trade: Trade = {
      ...newTrade,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setTrades(prev => [...prev, trade]);
    
    toast({
      title: "Trade Added",
      description: `${trade.type === 'profit' ? 'Profit' : 'Loss'} of $${trade.amount.toFixed(2)} recorded`,
    });
  };

  const deleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
    toast({
      title: "Trade Deleted",
      description: "Trade has been removed from your records",
    });
  };

  const handleDateSelect = (date: Date) => {
    const dayTrades = trades.filter(trade => 
      isSameDay(new Date(trade.date), date)
    );
    
    if (dayTrades.length > 0) {
      setSelectedDate(date);
      setIsDayModalOpen(true);
    } else {
      setSelectedDate(date);
      setIsTradeModalOpen(true);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const totalPnL = trades.reduce((sum, trade) => {
    return trade.type === 'profit' ? sum + trade.amount : sum - trade.amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-2 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col h-screen">
        {/* Compact Header */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-profit bg-clip-text text-transparent">
              P&L Tracker
            </h1>
          </div>
          
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${
              totalPnL > 0 ? 'text-profit' : 
              totalPnL < 0 ? 'text-loss' : 'text-neutral'
            }`}>
              {totalPnL > 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </div>
          </div>
        </div>

        {/* Compact Summary Statistics */}
        <div className="mb-3">
          <SummaryStats trades={trades} />
        </div>

        {/* Compact Trading Calendar */}
        <div className="flex-1 min-h-0">
          <TradingCalendar
            trades={trades}
            currentDate={currentDate}
            onDateSelect={handleDateSelect}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>

        {/* Compact Add Trade Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            size="lg"
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
            onClick={() => {
              setSelectedDate(new Date());
              setIsTradeModalOpen(true);
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Modals */}
        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          onSave={addTrade}
          selectedDate={selectedDate || undefined}
        />

        <DayTradesModal
          isOpen={isDayModalOpen}
          onClose={() => setIsDayModalOpen(false)}
          selectedDate={selectedDate}
          trades={selectedDate ? trades.filter(trade => 
            isSameDay(new Date(trade.date), selectedDate)
          ) : []}
          onDeleteTrade={deleteTrade}
        />
      </div>
    </div>
  );
};

export default Index;
