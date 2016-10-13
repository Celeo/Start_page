# Start page

This is a two-part web app, front and back ends, that can be used as a start page in Chrome alongside the
[New Tab Redirect](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna)
extension to set the new tab to the **index.html** file.

## Building

```bash
npm run build
npm run build_server
```

## Configuring Chrome

Install the extension mentioned above, and point it to the **index.html** file in your copy of the repository.

## Running the server

The page will work without the server, but will only show the current time. To include the weather, you'll need to
have the server running as well.

```bash
node dist/server.js
```

You can run this in the background using your prefered method.
