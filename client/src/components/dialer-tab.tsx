import { useState } from "react";
import { Phone, UserPlus, MessageCircle, Video, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const keypadData = [
  { number: "1", letters: "" },
  { number: "2", letters: "ABC" },
  { number: "3", letters: "DEF" },
  { number: "4", letters: "GHI" },
  { number: "5", letters: "JKL" },
  { number: "6", letters: "MNO" },
  { number: "7", letters: "PQRS" },
  { number: "8", letters: "TUV" },
  { number: "9", letters: "WXYZ" },
  { number: "*", letters: "" },
  { number: "0", letters: "+" },
  { number: "#", letters: "" },
];

export default function DialerTab() {
  const [dialedNumber, setDialedNumber] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCallLogMutation = useMutation({
    mutationFn: async (callData: { phoneNumber: string; type: "outgoing" }) => {
      return apiRequest("POST", "/api/call-logs", callData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/call-logs"] });
    },
  });

  const handleNumberPress = (number: string) => {
    setDialedNumber(prev => prev + number);
    
    // Haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (!dialedNumber) {
      toast({
        title: "No number entered",
        description: "Please enter a phone number to make a call.",
        variant: "destructive",
      });
      return;
    }

    // Log the call
    createCallLogMutation.mutate({
      phoneNumber: dialedNumber,
      type: "outgoing",
    });

    // Initiate call using tel: protocol
    window.location.href = `tel:${dialedNumber}`;

    toast({
      title: "Initiating call",
      description: `Calling ${dialedNumber}...`,
    });
  };

  return (
    <div className="fade-in">
      {/* Display Area */}
      <div className="p-6 text-center">
        <div className="bg-muted rounded-lg p-4 mb-6">
          <Input
            type="tel"
            value={dialedNumber}
            placeholder="Enter number"
            className="w-full text-center text-2xl font-mono bg-transparent border-none outline-none"
            readOnly
            data-testid="input-dial-display"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="p-3 bg-muted hover:bg-secondary rounded-full"
            data-testid="button-add-contact"
          >
            <UserPlus className="text-muted-foreground" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-3 bg-muted hover:bg-secondary rounded-full"
            data-testid="button-message"
          >
            <MessageCircle className="text-muted-foreground" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-3 bg-muted hover:bg-secondary rounded-full"
            data-testid="button-video"
          >
            <Video className="text-muted-foreground" size={20} />
          </Button>
        </div>
      </div>

      {/* Keypad */}
      <div className="px-6">
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {keypadData.map((key) => (
            <Button
              key={key.number}
              variant="ghost"
              className="dialer-btn w-16 h-16 rounded-full bg-muted hover:bg-secondary text-foreground font-semibold text-xl flex items-center justify-center"
              onClick={() => handleNumberPress(key.number)}
              data-testid={`button-keypad-${key.number}`}
            >
              <div className="text-center">
                <div>{key.number}</div>
                {key.letters && (
                  <div className="text-xs text-muted-foreground">{key.letters}</div>
                )}
              </div>
            </Button>
          ))}
        </div>
        
        {/* Call Actions */}
        <div className="flex justify-center items-center space-x-6 mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="p-3 bg-muted hover:bg-secondary rounded-full"
            onClick={handleBackspace}
            disabled={!dialedNumber}
            data-testid="button-backspace"
          >
            <Delete className="text-muted-foreground" size={20} />
          </Button>
          <Button
            className="floating-btn w-16 h-16 bg-accent hover:bg-accent/90 rounded-full text-accent-foreground"
            onClick={handleCall}
            data-testid="button-call"
          >
            <Phone size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-3 bg-muted hover:bg-secondary rounded-full"
            data-testid="button-video-call"
          >
            <Video className="text-muted-foreground" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
