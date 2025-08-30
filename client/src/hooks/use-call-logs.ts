import { useQuery } from "@tanstack/react-query";
import type { CallLog } from "@shared/schema";

export function useCallLogs() {
  return useQuery<CallLog[]>({
    queryKey: ["/api/call-logs"],
    enabled: true,
  });
}
