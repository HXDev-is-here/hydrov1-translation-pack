# HydroV1 translation pack

Community translations for the HydroV1 Pterodactyl theme. The theme downloads these files, so a merged
language appears in every panel's **Languages** tab.

## Request a language
Open an issue with the **Language request** form.

## Add or fix a translation
1. Copy `languages/en.json` to `languages/<code>.json` (for example `de.json`, `pt-BR.json`).
2. Set `_meta.code`, `_meta.name`, `_meta.native`, and translate the values in `strings`. Leave the keys alone.
3. Keep placeholders such as `{name}` exactly as in English. Plain text only, no HTML.
4. Open a pull request. A check validates the file; `index.json` is updated automatically after merge.

Missing keys fall back to English. `languages/en.json` is the source of truth and is updated with the theme.
