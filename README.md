# MMM-Sentry

## Prerequisites

1. Sentry project
2. Sentry access token

## How to create Sentry access token?

1. Go to Sentry organisation settings
2. Create new Integration
3. Select `Internal Integration`
4. Give the integration a name, e.g. MagicMirror
5. Allow read access to `Issue & Event`
6. Save changes
7. Scroll down and copy token
8. Now you have your Sentry access token.

## Installing the Module

Navigate into your MagicMirror's modules folder and execute

`git clone https://github.com/ExtremTechniker/MMM-Sentry.git`

## Configuration

To use this module, add it to the modules array in the `config/config.js` file:

```javascript
    {
        module: 'MMM-Sentry',
        position: 'middle_center',
        config: {
            // Default interval is 30 seconds
            updateInterval: 5,
            // Default base_url is https://sentry.io
            sentry_base_url: 'https://sentry.io',
            // Your Sentry Access Token.
            token: '',

            projects: [
                {
                    organization_slug: 'sample_organization_slug',
                    project_slug: 'sample_project_slug',
                    displayName: 'A displayname instead of project_slug',
                },
            ]           

        },
    }    
```
