"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { fetchSession } from "@/store/features/account/Api"
import * as React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export function AuthProvider({
    children,
    ...props
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<"div">>) {
    const dispatch = useDispatch();
    // const authenticated = false; // Replace with actual authentication logic

    // if (!authenticated) {
    //     return (
    //         <div>
    //             {children}
    //         </div>
    //     );
    // }

    useEffect(() => {
        dispatch(fetchSession() as any);
    }, []);

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