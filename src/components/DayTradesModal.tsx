
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, TrendingUp, TrendingDown, Clock, StickyNote } from "lucide-react";
import { Trade } from "@/types/trade";
import { format } from "date-fns";

interface DayTradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  trades: Trade[];
  onDeleteTrade: (tradeId: string) => void;
}

const DayTradesModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  trades, 
  onDeleteTrade 
}: DayTradesModalProps) => {
  if (!selectedDate) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const dailyTotal = trades.reduce((sum, trade) => {
    return trade.type === 'profit' ? sum + trade.amount : sum - trade.amount;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Trades for {format(selectedDate, 'MMMM d, yyyy')}
          </DialogTitle>
          <div className={`text-lg font-semibold ${
            dailyTotal > 0 ? 'text-profit' : 
            dailyTotal < 0 ? 'text-loss' : 'text-neutral'
          }`}>
            Daily Total: {dailyTotal > 0 ? '+' : ''}{formatCurrency(dailyTotal)}
          </div>
        </DialogHeader>
        
        <div className="space-y-3">
          {trades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trades recorded for this day
            </div>
          ) : (
            trades
              .sort((a, b) => b.time.localeCompare(a.time))
              .map((trade) => (
                <Card key={trade.id} className={`border-l-4 ${
                  trade.type === 'profit' ? 'border-l-profit' : 'border-l-loss'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {trade.type === 'profit' ? (
                            <TrendingUp className="h-4 w-4 text-profit" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-loss" />
                          )}
                          <span className={`font-semibold text-lg ${
                            trade.type === 'profit' ? 'text-profit' : 'text-loss'
                          }`}>
                            {trade.type === 'profit' ? '+' : '-'}{formatCurrency(trade.amount)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Clock className="h-3 w-3" />
                          {trade.time}
                        </div>
                        
                        {trade.note && (
                          <div className="flex items-start gap-2 text-sm">
                            <StickyNote className="h-3 w-3 mt-0.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{trade.note}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTrade(trade.id)}
                        className="text-loss hover:text-loss hover:bg-loss/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayTradesModal;
