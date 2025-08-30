import { useState } from "react";
import { Search, Download, Upload, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContacts } from "@/hooks/use-contacts";
import { useDebounce } from "@/hooks/use-debounce";
import AddContactDialog from "./add-contact-dialog";
import ContactDetailsDialog from "./contact-details-dialog";
import type { Contact } from "@shared/schema";

type ContactFilter = "all" | "favorites" | "recent";

export default function ContactsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ContactFilter>("all");
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: contacts = [], isLoading } = useContacts(debouncedSearch);

  const getContactInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getContactBgColor = (name: string) => {
    const colors = ["bg-primary", "bg-secondary", "bg-accent"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleContactCall = (contact: Contact) => {
    window.location.href = `tel:${contact.phone}`;
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === "favorites") return contact.isFavorite;
    // For "recent" and "all", show all contacts for now
    return true;
  });

  return (
    <div className="fade-in">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-muted"
            data-testid="input-search-contacts"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="flex space-x-3">
          <Button
            className="flex-1 bg-primary text-primary-foreground py-3 font-medium flex items-center justify-center space-x-2"
            onClick={() => setShowAddContact(true)}
            data-testid="button-add-contact"
          >
            <span>Add Contact</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="px-4 py-3 bg-muted"
            data-testid="button-import"
          >
            <Download className="text-muted-foreground" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="px-4 py-3 bg-muted"
            data-testid="button-export"
          >
            <Upload className="text-muted-foreground" size={16} />
          </Button>
        </div>
      </div>

      {/* Contact Groups */}
      <div className="px-4 pb-2">
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setFilter("all")}
            data-testid="filter-all"
          >
            All
          </Button>
          <Button
            variant={filter === "favorites" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-full text-sm ${
              filter === "favorites" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setFilter("favorites")}
            data-testid="filter-favorites"
          >
            Favorites
          </Button>
          <Button
            variant={filter === "recent" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-full text-sm ${
              filter === "recent" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setFilter("recent")}
            data-testid="filter-recent"
          >
            Recent
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading contacts...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? "No contacts found matching your search." : "No contacts yet. Add your first contact!"}
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="contact-item px-4 py-3 flex items-center space-x-3 cursor-pointer"
              onClick={() => setSelectedContact(contact)}
              data-testid={`contact-item-${contact.id}`}
            >
              <div
                className={`w-12 h-12 ${getContactBgColor(contact.name)} rounded-full flex items-center justify-center text-white font-semibold`}
              >
                {getContactInitials(contact.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{contact.phone}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-muted rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactCall(contact);
                  }}
                  data-testid={`button-call-${contact.id}`}
                >
                  <Phone className="text-accent" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-muted rounded-lg"
                  data-testid={`button-message-${contact.id}`}
                >
                  <MessageCircle className="text-muted-foreground" size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialogs */}
      <AddContactDialog
        open={showAddContact}
        onOpenChange={setShowAddContact}
      />
      
      <ContactDetailsDialog
        contact={selectedContact}
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      />
    </div>
  );
}
