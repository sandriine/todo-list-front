export interface RouteConfig {
    routes: string[];
    parent: string | null;
    parentKey: string | null;
    hasSpecificRoute: boolean;
}

export interface MockServerConfig {
    dataDir: string;
    routeConfig: {
        [key: string]: RouteConfig;
    };
}
