
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Trade } from "@/types/trade";
import { format } from "date-fns";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Omit<Trade, 'id' | 'createdAt'>) => void;
  selectedDate?: Date;
}

const TradeModal = ({ isOpen, onClose, onSave, selectedDate }: TradeModalProps) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [note, setNote] = useState('');

  const handleSave = (type: 'profit' | 'loss') => {
    if (!amount || parseFloat(amount) <= 0) return;

    onSave({
      amount: parseFloat(amount),
      date,
      time,
      note: note.trim() || undefined,
      type
    });

    // Reset form
    setAmount('');
    setNote('');
    setTime(format(new Date(), 'HH:mm'));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Trade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this trade..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-profit hover:bg-profit/90 text-white"
              onClick={() => handleSave('profit')}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Profit
            </Button>
            <Button
              className="flex-1 bg-loss hover:bg-loss/90 text-white"
              onClick={() => handleSave('loss')}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Loss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
