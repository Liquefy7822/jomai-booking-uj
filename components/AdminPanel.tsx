"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  LogOut, 
  Edit,
  Save,
  X,
  BarChart3,
  Activity,
  Clock,
  MapPin,
  Plus
} from "lucide-react";
import { courts, users, initialBookings, initialMatchmakingPosts } from "@/lib/mockData";
import type { Booking, User, MatchmakingPost, Court } from "@/lib/mockData";

export function AdminPanel() {
  const { admin, logout } = useAdmin();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [matchmakingPosts, setMatchmakingPosts] = useState<MatchmakingPost[]>(initialMatchmakingPosts);
  const [courtsList, setCourtsList] = useState<Court[]>(courts);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    setEditingBooking(null);
    showNotification("success", "Booking updated successfully");
  };

  const updateUser = (updatedUser: User) => {
    // In a real app, this would update the users array
    setEditingUser(null);
    showNotification("success", "User updated successfully");
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showNotification("success", "Booking deleted successfully");
  };

  const deleteMatchmakingPost = (postId: string) => {
    setMatchmakingPosts(prev => prev.filter(p => p.id !== postId));
    showNotification("success", "Matchmaking post deleted successfully");
  };

  const updateCourt = (updatedCourt: Court) => {
    setCourtsList(prev => prev.map(c => c.id === updatedCourt.id ? updatedCourt : c));
    setEditingCourt(null);
    showNotification("success", "Court updated successfully");
  };

  const deleteCourt = (courtId: string) => {
    setCourtsList(prev => prev.filter(c => c.id !== courtId));
    showNotification("success", "Court deleted successfully");
  };

  const createCourt = (newCourt: Omit<Court, 'id'>) => {
    const court: Court = {
      ...newCourt,
      id: `court-${Date.now()}`,
    };
    setCourtsList(prev => [...prev, court]);
    showNotification("success", "Court created successfully");
  };

  // Calculate statistics
  const totalRevenue = bookings.length * 8; // Assuming $8 per booking
  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split("T")[0]).length;
  const activeUsers = users.length;
  const totalCourts = courtsList.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {admin?.username}
                </p>
              </div>
            </div>
            <Button onClick={logout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="container mx-auto px-4 py-2">
          <Alert variant={notification.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                From {bookings.length} bookings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayBookings}</div>
              <p className="text-xs text-muted-foreground">
                Active bookings today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courts</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourts}</div>
              <p className="text-xs text-muted-foreground">
                Available courts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courts">Courts</TabsTrigger>
            <TabsTrigger value="matchmaking">Matchmaking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Management
                </CardTitle>
                <CardDescription>
                  View and manage all court bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Court</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Sharing</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{courtsList.find(c => c.id === booking.courtId)?.name}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.startTime} - {booking.endTime}</TableCell>
                        <TableCell>
                          <Badge variant={booking.openToSharing ? "default" : "secondary"}>
                            {booking.openToSharing ? "Open" : "Private"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setEditingBooking(booking)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Booking</DialogTitle>
                                  <DialogDescription>
                                    Modify booking details for {booking.id}
                                  </DialogDescription>
                                </DialogHeader>
                                {editingBooking && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="edit-date">Date</Label>
                                        <Input
                                          id="edit-date"
                                          value={editingBooking.date}
                                          onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-user">User</Label>
                                        <Select
                                          value={editingBooking.userId}
                                          onValueChange={(value) => {
                                            const user = users.find(u => u.id === value);
                                            if (user) {
                                              setEditingBooking({...editingBooking, userId: value, userName: user.name});
                                            }
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {users.map(user => (
                                              <SelectItem key={user.id} value={user.id}>
                                                {user.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="edit-start">Start Time</Label>
                                        <Input
                                          id="edit-start"
                                          value={editingBooking.startTime}
                                          onChange={(e) => setEditingBooking({...editingBooking, startTime: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-end">End Time</Label>
                                        <Input
                                          id="edit-end"
                                          value={editingBooking.endTime}
                                          onChange={(e) => setEditingBooking({...editingBooking, endTime: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id="edit-sharing"
                                        checked={editingBooking.openToSharing}
                                        onChange={(e) => setEditingBooking({...editingBooking, openToSharing: e.target.checked})}
                                      />
                                      <Label htmlFor="edit-sharing">Open to sharing</Label>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" onClick={() => setEditingBooking(null)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                      </Button>
                                      <Button onClick={() => updateBooking(editingBooking)}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteBooking(booking.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Priority Score</TableHead>
                      <TableHead>Member Since</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-sm">{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.priorityScore >= 80 ? "default" : user.priorityScore >= 60 ? "secondary" : "outline"}>
                            {user.priorityScore}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Modify user details for {user.name}
                                </DialogDescription>
                              </DialogHeader>
                              {editingUser && (
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-user-name">Name</Label>
                                    <Input
                                      id="edit-user-name"
                                      value={editingUser.name}
                                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-user-email">Email</Label>
                                    <Input
                                      id="edit-user-email"
                                      type="email"
                                      value={editingUser.email}
                                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-user-priority">Priority Score</Label>
                                    <Input
                                      id="edit-user-priority"
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={editingUser.priorityScore}
                                      onChange={(e) => setEditingUser({...editingUser, priorityScore: parseInt(e.target.value)})}
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setEditingUser(null)}>
                                      <X className="h-4 w-4 mr-2" />
                                      Cancel
                                    </Button>
                                    <Button onClick={() => updateUser(editingUser)}>
                                      <Save className="h-4 w-4 mr-2" />
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courts Tab */}
          <TabsContent value="courts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Court Management
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Court
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Court</DialogTitle>
                        <DialogDescription>
                          Add a new badminton court to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="court-name">Court Name</Label>
                          <Input
                            id="court-name"
                            placeholder="e.g., Badminton Court 7"
                            onChange={(e) => {
                              const newCourt = {
                                name: e.target.value,
                                type: "badminton" as const,
                                location: "",
                                description: "",
                                imageUrl: "",
                                amenities: [],
                                pricePerHour: 8,
                              };
                              // This would be handled by createCourt function
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="court-location">Location</Label>
                          <Input
                            id="court-location"
                            placeholder="e.g., Tampines Hub, Level 2"
                            onChange={(e) => {
                              const newCourt = {
                                name: "",
                                type: "badminton" as const,
                                location: e.target.value,
                                description: "",
                                imageUrl: "",
                                amenities: [],
                                pricePerHour: 8,
                              };
                              // This would be handled by createCourt function
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="court-price">Price per Hour ($)</Label>
                          <Input
                            id="court-price"
                            type="number"
                            placeholder="8"
                            min="1"
                            onChange={(e) => {
                              const newCourt = {
                                name: "",
                                type: "badminton" as const,
                                location: "",
                                description: "",
                                imageUrl: "",
                                amenities: [],
                                pricePerHour: parseInt(e.target.value) || 8,
                              };
                              // This would be handled by createCourt function
                            }}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setEditingCourt(null)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={() => {
                            const newCourt = {
                              name: "New Court",
                              type: "badminton" as const,
                              location: "Tampines Hub, Level 2",
                              description: "Newly added badminton court",
                              imageUrl: "/courts/badminton-new.jpg",
                              amenities: ["Air-conditioned", "Professional lighting"],
                              pricePerHour: 8,
                            };
                            createCourt(newCourt);
                          }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Court
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Court ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price/Hour</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courtsList.map((court) => (
                      <TableRow key={court.id}>
                        <TableCell className="font-mono text-sm">{court.id}</TableCell>
                        <TableCell className="font-medium">{court.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{court.type}</Badge>
                        </TableCell>
                        <TableCell>{court.location}</TableCell>
                        <TableCell>${court.pricePerHour}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setEditingCourt(court)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Court</DialogTitle>
                                  <DialogDescription>
                                    Modify court details for {court.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {editingCourt && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit-court-name">Court Name</Label>
                                      <Input
                                        id="edit-court-name"
                                        value={editingCourt.name}
                                        onChange={(e) => setEditingCourt({...editingCourt, name: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-court-location">Location</Label>
                                      <Input
                                        id="edit-court-location"
                                        value={editingCourt.location}
                                        onChange={(e) => setEditingCourt({...editingCourt, location: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-court-price">Price per Hour ($)</Label>
                                      <Input
                                        id="edit-court-price"
                                        type="number"
                                        min="1"
                                        value={editingCourt.pricePerHour}
                                        onChange={(e) => setEditingCourt({...editingCourt, pricePerHour: parseInt(e.target.value) || 8})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-court-description">Description</Label>
                                      <Input
                                        id="edit-court-description"
                                        value={editingCourt.description}
                                        onChange={(e) => setEditingCourt({...editingCourt, description: e.target.value})}
                                      />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" onClick={() => setEditingCourt(null)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                      </Button>
                                      <Button onClick={() => updateCourt(editingCourt)}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteCourt(court.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matchmaking Tab */}
          <TabsContent value="matchmaking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Matchmaking Posts
                </CardTitle>
                <CardDescription>
                  View and manage matchmaking requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchmakingPosts.map((post) => (
                    <Card key={post.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{post.userName}</h3>
                            <Badge variant="outline">{post.skillLevel}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{post.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {post.courtName}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {post.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {post.startTime} - {post.endTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              Players: {post.currentPlayers.length}/{post.playersNeeded}
                            </span>
                            <div className="flex -space-x-2">
                              {post.currentPlayers.map((player, idx) => (
                                <div key={idx} className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border-2 border-background">
                                  {player.charAt(0)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteMatchmakingPost(post.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Court Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courts.map((court) => {
                      const courtBookings = bookings.filter(b => b.courtId === court.id).length;
                      const utilization = (courtBookings / (bookings.length || 1)) * 100;
                      return (
                        <div key={court.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{court.name}</span>
                            <span>{courtBookings} bookings</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${utilization}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Booking Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{bookings.length}</div>
                        <div className="text-sm text-muted-foreground">Total Bookings</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{matchmakingPosts.length}</div>
                        <div className="text-sm text-muted-foreground">Active Posts</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {users.reduce((acc, user) => acc + user.priorityScore, 0) / users.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Priority Score</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          ${totalRevenue / bookings.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Revenue/Booking</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
