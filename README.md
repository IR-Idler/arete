# Arete website

Static site for the Arete app: landing page, Privacy Policy, Terms of Use and Support.
Plain HTML/CSS/JS, no build step, no dependencies, no tracking.

```
index.html      Landing page with splash screen, screenshots and rank ladder
privacy.html    Privacy Policy   → App Store Connect "Privacy Policy URL" + paywall link
terms.html      Terms of Use     → paywall link (references Apple's standard EULA)
support.html    Support + FAQ    → App Store Connect "Support URL"
404.html        Not-found page
style.css       Styles
main.js         Page behavior
*.png *.jpg     Icons, swords, and screenshots, beside the HTML
```

## Preview locally

```sh
cd ~/Desktop/arete-website
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Host on GitHub Pages

1. Create a new **public** repository on GitHub named **`arete`** (github.com/new).
2. Upload this folder's contents. Either drag the files into the repo's
   "Add file › Upload files" page, or from Terminal:

   ```sh
   cd ~/Desktop/arete-website
   git init
   git add .
   git commit -m "Arete website"
   git branch -M main
   git remote add origin https://github.com/IR-Idler/arete.git
   git push -u origin main
   ```

3. On GitHub: **Settings › Pages › Build and deployment**, set Source to
   **Deploy from a branch**, Branch **main**, folder **/ (root)**, then Save.
4. After a minute the site is live at:

   - https://ir-idler.github.io/arete/
   - https://ir-idler.github.io/arete/privacy.html
   - https://ir-idler.github.io/arete/terms.html
   - https://ir-idler.github.io/arete/support.html

The app's paywall links to the privacy URL above. If you use a different repo name
or a custom domain, update `privacyURL` in `PaywallView.swift` and the
`<base href="/arete/">` line in `404.html`.

## After launch

Replace the "Coming soon to the App Store" button in `index.html` (search for
`#download`) with your App Store link, e.g. `https://apps.apple.com/app/id0000000000`.
