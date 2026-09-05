# as1726_geotech

Python tools for AS1726 geotechnical site investigations, plus a browser-based point load test calculator for AS 4133.4.1.

Quickstart

Install in editable mode and run Python tests:

```bash
python -m pip install --upgrade pip
pip install -e .
pip install pytest
pytest -q
```

Run the browser calculator locally:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in a browser.

The calculator supports diametral, axial, block and irregular lump specimens, selects the rock type, calculates the point load strength index, applies the standard size correction to derive Is(50), estimates UCS from a common rock-type K factor, and shows the specimen sketch and dimensions.

The AS 4133.4.1 size correction is based on specimen equivalent diameter and the standard exponent for rock. The rock-type factor is used for a separate UCS estimate and should be checked against the project specification or laboratory method.

This repository is configured for GitHub Pages deployment through the workflow in .github/workflows/pages.yml, so the app can be hosted directly from GitHub.
