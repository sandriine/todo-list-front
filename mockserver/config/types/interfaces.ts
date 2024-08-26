export interface RouteConfig {
    routes: string[];
    parents: string[] | null;
    customParentKeys: { [key: string]: string } | null;
    hasSpecificRoute: boolean;
}

export interface MockServerConfig {
    dataDir: string;
    routeConfig: {
        [key: string]: RouteConfig;
    };
}
