"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EventDialog } from "@/components/events/event-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Router, useRouter } from "next/router";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    fetchEvents();
    checkAdminStatus();
  }, []);

  function filterList(selectedEvent: string) {
    const eventlist = events.filter((e) => {
      e.category === selectedEvent;
    });
    setFilteredEvents(eventlist);
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
      
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
      });
      const data = await response.json();
      setIsAdmin(data.data?.role === "admin");
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        {isAdmin && (
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event._id} className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(event.date), "PPP")}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {event.category}
                </p>
              </div>
              {isAdmin && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <EventDialog
        event={selectedEvent}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
