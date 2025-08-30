import { useState } from "react";
import { Phone, Search, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DialerTab from "@/components/dialer-tab";
import ContactsTab from "@/components/contacts-tab";
import RecentsTab from "@/components/recents-tab";
import AddContactDialog from "@/components/add-contact-dialog";

type Tab = "dialer" | "contacts" | "recents";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dialer");
  const [showAddContact, setShowAddContact] = useState(false);

  const handleFabClick = () => {
    if (activeTab === "contacts") {
      setShowAddContact(true);
    } else {
      setActiveTab("dialer");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card min-h-screen relative">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Phone className="text-primary-foreground" size={16} />
            </div>
            <h1 className="text-lg font-semibold text-foreground">CallConnect</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" data-testid="button-search">
              <Search className="text-muted-foreground" size={16} />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-menu">
              <MoreVertical className="text-muted-foreground" size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-card border-b border-border px-4">
        <div className="flex space-x-8">
          <button
            className={`py-3 text-sm font-medium transition-colors ${
              activeTab === "dialer"
                ? "tab-active"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("dialer")}
            data-testid="tab-dialer"
          >
            Dialer
          </button>
          <button
            className={`py-3 text-sm font-medium transition-colors ${
              activeTab === "contacts"
                ? "tab-active"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("contacts")}
            data-testid="tab-contacts"
          >
            Contacts
          </button>
          <button
            className={`py-3 text-sm font-medium transition-colors ${
              activeTab === "recents"
                ? "tab-active"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("recents")}
            data-testid="tab-recents"
          >
            Recents
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main className="pb-20">
        {activeTab === "dialer" && <DialerTab />}
        {activeTab === "contacts" && <ContactsTab />}
        {activeTab === "recents" && <RecentsTab />}
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 floating-btn w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg"
        onClick={handleFabClick}
        data-testid="button-fab"
      >
        <Plus className="text-primary-foreground" size={20} />
      </Button>

      {/* Add Contact Dialog */}
      <AddContactDialog
        open={showAddContact}
        onOpenChange={setShowAddContact}
      />
    </div>
  );
}
