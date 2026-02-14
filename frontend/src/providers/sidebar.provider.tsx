// COMPONENTS
import { AppSidebar } from '@/app/(main)/_components/app-sidebar';
import {
    SidebarProvider as ShadcnSidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';

interface SidebarProviderProps {
    children: React.ReactNode;
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    return (
        <ShadcnSidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <SidebarTrigger />
                {children}
            </main>
        </ShadcnSidebarProvider>
    );
};

export { SidebarProvider };
