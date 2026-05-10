# Stitch site index

Run the build script to create a self-contained, dynamic site that copies the uploaded exports into `screens/` and generates an `index.html`.

How to build (no original files are modified):

```bash
cd /Users/admin/Documents/odoo/stitch_site
./build_site.sh
```

Then serve locally:

```bash
python3 -m http.server --directory /Users/admin/Documents/odoo/stitch_site 8000
```

Notes:
- The script copies `code.html` and `screen.png` from each folder inside `/Users/admin/Downloads/stitch_odoo_design_system_framework` into `stitch_site/screens/<folder>`.
- Existing files in `stitch_site/screens/` are not overwritten.

If you want, I can run the build here (I will not modify your uploads) and start a local server.
