"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Booking, MatchmakingPost } from "@/lib/mockData";
import { initialBookings, initialMatchmakingPosts } from "@/lib/mockData";
import { dedupeBookings, isDuplicateBooking } from "@/lib/bookingDedupe";

interface BookingContextType {
  bookings: Booking[];
  matchmakingPosts: MatchmakingPost[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void;
  cancelBooking: (bookingId: string) => void;
  getUserBookings: (userId: string) => Booking[];
  addMatchmakingPost: (post: Omit<MatchmakingPost, "id" | "createdAt">) => void;
  joinMatchmakingPost: (postId: string, userName: string) => void;
  leaveMatchmakingPost: (postId: string, userName: string) => void;
  resetDemoData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [matchmakingPosts, setMatchmakingPosts] = useState<MatchmakingPost[]>(
    []
  );

  // Load data from localStorage on mount
  useEffect(() => {
    // TODO: Replace with API call to fetch user's bookings
    const storedBookings = localStorage.getItem("bookit-bookings");
    if (storedBookings) {
      setBookings(dedupeBookings(JSON.parse(storedBookings)));
    } else {
      setBookings(initialBookings);
      localStorage.setItem("bookit-bookings", JSON.stringify(initialBookings));
    }

    // TODO: Replace with API call to fetch matchmaking posts
    const storedPosts = localStorage.getItem("bookit-matchmaking");
    if (storedPosts) {
      setMatchmakingPosts(JSON.parse(storedPosts));
    } else {
      setMatchmakingPosts(initialMatchmakingPosts);
      localStorage.setItem(
        "bookit-matchmaking",
        JSON.stringify(initialMatchmakingPosts)
      );
    }
  }, []);

  // Persist bookings to localStorage (always store deduped list)
  useEffect(() => {
    if (bookings.length === 0) return;
    const cleaned = dedupeBookings(bookings);
    if (cleaned.length !== bookings.length) {
      setBookings(cleaned);
      return;
    }
    localStorage.setItem("bookit-bookings", JSON.stringify(cleaned));
  }, [bookings]);

  // Persist matchmaking posts to localStorage
  useEffect(() => {
    if (matchmakingPosts.length > 0) {
      localStorage.setItem(
        "bookit-matchmaking",
        JSON.stringify(matchmakingPosts)
      );
    }
  }, [matchmakingPosts]);

  const addBooking = (booking: Omit<Booking, "id" | "createdAt">) => {
    // TODO: Replace with API call to create booking
    setBookings((prev) => {
      if (isDuplicateBooking(prev, booking)) {
        return prev;
      }
      const id = booking.ballotEntryId
        ? `booking-${booking.ballotEntryId}`
        : `booking-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newBooking: Booking = {
        ...booking,
        id,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newBooking];
    });
  };

  const cancelBooking = (bookingId: string) => {
    // TODO: Replace with API call to cancel booking
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const getUserBookings = (userId: string): Booking[] => {
    // TODO: Replace with API call to fetch user's bookings
    return bookings.filter((b) => b.userId === userId);
  };

  const addMatchmakingPost = (
    post: Omit<MatchmakingPost, "id" | "createdAt">
  ) => {
    // TODO: Replace with API call to create matchmaking post
    const newPost: MatchmakingPost = {
      ...post,
      id: `match-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMatchmakingPosts((prev) => [...prev, newPost]);
  };

  const joinMatchmakingPost = (postId: string, userName: string) => {
    // TODO: Replace with API call to join matchmaking post
    setMatchmakingPosts((prev) =>
      prev.map((post) => {
        if (
          post.id === postId &&
          !post.currentPlayers.includes(userName) &&
          post.currentPlayers.length < post.playersNeeded
        ) {
          return {
            ...post,
            currentPlayers: [...post.currentPlayers, userName],
          };
        }
        return post;
      })
    );
  };

  const leaveMatchmakingPost = (postId: string, userName: string) => {
    // TODO: Replace with API call to leave matchmaking post
    setMatchmakingPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            currentPlayers: post.currentPlayers.filter((p) => p !== userName),
          };
        }
        return post;
      })
    );
  };

  const resetDemoData = () => {
    // Clear demo state so you can re-test ballot applications cleanly.
    try {
      localStorage.removeItem("bookit-bookings");
      localStorage.removeItem("bookit-matchmaking");
    } catch {
      // ignore (non-browser)
    }
    setBookings(initialBookings);
    setMatchmakingPosts(initialMatchmakingPosts);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        matchmakingPosts,
        addBooking,
        cancelBooking,
        getUserBookings,
        addMatchmakingPost,
        joinMatchmakingPost,
        leaveMatchmakingPost,
        resetDemoData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
