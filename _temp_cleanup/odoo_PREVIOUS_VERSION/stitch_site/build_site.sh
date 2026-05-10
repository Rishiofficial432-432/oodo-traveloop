#!/usr/bin/env bash
set -euo pipefail

# Paths (do not modify files in the original uploads)
SRC="/Users/admin/Downloads/stitch_odoo_design_system_framework"
DEST_DIR="$(dirname "$0")"
SCREENS_DIR="$DEST_DIR/screens"

mkdir -p "$SCREENS_DIR"

echo "Copying exported screens from $SRC into $SCREENS_DIR ..."
for d in "$SRC"/*; do
  [ -d "$d" ] || continue
  name=$(basename "$d")
  dest="$SCREENS_DIR/$name"
  mkdir -p "$dest"
  # copy common exported files if present; -n avoids overwriting existing copies
  for f in code.html screen.png index.html README.md; do
    if [ -e "$d/$f" ]; then
      cp -n "$d/$f" "$dest/"
    fi
  done
done

echo "Generating dynamic index.html in $DEST_DIR ..."
cat > "$DEST_DIR/index.html" <<'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Odoo Design System Framework — Screens</title>
  <style>
    :root{--bg:#f7f7f9;--card:#fff;--muted:#666}
    body{font-family:Inter,system-ui,Segoe UI,Arial;margin:24px;background:var(--bg);color:#111}
    h1{font-size:34px;margin:0 0 8px}
    p.lead{margin:0 0 20px;color:var(--muted)}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px}
    .card{background:var(--card);border-radius:10px;box-shadow:0 6px 18px rgba(20,20,30,0.06);overflow:hidden;display:flex;align-items:stretch}
    .thumb{width:160px;height:120px;object-fit:cover;border-right:1px solid #eee}
    .meta{padding:14px;flex:1}
    .meta h3{margin:0 0 8px;font-size:18px}
    .links a{margin-right:12px;color:#0366d6;text-decoration:none}
    .links a:hover{text-decoration:underline}
    .footer{margin-top:18px;color:var(--muted);font-size:13px}
    .modal{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:none;align-items:center;justify-content:center;padding:20px}
    .modal .box{background:#fff;border-radius:8px;max-width:90%;max-height:90%;overflow:auto}
    .modal img, .modal iframe{display:block;max-width:100%;height:auto;border-radius:6px}
    .close{position:absolute;top:14px;right:18px;color:#fff;font-size:20px;cursor:pointer}
  </style>
</head>
<body>
  <h1>Odoo Design System Framework — Screens</h1>
  <p class="lead">Dynamic build from <code>/Users/admin/Downloads/stitch_odoo_design_system_framework</code>. Click a card to preview or open the exported code.</p>

  <div class="grid">
HTML

for s in "$SCREENS_DIR"/*; do
  [ -d "$s" ] || continue
  name=$(basename "$s")
  # choose thumbnail if present
  thumb="screens/$name/screen.png"
  if [ ! -f "$SCREENS_DIR/$name/screen.png" ]; then
    thumb="screens/$name/.placeholder.png"
  fi
  echo "    <div class=\"card\" data-name=\"$name\" data-path=\"$name\">" >> "$DEST_DIR/index.html"
  echo "      <img class=\"thumb\" src=\"$thumb\" alt=\"$name\">" >> "$DEST_DIR/index.html"
  echo "      <div class=\"meta\">" >> "$DEST_DIR/index.html"
  echo "        <h3>${name//_/ }</h3>" >> "$DEST_DIR/index.html"
  echo "        <div class=\"links\">" >> "$DEST_DIR/index.html"
  if [ -f "$SCREENS_DIR/$name/code.html" ]; then
    echo "          <a href=\"screens/$name/code.html\" target=\"_blank\">Open code</a>" >> "$DEST_DIR/index.html"
  fi
  if [ -f "$SCREENS_DIR/$name/screen.png" ]; then
    echo "          <a href=\"#\" class=\"preview\" data-type=\"image\" data-src=\"screens/$name/screen.png\">Preview</a>" >> "$DEST_DIR/index.html"
  fi
  if [ -f "$SCREENS_DIR/$name/DESIGN.md" ]; then
    echo "          <a href=\"screens/$name/DESIGN.md\" target=\"_blank\">Open DESIGN.md</a>" >> "$DEST_DIR/index.html"
  fi
  echo "        </div>" >> "$DEST_DIR/index.html"
  echo "      </div>" >> "$DEST_DIR/index.html"
  echo "    </div>" >> "$DEST_DIR/index.html"
done

cat >> "$DEST_DIR/index.html" <<'HTML'
  </div>

  <div class="footer">Serve with: <code>python3 -m http.server --directory /Users/admin/Documents/odoo/stitch_site 8000</code></div>

  <div id="modal" class="modal"><div class="close" id="modalClose">✕</div><div class="box" id="modalBox"></div></div>

  <script>
    document.querySelectorAll('.preview').forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        var type=this.dataset.type, src=this.dataset.src;
        var box=document.getElementById('modalBox'); box.innerHTML='';
        if(type==='image'){
          var img=document.createElement('img'); img.src=src; box.appendChild(img);
        } else {
          var ifr=document.createElement('iframe'); ifr.src=src; ifr.style.width='100%'; ifr.style.height='80vh'; box.appendChild(ifr);
        }
        var modal=document.getElementById('modal'); modal.style.display='flex';
      })
    })
    document.getElementById('modalClose').addEventListener('click',function(){document.getElementById('modal').style.display='none'})
    document.getElementById('modal').addEventListener('click',function(e){if(e.target===this) this.style.display='none'})
  </script>
</body>
</html>
HTML

echo "Build complete: $DEST_DIR/index.html"
