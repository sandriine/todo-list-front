
# Data Directory

## Overview
This directory contains the JSON files that are used to generate mock API endpoints. Each JSON file corresponds to a specific endpoint, and the contents of the file are returned when the endpoint is accessed.

## Adding New Data
Simply add a new JSON file to this directory to automatically create a `GET` route for it.

Example:
```json
[
    {
        "id": 1,
        "title": "Buy groceries",
        "completed": false
    },
    {
        "id": 2,
        "title": "Walk the dog",
        "completed": true
    }
]
```

## Customizing Routes
To add additional HTTP methods or customize behavior, update the `mockserver.config.ts` file in the `config/` directory.
