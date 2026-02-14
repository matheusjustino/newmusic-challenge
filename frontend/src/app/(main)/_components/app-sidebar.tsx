import Link from 'next/link';
import Image from 'next/image';

import { getAuthSession } from '@/lib/nextauth';

// CONSTANTS
import { MenuRoutes } from '../../../constants/menu-routes';

// COMPONENTS
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from '../../../components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../../components/ui/tooltip';
import { SidebarMenuContent } from './sidebar-menu-content';
import { LogoutButton } from './logout-button';

const AppSidebar: React.FC = async () => {
    const session = await getAuthSession();
    const routes = MenuRoutes;

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex gap-3 items-start justify-start">
                    <Link href="/dashboard" className="w-14 h-14">
                        <Image
                            fill
                            quality={100}
                            priority
                            src="/assets/images/logo.jpeg"
                            alt="NewMusic logo"
                            className="max-h-10! max-w-10 object-cover relative!"
                        />
                    </Link>

                    <Tooltip>
                        <TooltipTrigger className="font-normal text-sm text-muted-foreground overflow-hidden text-ellipsis">
                            {session?.user?.email}
                        </TooltipTrigger>
                        <TooltipContent>
                            <span className="font-normal overflow-hidden text-ellipsis">
                                {session?.user?.email}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenuContent items={routes} />
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter>
                <div className="p-2">
                    <LogoutButton />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

AppSidebar.displayName = 'AppSidebar';

export { AppSidebar };
