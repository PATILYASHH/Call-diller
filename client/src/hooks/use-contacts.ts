import { useQuery } from "@tanstack/react-query";
import type { Contact } from "@shared/schema";

export function useContacts(searchQuery?: string) {
  return useQuery<Contact[]>({
    queryKey: searchQuery 
      ? ["/api/contacts/search", { q: searchQuery }] 
      : ["/api/contacts"],
    enabled: true,
  });
}
