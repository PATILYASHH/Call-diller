import { useState } from "react";
import { Phone, MessageCircle, Mail, Edit, Trash2, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Contact } from "@shared/schema";

interface ContactDetailsDialogProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactDetailsDialog({
  contact,
  open,
  onOpenChange,
}: ContactDetailsDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Contact deleted",
        description: "Contact has been successfully deleted.",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
        variant: "destructive",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      return apiRequest("PUT", `/api/contacts/${id}`, { isFavorite });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
  });

  const handleCall = () => {
    if (contact) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleMessage = () => {
    if (contact) {
      window.location.href = `sms:${contact.phone}`;
    }
  };

  const handleEmail = () => {
    if (contact?.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const handleDelete = () => {
    if (contact) {
      deleteContactMutation.mutate(contact.id);
    }
  };

  const handleToggleFavorite = () => {
    if (contact) {
      toggleFavoriteMutation.mutate({
        id: contact.id,
        isFavorite: !contact.isFavorite,
      });
    }
  };

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

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contact Avatar and Name */}
          <div className="text-center">
            <div
              className={`w-24 h-24 ${getContactBgColor(contact.name)} rounded-full flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4`}
            >
              {getContactInitials(contact.name)}
            </div>
            <h2 className="text-xl font-semibold text-foreground">{contact.name}</h2>
            {contact.isFavorite && (
              <Heart className="w-5 h-5 text-destructive fill-current mx-auto mt-2" />
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-foreground">{contact.phone}</span>
            </div>
            
            {contact.email && (
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-foreground">{contact.email}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleCall}
              data-testid="button-call-contact"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              onClick={handleMessage}
              data-testid="button-message-contact"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            
            {contact.email && (
              <Button
                variant="outline"
                onClick={handleEmail}
                data-testid="button-email-contact"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              disabled={toggleFavoriteMutation.isPending}
              data-testid="button-toggle-favorite"
            >
              <Heart className={`w-4 h-4 mr-2 ${contact.isFavorite ? 'fill-current text-destructive' : ''}`} />
              {contact.isFavorite ? 'Unfavorite' : 'Favorite'}
            </Button>
          </div>

          {/* Management Actions */}
          <div className="flex space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1"
              data-testid="button-edit-contact"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={deleteContactMutation.isPending}
              data-testid="button-delete-contact"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteContactMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
