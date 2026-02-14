'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

// CONSTANTS
import { MenuRoutesType } from '@/constants/menu-routes';

// COMPONENTS
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SidebarMenuContentProps {
    items: MenuRoutesType;
}

const SidebarMenuContent: React.FC<SidebarMenuContentProps> = ({ items }) => {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (trigger: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [trigger]: !prev[trigger],
        }));
    };

    return (
        <Fragment>
            {items.map((item) => {
                const triggerIsActive = pathname.startsWith(
                    `/${item.trigger.toLocaleLowerCase()}`,
                );

                const isOpen = openItems.hasOwnProperty(item.trigger)
                    ? openItems[item.trigger]
                    : triggerIsActive;

                return (
                    <Collapsible
                        key={item.trigger}
                        open={isOpen}
                        onOpenChange={() => toggleItem(item.trigger)}
                    >
                        <CollapsibleTrigger className="text-sm capitalize font-semibold cursor-pointer my-1 hover:bg-zinc-200 w-full flex p-2 rounded-md items-center justify-between">
                            <span>{item.trigger}</span>
                            <ChevronRight
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isOpen ? 'rotate-90' : 'rotate-0'
                                }`}
                            />
                        </CollapsibleTrigger>

                        <ul
                            className={`${isOpen && `border-sidebar-border mx-3 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5`}`}
                        >
                            {item.routes.map((route) => {
                                const isActive = pathname === route.href;

                                return (
                                    <li key={route.href}>
                                        <CollapsibleContent>
                                            <Link
                                                href={route.href}
                                                className={`
                                                    text-sm capitalize cursor-pointer w-full
                                                    flex p-2 rounded-md items-center justify-center ${
                                                        isActive
                                                            ? 'bg-zinc-300 font-semibold'
                                                            : 'hover:bg-zinc-200'
                                                    }`}
                                            >
                                                {route.title}
                                            </Link>
                                        </CollapsibleContent>
                                    </li>
                                );
                            })}
                        </ul>
                    </Collapsible>
                );
            })}
        </Fragment>
    );
};

export { SidebarMenuContent };
