import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Pencil, Calendar } from "lucide-react";

interface Order {
  id: string;
  order_id: string;
  name: string;
  email: string;
  brand_name: string | null;
  status: string;
  order_total: number;
  automation_count: number;
  created_at: string;
  estimated_completion_date: string | null;
  cart_items: string;
  message: string;
}

const OrderManagement = () => {
  const queryClient = useQueryClient();
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [completionDate, setCompletionDate] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      estimated_completion_date,
    }: {
      id: string;
      status: string;
      estimated_completion_date: string | null;
    }) => {
      const { error } = await supabase
        .from("contact_submissions")
        .update({
          status,
          estimated_completion_date,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated successfully");
      setEditingOrder(null);
      setNewStatus("");
      setCompletionDate("");
    },
    onError: (error) => {
      toast.error("Failed to update order: " + error.message);
    },
  });

  const handleUpdateOrder = () => {
    if (!editingOrder) return;

    updateOrderMutation.mutate({
      id: editingOrder.id,
      status: newStatus || editingOrder.status,
      estimated_completion_date: completionDate || editingOrder.estimated_completion_date,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order Management</h2>
      <p className="text-muted-foreground">
        Manage customer orders and update their status
      </p>

      <div className="grid gap-4">
        {orders?.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{order.order_id}</h3>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "PPP")}
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingOrder(order);
                        setNewStatus(order.status);
                        setCompletionDate(
                          order.estimated_completion_date
                            ? format(new Date(order.estimated_completion_date), "yyyy-MM-dd")
                            : ""
                        );
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Order {order.order_id}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Estimated Completion Date</Label>
                        <div className="flex gap-2">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <Input
                            type="date"
                            value={completionDate}
                            onChange={(e) => setCompletionDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleUpdateOrder}
                        disabled={updateOrderMutation.isPending}
                        className="w-full"
                      >
                        {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Customer</p>
                  <p className="text-muted-foreground">{order.name}</p>
                  <p className="text-muted-foreground">{order.email}</p>
                  {order.brand_name && (
                    <p className="text-muted-foreground">{order.brand_name}</p>
                  )}
                </div>

                <div>
                  <p className="font-medium">Order Details</p>
                  <p className="text-muted-foreground">
                    ${order.order_total} • {order.automation_count} automations
                  </p>
                  {order.estimated_completion_date && (
                    <p className="text-muted-foreground">
                      Est. completion: {format(new Date(order.estimated_completion_date), "PPP")}
                    </p>
                  )}
                </div>
              </div>

              {order.message && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium">Customer Message</p>
                  <p className="text-sm text-muted-foreground">{order.message}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
