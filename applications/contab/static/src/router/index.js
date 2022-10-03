const routes = [
    {
        path: '/contab',
        name: 'Sheet',
        components: {
            default: Sheet,
            side: Side
        }
    },
    {
        path: '/contab/pay',
        name: 'Pay',
        components: {
            default: Pay,
            side: SidePay
        }
    },
    {
        path: '/contab/:catchAll(.*)',
        alias: '*',
        name: 'notFound',
        component: NotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    routes: routes
});
