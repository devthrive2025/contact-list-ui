
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Edit, Trash2, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="contact-card"
    >
      <Card className="overflow-hidden border-t-4 border-t-primary">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1.5">
              <h3 className="font-semibold text-xl">{contact.name}</h3>
              
              <div className="space-y-2 mt-3">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span>{contact.phone}</span>
                </div>
                
                {contact.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <span>{contact.email}</span>
                  </div>
                )}
                
                {contact.address && (
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{contact.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {contact.notes && (
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
              <p>{contact.notes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/50 px-6 py-3">
          <div className="flex justify-between w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              onClick={() => onEdit(contact)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-800 hover:bg-red-100"
              onClick={() => onDelete(contact)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContactCard;
