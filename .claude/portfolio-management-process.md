# Portfolio Content Management Process

## Overview
This document outlines the step-by-step process for managing blog posts and projects on the portfolio site, including image extraction, content reordering, and configuration updates.

---

## 1. Blog Post Management

### 1.1 Extract Medium Blog Images

**Purpose:** Replace placeholder images with actual Medium featured images for better preview quality.

**Steps:**
1. Identify blogs needing image extraction (usually new blogs added from Medium)
2. For each blog, use WebFetch to fetch the Medium article URL:
   ```
   WebFetch(url: "https://medium.com/@easinxarafat/{article-slug}")
   Prompt: "Extract the main featured image URL"
   ```
3. The response will provide the actual Medium image URL (e.g., `https://miro.medium.com/0*ABC123.jpg`)
4. Update `data/blogs.json` with the extracted URL

**Example Image URLs:**
- Supply Chain Attack: `https://miro.medium.com/1*Vv3p_gifuEvbKD3voF1DaA.png`
- Underground Philosophy: `https://miro.medium.com/0*ur73QspLJlQVBTLG.jpg`
- Probability & Wealth: `https://miro.medium.com/0*j7IIADWp8jCbo_V8.jpg`

### 1.2 Reorder Blog Sequence

**Purpose:** Place most important/featured blogs at the top of the carousel.

**Process:**
1. Identify the blog to feature (e.g., "That One Introspective Girl" - Blog ID 7)
2. In `data/blogs.json`, reorder the array:
   - Keep Blog 8 first (currently featured)
   - Insert Blog 7 at position 5
   - Maintain sequence for remaining blogs (1-6, then 9-15)

**File:** `/data/blogs.json`

**Example Sequence:**
```
Position 1: Blog 8 (Axios Supply Chain)
Position 2: Blog 1 (A Pound of Flesh)
Position 3: Blog 2 (CVE-2024-4358)
Position 4: Blog 3 (Understanding Dopamine)
Position 5: Blog 7 (That One Introspective Girl) ← Featured
Position 6: Blog 4 (AI Agent Tools)
... (continue sequence)
```

---

## 2. Project Management

### 2.1 Find Missing Project Images

**Purpose:** Replace placeholder `/images/` paths with real Unsplash images.

**Detection:**
```bash
jq '.[] | select(.preview_image | contains("/images/")) | .name'
```

**Projects Needing Images:**
- MissionDeck (Task management)
- README Beautifier (Documentation)
- Arafat Git Study (Learning platform)
- Startise Bookclub (Reading app)
- WordPress Plugin DB (Plugin browser)
- GitHub PR Extractor (Browser extension)

### 2.2 Source Meaningful Images

**Strategy:** Use Unsplash images matching the project category:

| Project | Category | Unsplash Image |
|---------|----------|----------------|
| MissionDeck | Dashboard/Tasks | `photo-1552664730-d307ca884978` (productivity) |
| README Beautifier | Documentation | `photo-1517694712202-14dd9538aa97` (development) |
| Arafat Git Study | Learning/Code | `photo-1517694712202-14dd9538aa97` (development) |
| Startise Bookclub | Reading/Books | `photo-1507842217343-583f20270319` (literature) |
| WordPress Plugin DB | Web Development | `photo-1460925895917-adf4e5f5e0c5` (web) |
| GitHub PR Extractor | Development Tools | `photo-1517694712202-14dd9538aa97` (development) |

**Image URL Format:**
```
https://images.unsplash.com/photo-{ID}?w=1100&h=600&fit=crop
```

**File:** `/data/projects.json`

---

## 3. Timer Configuration

### 3.1 Update Auto-Advance Timer

**Purpose:** Change the countdown interval for auto-advancing through blog posts and projects.

**Default:** 3 seconds → **Current:** 5 seconds

**Changes Required:**

#### Blogs Page (`app/blogs/page.tsx`):
1. Change state initialization:
   ```typescript
   const [countdown, setCountdown] = useState(5);  // was 3
   ```

2. Update timer logic:
   ```typescript
   setCountdown(5);  // was 3
   setCountdown(5 - timeElapsed);  // was 3 - timeElapsed
   if (timeElapsed >= 5) {  // was 3
   ```

3. Update reset calls:
   ```typescript
   setCountdown(5);  // Replace all instances (was 3)
   ```

#### Projects Page (`app/projects/page.tsx`):
- Apply same changes as blogs page

**Command for verification:**
```bash
grep "useState(5)" app/blogs/page.tsx  # Should find the countdown state
grep "setCountdown(5)" app/blogs/page.tsx  # Should find all references
```

---

## 4. Verification Checklist

### Before Committing:

```bash
# 1. TypeScript compilation
npx tsc --noEmit

# 2. Blog order verification
jq '.[0:6] | .[] | {id, title}' data/blogs.json

# 3. Project images verification
jq '.[] | select(.preview_image | contains("/images/")) | .name' data/projects.json

# 4. Timer verification
grep "useState(5)" app/blogs/page.tsx
grep "useState(5)" app/projects/page.tsx
```

---

## 5. Key Files Modified

- `/data/blogs.json` - Blog sequence and image URLs
- `/data/projects.json` - Project image URLs
- `/app/blogs/page.tsx` - Timer configuration
- `/app/projects/page.tsx` - Timer configuration

---

## 6. Future Workflow

When adding new content:

1. **New Blog Post:** 
   - Add to `data/blogs.json`
   - Extract Medium featured image using WebFetch
   - Optionally reorder sequence (move to position 5 if featured)

2. **New Project:**
   - Add to `data/projects.json`
   - Find appropriate Unsplash image
   - Test preview on portfolio

3. **Timer Adjustment:**
   - Edit both `app/blogs/page.tsx` and `app/projects/page.tsx`
   - Replace `5` with new value in both files
   - Verify with grep command

---

## Notes

- Always extract **actual Medium featured images** (miro.medium.com) rather than using Unsplash placeholders for blog posts
- Use Unsplash for projects as Medium images aren't applicable
- Test countdown timer visually before committing
- Keep blog sequence consistent with user preferences
