import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Automation {
  id: string;
  name: string;
  category: string;
  price: number;
  features: string[];
  description: string | null;
  last_updated: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});
  const [usersLoading, setUsersLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    features: "",
    description: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, adminLoading, user, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchAutomations();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchAutomations = async () => {
    try {
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .order("last_updated", { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      console.error("Error fetching automations:", error);
      toast({
        title: "Error",
        description: "Failed to load automations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.name || !formData.category || !formData.price || !formData.features) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const featuresArray = formData.features.split("\n").filter(f => f.trim());
    const automationData = {
      id: formData.id,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      features: featuresArray,
      description: formData.description || null,
    };

    try {
      if (editingAutomation) {
        const { error } = await supabase
          .from("automations")
          .update(automationData)
          .eq("id", editingAutomation.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Automation updated! Notifications sent to wishlist users.",
        });
      } else {
        const { error } = await supabase
          .from("automations")
          .insert([automationData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Automation created successfully!",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchAutomations();
    } catch (error: any) {
      console.error("Error saving automation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save automation.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (automation: Automation) => {
    setEditingAutomation(automation);
    setFormData({
      id: automation.id,
      name: automation.name,
      category: automation.category,
      price: automation.price.toString(),
      features: automation.features.join("\n"),
      description: automation.description || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this automation?")) return;

    try {
      const { error } = await supabase
        .from("automations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Automation deleted successfully!",
      });
      fetchAutomations();
    } catch (error: any) {
      console.error("Error deleting automation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete automation.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      category: "",
      price: "",
      features: "",
      description: "",
    });
    setEditingAutomation(null);
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      setUsers(profiles || []);

      // Organize roles by user_id
      const rolesMap: Record<string, string[]> = {};
      roles?.forEach((role) => {
        if (!rolesMap[role.user_id]) {
          rolesMap[role.user_id] = [];
        }
        rolesMap[role.user_id].push(role.role);
      });
      setUserRoles(rolesMap);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (userRoles[userId]?.includes("admin")) {
      toast({
        title: "Already Admin",
        description: "This user is already an admin.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: "admin" }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User promoted to admin successfully!",
      });
      fetchUsers();
    } catch (error: any) {
      console.error("Error promoting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to promote user.",
        variant: "destructive",
      });
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: "Cannot Revoke",
        description: "You cannot revoke your own admin privileges.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Are you sure you want to revoke admin privileges from this user?")) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin privileges revoked successfully!",
      });
      fetchUsers();
    } catch (error: any) {
      console.error("Error revoking admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to revoke admin privileges.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || adminLoading || (user && !isAdmin && adminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage automations and send notifications to users</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Automation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAutomation ? "Edit Automation" : "Add New Automation"}</DialogTitle>
                <DialogDescription>
                  {editingAutomation 
                    ? "Update automation details. Wishlist users will be notified of price or feature changes."
                    : "Create a new automation for users to discover."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="id">Automation ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g., email-automation-1"
                    disabled={!!editingAutomation}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Email Campaign Automation"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Email Marketing"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 299.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="features">Features (one per line) *</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Automated email sequences&#10;List segmentation&#10;A/B testing"
                    rows={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the automation..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAutomation ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Automations</CardTitle>
            <CardDescription>
              Manage your automation catalog. Updates to price or features will notify wishlist users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : automations.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No automations yet. Create your first one!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell className="font-medium">{automation.name}</TableCell>
                      <TableCell>{automation.category}</TableCell>
                      <TableCell>${automation.price}</TableCell>
                      <TableCell>{automation.features.length} features</TableCell>
                      <TableCell>{new Date(automation.last_updated).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(automation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(automation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>User Role Management</CardTitle>
            <CardDescription>
              Manage admin privileges for users in your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No users found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((profile) => {
                    const isUserAdmin = userRoles[profile.user_id]?.includes("admin");
                    const isCurrentUser = profile.user_id === user?.id;
                    return (
                      <TableRow key={profile.id}>
                        <TableCell className="font-mono text-sm">{profile.user_id}</TableCell>
                        <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {isUserAdmin ? (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">Admin</span>
                          ) : (
                            <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">User</span>
                          )}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isUserAdmin ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeAdmin(profile.user_id)}
                              disabled={isCurrentUser}
                            >
                              Revoke Admin
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handlePromoteToAdmin(profile.user_id)}
                            >
                              Promote to Admin
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
