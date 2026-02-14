export const MenuRoutes = Object.freeze([
    {
        trigger: 'Transactions',
        routes: [
            {
                title: 'Create Transaction',
                href: '/transactions/create',
            },
            {
                title: 'Visualize Transactions',
                href: '/transactions/list',
            },
        ],
    },
    {
        trigger: 'Categories',
        routes: [
            {
                title: 'Create Category',
                href: '/categories/create',
            },
            {
                title: 'Visualize Categories',
                href: '/categories/list',
            },
        ],
    },
] as const);

export type MenuRoutesType = typeof MenuRoutes;
