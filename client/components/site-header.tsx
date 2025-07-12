import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";

export function SiteHeader() {
  // route name get and display it in the header
  const pathname = usePathname();

  const routes = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Events",
      url: "/events",
    },
    {
      title: "Search",
      url: "/search",
    },
    {
      title: "Quizzes",
      url: "/quizzes",
    },
    {
      title: "Quiz",
      url: "/quiz",
    },
    {
      title: "Inbox",
      url: "/inbox",
    },
    {
      title: "Friends",
      url: "/friends",
    },
    {
      title: "Inbox",
      url: "/inbox",
    },
    {
      title: "Settings",
      url: "/settings",
    },
  ];

  const routeName = () => {
    const activeRoute = routes.find(item => {
      const isHome = item.title === "Home";
      return isHome ? pathname === "/" : pathname.includes(item.url);
    });

    return activeRoute ? activeRoute.title : "Home";
  };

return (
  <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-base font-medium">{routeName()}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
          <a
            href="https://github.com/akashmondal0"
            rel="noopener noreferrer"
            target="_blank"
            className="dark:text-foreground"
          >
            GitHub
          </a>
        </Button>
      </div>
    </div>
  </header>
)
}
