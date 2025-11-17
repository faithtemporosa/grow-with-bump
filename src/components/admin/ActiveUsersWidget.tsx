import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Globe, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface LoginActivity {
  id: string;
  user_id: string;
  login_at: string;
  country: string | null;
  city: string | null;
  browser: string | null;
  os: string | null;
}

interface UserProfile {
  email: string;
}

interface ActivityWithEmail extends LoginActivity {
  email: string;
}

interface GeographicStats {
  country: string;
  count: number;
}

export function ActiveUsersWidget() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityWithEmail[]>([]);
  const [geoStats, setGeoStats] = useState<GeographicStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    subscribeToPresence();
    subscribeToLoginActivity();
  }, []);

  const subscribeToPresence = () => {
    const channel = supabase.channel("admin-presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setActiveUsers(Object.keys(state).length);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToLoginActivity = () => {
    const channel = supabase
      .channel("login-activity-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "login_activity",
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchData = async () => {
    try {
      // Fetch recent login activity (last 10)
      const { data: activities } = await supabase
        .from("login_activity")
        .select("*")
        .order("login_at", { ascending: false })
        .limit(10);

      if (activities) {
        // Fetch user emails
        const userIds = [...new Set(activities.map((a) => a.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, email")
          .in("user_id", userIds);

        const emailMap = new Map(profiles?.map((p) => [p.user_id, p.email || "Unknown"]));

        const activitiesWithEmail = activities.map((activity) => ({
          ...activity,
          email: emailMap.get(activity.user_id) || "Unknown",
        }));

        setRecentActivity(activitiesWithEmail);
      }

      // Fetch geographic distribution (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: geoData } = await supabase
        .from("login_activity")
        .select("country")
        .gte("login_at", thirtyDaysAgo.toISOString())
        .not("country", "is", null);

      if (geoData) {
        const countryCount = geoData.reduce((acc, item) => {
          const country = item.country || "Unknown";
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const stats = Object.entries(countryCount)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setGeoStats(stats);
      }
    } catch (error) {
      console.error("Error fetching activity data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Active Users Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Activity className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">Currently online</p>
        </CardContent>
      </Card>

      {/* Recent Login Activity */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Login Activity
          </CardTitle>
          <CardDescription>Latest user logins across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.city && activity.country
                        ? `${activity.city}, ${activity.country}`
                        : activity.country || "Unknown location"}
                      {activity.browser && ` • ${activity.browser}`}
                      {activity.os && ` on ${activity.os}`}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(activity.login_at), { addSuffix: true })}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <CardDescription>Top login locations (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {geoStats.length === 0 ? (
              <p className="text-sm text-muted-foreground col-span-full">No geographic data available</p>
            ) : (
              geoStats.map((stat) => (
                <div key={stat.country} className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground text-center">{stat.country}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
