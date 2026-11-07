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
cd "/Volumes/Video Resources & Archive/Dev/Arete App/Arete Marketing/arete-website"
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Hosting

Live on GitHub Pages from the public repo `IR-Idler/arete` (branch `main`, root folder):

- https://ir-idler.github.io/arete/
- https://ir-idler.github.io/arete/privacy.html
- https://ir-idler.github.io/arete/terms.html
- https://ir-idler.github.io/arete/support.html

The app's paywall links to the privacy URL above. If you use a different repo name
or a custom domain, update `privacyURL` in `PaywallView.swift` and the
`<base href="/arete/">` line in `404.html`.

## App Store link

The download button in `index.html` and the Smart App Banner (`apple-itunes-app` meta tag)
point to `https://apps.apple.com/app/id6811845817`. That link opens the visitor's own
country store.
