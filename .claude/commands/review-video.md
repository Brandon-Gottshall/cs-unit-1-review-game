# Review Video Frames

Extract unique frames from a video file, deduplicate them using perceptual hashing, and visually evaluate each frame for quality and completeness.

## Arguments

- `$ARGUMENTS` - Path to the video file to review (relative to project root or absolute)

If no argument is provided, prompt the user for the video file path.

## Workflow

### 1. Probe Video

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO_PATH"
```

Report duration and calculate expected frame count at 1 fps.

### 2. Extract Frames (1 per second)

Create a temp directory and extract:

```bash
mkdir -p /tmp/video-review-frames-all
ffmpeg -y -i "$VIDEO_PATH" -vf "fps=1" -q:v 2 /tmp/video-review-frames-all/frame_%04d.jpg
```

Report total frame count.

### 3. Deduplicate with Perceptual Hashing

Run a Python script that:
1. For each frame, downscale to 16x16 grayscale via ffmpeg and md5 hash the raw pixels
2. **Adjacent dedup**: Skip frames whose hash matches the previous frame
3. **Global dedup**: Skip frames whose hash was already seen anywhere
4. Copy unique frames to `/tmp/video-review-frames-unique/` named `unique_NNN_from_frame_NNNN.jpg`

```python
import hashlib, os, shutil, subprocess
from pathlib import Path

SRC = Path('/tmp/video-review-frames-all')
DST = Path('/tmp/video-review-frames-unique')
DST.mkdir(parents=True, exist_ok=True)
for f in DST.glob('*.jpg'):
    f.unlink()

def get_hash(path):
    r = subprocess.run(
        ['ffmpeg', '-y', '-i', str(path), '-vf', 'scale=16:16',
         '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
        capture_output=True, stderr=subprocess.DEVNULL)
    return hashlib.md5(r.stdout).hexdigest()

frames = sorted(SRC.glob('frame_*.jpg'))
hashes = []
for f in frames:
    hashes.append((f, get_hash(f)))

# Adjacent dedup
adj = [(hashes[0][0], hashes[0][1])]
for i in range(1, len(hashes)):
    if hashes[i][1] != hashes[i-1][1]:
        adj.append(hashes[i])

# Global dedup
seen = set()
unique = []
for f, h in adj:
    if h not in seen:
        seen.add(h)
        unique.append(f)

for idx, f in enumerate(unique, 1):
    shutil.copy2(str(f), str(DST / f'unique_{idx:03d}_from_{f.name}'))

print(f'{len(frames)} total -> {len(adj)} after adjacent dedup -> {len(unique)} globally unique')
```

Report dedup stats.

### 4. Visual Evaluation

Read all unique frames in batches of 10 using the Read tool (which can read images). For each frame:
- Identify what's shown (page, UI state, tour step, dialog, etc.)
- Note any issues (error messages, visual glitches, missing content, UI chrome that shouldn't be visible)
- Check for smooth progression between frames

### 5. Summary Report

Produce a structured report with:

**Frame Map Table:**
| Frame Range | Content | Notes |
|-------------|---------|-------|
| 1-5 | Landing page | ... |
| 6-20 | Feature walkthrough | ... |

**Issues Found:**
- List any problems discovered

**Verdict:**
- Content completeness assessment
- Pacing quality (too fast/slow/dead pauses)
- Visual quality issues
- Overall pass/fail recommendation

### 6. Cleanup (optional)

Ask user if they want to keep or remove the temp frame directories.

## Notes

- Requires `ffmpeg` and `ffprobe` installed (available via homebrew)
- Requires Python 3 for dedup script
- Perceptual hash threshold is coarse (16x16 grayscale) - near-identical frames with subtle animation differences may survive dedup
- For longer videos (>5min), consider extracting at 0.5 fps to reduce frame count
