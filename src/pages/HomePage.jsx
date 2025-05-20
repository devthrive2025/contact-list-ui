 import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ContactList from "@/components/ContactList";
import SearchBar from "@/components/SearchBar";
import ContactDialog from "@/components/ContactDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import {
  getContacts as fetchContacts,
  addContact as apiAddContact,
  updateContact as apiUpdateContact,
  deleteContact as apiDeleteContact,
  searchContacts as apiSearchContacts,
} from "@/lib/contact-service";

const HomePage = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedContacts = await fetchContacts();
      setContacts(loadedContacts || []);
      setFilteredContacts(loadedContacts || []);
    } catch (error) {
      toast({
        title: "Error loading contacts",
        description: error.message || "Failed to load contacts from the server.",
        variant: "destructive",
      });
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setFilteredContacts(contacts);
        return;
      }
      setIsLoading(true);
      try {
        const results = await apiSearchContacts(searchQuery);
        setFilteredContacts(results || []);
      } catch (error) {
        toast({
          title: "Search error",
          description: error.message || "Failed to search contacts.",
          variant: "destructive",
        });
        setFilteredContacts([]);
      } finally {
        setIsLoading(false);
      }
    };
    performSearch();
  }, [searchQuery, contacts, toast]);

  const handleAddContact = async (contactData) => {
    setIsLoading(true);
    try {
      const newContact = await apiAddContact(contactData);
      setContacts((prev) => [...prev, newContact]);
      setIsAddDialogOpen(false);
      toast({
        title: "Contact added",
        description: `${newContact.name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error adding contact",
        description: error.message || "Failed to add contact.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContact = async (contactData) => {
    if (!currentContact || !currentContact.id) return;
    setIsLoading(true);
    try {
      const updatedContact = await apiUpdateContact(currentContact.id, contactData);
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === currentContact.id ? updatedContact : contact
        )
      );
      setIsEditDialogOpen(false);
      setCurrentContact(null);
      toast({
        title: "Contact updated",
        description: `${updatedContact.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error updating contact",
        description: error.message || "Failed to update contact.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!currentContact || !currentContact.id) return;
    setIsLoading(true);
    try {
      await apiDeleteContact(currentContact.id);
      setContacts((prev) =>
        prev.filter((contact) => contact.id !== currentContact.id)
      );
      setIsDeleteDialogOpen(false);
      const contactName = currentContact.name;
      setCurrentContact(null);
      toast({
        title: "Contact deleted",
        description: `${contactName} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting contact",
        description: error.message || "Failed to delete contact.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (contact) => {
    setCurrentContact(contact);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (contact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Telephone Directory
          </h1>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="gradient-bg"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </motion.div>

      <div className="mb-8 max-w-md mx-auto md:mx-0">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      {isLoading && <div className="text-center py-4">Loading contacts...</div>}

      {!isLoading && (
        <ContactList
          contacts={filteredContacts}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      )}


      <ContactDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddContact}
      />

      <ContactDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setCurrentContact(null);
        }}
        contact={currentContact}
        onSubmit={handleEditContact}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCurrentContact(null);
        }}
        onConfirm={handleDeleteContact}
        contactName={currentContact?.name}
      />
    </div>
  );
};

export default HomePage;