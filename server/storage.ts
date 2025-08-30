import { type Contact, type InsertContact, type CallLog, type InsertCallLog } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Contact methods
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
  searchContacts(query: string): Promise<Contact[]>;
  
  // Call log methods
  getCallLogs(): Promise<CallLog[]>;
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  deleteCallLog(id: string): Promise<boolean>;
  clearCallLogs(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private contacts: Map<string, Contact>;
  private callLogs: Map<string, CallLog>;

  constructor() {
    this.contacts = new Map();
    this.callLogs = new Map();
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: string, updateData: Partial<InsertContact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const updatedContact: Contact = {
      ...contact,
      ...updateData,
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }

  async searchContacts(query: string): Promise<Contact[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.contacts.values())
      .filter(contact => 
        contact.name.toLowerCase().includes(lowercaseQuery) ||
        contact.phone.includes(query) ||
        (contact.email && contact.email.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // Call log methods
  async getCallLogs(): Promise<CallLog[]> {
    return Array.from(this.callLogs.values()).sort((a, b) => 
      new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );
  }

  async createCallLog(insertCallLog: InsertCallLog): Promise<CallLog> {
    const id = randomUUID();
    const callLog: CallLog = {
      ...insertCallLog,
      id,
      timestamp: new Date(),
    };
    this.callLogs.set(id, callLog);
    return callLog;
  }

  async deleteCallLog(id: string): Promise<boolean> {
    return this.callLogs.delete(id);
  }

  async clearCallLogs(): Promise<boolean> {
    this.callLogs.clear();
    return true;
  }
}

export const storage = new MemStorage();
