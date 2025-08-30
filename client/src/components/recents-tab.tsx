import { useState } from "react";
import { Trash2, Phone, Info, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallLogs } from "@/hooks/use-call-logs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { CallLog } from "@shared/schema";

type CallFilter = "all" | "missed" | "outgoing" | "incoming";

export default function RecentsTab() {
  const [filter, setFilter] = useState<CallFilter>("all");
  const { data: callLogs = [], isLoading } = useCallLogs();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const clearCallLogsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/call-logs");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/call-logs"] });
      toast({
        title: "Call logs cleared",
        description: "All call logs have been deleted.",
      });
    },
  });

  const deleteCallLogMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/call-logs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/call-logs"] });
    },
  });

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="text-accent" size={16} />;
      case "outgoing":
        return <PhoneOutgoing className="text-accent" size={16} />;
      case "missed":
        return <PhoneMissed className="text-destructive" size={16} />;
      default:
        return <PhoneCall className="text-accent" size={16} />;
    }
  };

  const getCallDirection = (type: string) => {
    switch (type) {
      case "incoming":
        return "↓";
      case "outgoing":
        return "↑";
      case "missed":
        return "↓";
      default:
        return "";
    }
  };

  const getStatusDot = (type: string) => {
    return type === "missed" ? "bg-destructive" : "bg-accent";
  };

  const filteredCallLogs = callLogs.filter(log => {
    if (filter === "all") return true;
    return log.type === filter;
  });

  const formatTimeAgo = (timestamp: Date | string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="fade-in">
      {/* Call Log Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Calls</h2>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 hover:bg-muted rounded-lg"
            onClick={() => clearCallLogsMutation.mutate()}
            disabled={clearCallLogsMutation.isPending || callLogs.length === 0}
            data-testid="button-clear-logs"
          >
            <Trash2 className="text-muted-foreground" size={16} />
          </Button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setFilter("all")}
            data-testid="filter-all"
          >
            All
          </Button>
          <Button
            variant={filter === "missed" ? "default" : "ghost"}
            size="sm"
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "missed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setFilter("missed")}
            data-testid="filter-missed"
          >
            Missed
          </Button>
          <Button
            variant={filter === "outgoing" ? "default" : "ghost"}
            size="sm"
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "outgoing" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setFilter("outgoing")}
            data-testid="filter-outgoing"
          >
            Outgoing
          </Button>
          <Button
            variant={filter === "incoming" ? "default" : "ghost"}
            size="sm"
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "incoming" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setFilter("incoming")}
            data-testid="filter-incoming"
          >
            Incoming
          </Button>
        </div>
      </div>

      {/* Call Log List */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading call logs...
          </div>
        ) : filteredCallLogs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {filter === "all" ? "No call logs yet." : `No ${filter} calls found.`}
          </div>
        ) : (
          filteredCallLogs.map((log) => (
            <div
              key={log.id}
              className="px-4 py-3 flex items-center space-x-3"
              data-testid={`call-log-${log.id}`}
            >
              <div className="flex-shrink-0">
                <div className={`w-2 h-2 ${getStatusDot(log.type)} rounded-full`} />
              </div>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                {getCallIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-foreground truncate">
                    {log.contactName || log.phoneNumber}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {getCallDirection(log.type)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{log.phoneNumber}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(log.timestamp!)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-muted rounded-lg"
                  onClick={() => handleCall(log.phoneNumber)}
                  data-testid={`button-call-${log.id}`}
                >
                  <Phone className="text-accent" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-muted rounded-lg"
                  data-testid={`button-info-${log.id}`}
                >
                  <Info className="text-muted-foreground" size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
