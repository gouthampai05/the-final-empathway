"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Mail,
  User,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "main",
  },
  {
    title: "Blogs",
    href: "/blogs",
    icon: FileText,
    section: "main",
  },
  {
    title: "Email List",
    icon: Mail,
    section: "main",
    isDropdown: true,
    children: [
      {
        title: "Subscribers",
        href: "/email_list/subscribers",
        icon: Users,
      },
      {
        title: "Campaign",
        href: "/email_list/campaign",
        icon: Plus,
      },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface UserProfile {
  name: string;
  email: string;
  profile_pic_url?: string | null;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({
    "Email List": true,
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email, profile_pic_url')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserProfile({
              name: profile.name || user.email?.split('@')[0] || 'User',
              email: profile.email || user.email || '',
              profile_pic_url: profile.profile_pic_url,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isDropdownActive = (children: Array<{ href: string }>) => {
    return children.some((child) => isActiveRoute(child.href));
  };

  const toggleDropdown = (title: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case "main":
        return "Overview";
      case "blog":
        return "Blog Management";
      case "future":
        return "Coming Soon";
      default:
        return "";
    }
  };

  const groupedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof sidebarItems>);

  const handleProfileAction = async (action: string) => {
    setProfileDropdownOpen(false);
    setSidebarOpen(false);

    switch (action) {
      case "profile":
        router.push("/therapist/profile");
        break;
      case "settings":
        router.push("/therapist/profile");
        break;
      case "logout":
        setConfirmLogoutOpen(true);
        break;
    }
  };

  const confirmLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-surface border-r transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">Empathway</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section} className="mb-6">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  {getSectionTitle(section)}
                </h3>
                <ul className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;

                    if (item.isDropdown) {
                      const isOpen = dropdownOpen[item.title];
                      const isActive = isDropdownActive(item.children || []);

                      return (
                        <li key={item.title}>
                          <button
                            onClick={() => toggleDropdown(item.title)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </div>
                            {isOpen ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>

                          {isOpen && (
                            <ul className="mt-1 ml-4 space-y-1">
                              {item.children?.map((child) => {
                                const ChildIcon = child.icon;
                                const isChildActive = isActiveRoute(child.href);

                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                        isChildActive
                                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                      )}
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      <ChildIcon className="w-4 h-4" />
                                      <span>{child.title}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    }

                    const isActive = isActiveRoute(item.href || "");

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href || "#"}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t flex-shrink-0 relative">
            <button
              onClick={toggleProfileDropdown}
              className="w-full flex items-center space-x-3 p-4 hover:bg-accent transition-colors duration-200"
            >
              {userProfile?.profile_pic_url ? (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={userProfile.profile_pic_url}
                    alt={userProfile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-white">
                    {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {userProfile?.name || 'Loading...'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile?.email || ''}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  profileDropdownOpen && "rotate-90"
                )}
              />
            </button>

            {profileDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-surface border rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleProfileAction("profile")}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction("settings")}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t my-1" />
                  <button
                    onClick={() => handleProfileAction("logout")}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-surface border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 bg-muted/20">{children}</main>
      </div>
      <AlertDialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
