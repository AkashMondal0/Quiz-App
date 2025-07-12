"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import * as React from "react"

export function AuthProvider({
    children,
    ...props
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<"div">>) {

    // const authenticated = false; // Replace with actual authentication logic

    // if (!authenticated) {
    //     return (
    //         <div>
    //             {children}
    //         </div>
    //     );
    // }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}