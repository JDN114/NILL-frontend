
from pathlib import Path

base = Path("/root/nill/frontend/src")

checks = [
    "sections/iss/ISSSection.jsx",
    "sections/iss/ISSScene.jsx",
    "sections/iss/ISSModel.jsx",
    "sections/iss/useISSTimeline.js",
    "styles/iss.css",
    "styles/iss-sequence.css",
]

print("\nISS SETUP CHECK\n")

ok = True

for c in checks:
    p = base / c

    if p.exists():
        print(f"✓ {c}")
    else:
        print(f"✗ {c}")
        ok = False

print("\nRESULT:")

if ok:
    print("READY")
else:
    print("MISSING FILES")
