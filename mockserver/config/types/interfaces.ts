export interface RouteConfig {
    routes: string[];
    parents: string[];
    customParentKeys: { [key: string]: string };
    hasSpecificRoute: boolean;
}

export interface MockServerConfig {
    dataDir: string;
    routeConfig: {
        [key: string]: RouteConfig;
    };
}
