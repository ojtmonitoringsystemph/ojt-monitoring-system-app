import { Bell, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Badge } from "@/components/atoms/badge";
import { useNavigate } from "react-router";

interface AppHeaderProps {
  onMenuToggle?: () => void;
  userRole?: "admin" | "coordinator" | "student";
  userName?: string;
  onLogout?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuToggle,
  userRole = "student",
  userName = "John Doe",
  onLogout,
}) => {
  const navigate = useNavigate();
  return (
    <header className="h-14 sm:h-16 bg-white border-b border-border px-2 sm:px-4 lg:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              OJT
            </span>
          </div> */}
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-green-600 truncate">
              On-The-Job
            </h1>
            <p className="text-xs text-gray-600 truncate">Training Monitoring</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        {/* <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 px-1.5 sm:px-3 justify-end"
            >
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="hidden sm:block text-left min-w-0 max-w-xs lg:max-w-none">
                <p className="text-xs sm:text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
