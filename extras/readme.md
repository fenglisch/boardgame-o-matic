This folder contains **add-ons** and additional information

# Addons

Add-ons are activated via `addons` in `/DATA/DEFINITION.JS`
You can load none, one or several add-ons

```
var addons = []
var addons = ["extras/addon_results_textfilter.js"]
var addons = ["extras/addon_results_textfilter.js", "extras/addon_limit_results.js"]
```

You'll find a **short manual** within the files.

## addon_check_iframe_resize_client.js, addon_check_iframe_resize_host.js

An add-on to load the Mat-o-Wahl in an iframe for your CMS or web-site.

## addon_limit_results.js

An add-on to limit the number of results, e.g. "show only the first 10 results" and load 10 more after that.

## addon_results_textfilter.js

An add-on to filter the results.
