import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    //SIGN IN ROUTE
    route("sign-in", "routes/root/sign-in.tsx"),
    //WE HAVE A LAYOUT FOR THE ADMIN PAGE, WITHIN IT WE HAVE TWO ROUTES (/dashboard AND /allusers), WE WILL SEE THE APPROPRIATE COMPONENTS WHEN WE NAVIGATE TO THESE ROUTES
    layout("routes/admin/admin_layout.tsx", [
        //?1st argument is the path/route, 2nd is the file path
        route("dashboard", "routes/admin/dashboard.tsx"),
        route("all-users", "routes/admin/all_users.tsx")
    ])
    
] satisfies RouteConfig;