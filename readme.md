# Boardgame-O-Matic (German: Brettspiel-O-Mat)

### An online tool that suggests users matching board games from a given collection based on their preferences

## PREREQUISITES

- Some **web-space** (a cheap shared-hosting plan is sufficient)
- **No** PHP or MySQL / MariaDB needed (optional for statistics)
- **No** npm or any other packaging manager needed

## USE / INSTALLATION

1. Download and unpack ZIP archive

2. Customise `/data/definition.js`.

3. Customise the strings in the i18n file of the language you want to use (in the folder `/i18n`)

4. Customise the CSV file containing the questions.

5. Generate the CSV file with the board game data. Creating the file manually for a larger collection would be a lot of work and error-prone due to the strict syntax requirements. You can automatically generate the file with this tool: <a href="https://github.com/fenglisch/generate-csv-file-for-boardgame-o-matic" target="_blank">https://github.com/fenglisch/generate-csv-file-for-boardgame-o-matic</a>

6. Test settings using `INDEX.HTML` (works best on http://localhost/ or your private webspace)

## DATA PROTECTION / GDPR

- All evaluations happen inside the user's browsers
- No data is collected on a server
  - Exception: default access-logging by your webhosting-provider, i.e. IP-address and time
  - Collecting anonymous user data on how they answered the questions for statistical purposes is optional and required user opt-in
- No external network requests (e.g. Content Delivery Network / CDN, Bootstrap, jQuery, no Social Media-plugin) - all included

## LICENSE

GPL 3 (see https://choosealicense.com/licenses/gpl-3.0/)

- Required: Disclose Source, License and copyright notice, State Changes
- Permitted: Commercial Use, Distribution, Modification, Patent Use, Private Use
- Forbidden: Hold Liable

## ACKNOWLEDGEMENTS

This project is based on [Mat-O-Wahl](https://github.com/msteudtn/Mat-O-Wahl) by [Mathias Steudtner](https://github.com/msteudtn).
