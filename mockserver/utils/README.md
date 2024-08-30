# Utils Directory

## Overview
This directory contains utility functions, partitioning logic, route handling helpers, and Swagger schema generation that support the main functionality of the mock server.

## Files
- **errors.ts**: Contains custom error handling logic for the mock server.
- **partition.ts**: Provides a generic utility function to partition arrays based on a given predicate, useful for categorizing routes or other elements.
- **routeUtils.ts**: Contains helper functions for managing routes, including checking if a route is registered and generating nested route paths.
- **swagger-schema.ts**: Handles the generation of Swagger schemas for dynamically generated routes, including support for various HTTP methods and categorization by file name.

## Extending Utilities
You can add more utility functions or update the existing ones as needed to support additional functionality in your mock server.
