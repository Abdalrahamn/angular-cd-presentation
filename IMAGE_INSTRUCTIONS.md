# Image Setup Instructions

I've added image support to your presentation! Now you need to save the three images you provided.

## Steps to Add Your Images:

### 1. Save the images to the assets folder:

```bash
# Create the assets/images directory (already done)
mkdir -p src/assets/images
```

### 2. Save your three images with these names:
- **Image 1** (excited developer meme) → `src/assets/images/excited-developer.gif`
- **Image 2** (traditional CD tree) → `src/assets/images/traditional-cd-tree.png`
- **Image 3** (OnPush tree with stars) → `src/assets/images/onpush-tree-stars.png`

### 3. Update the image URLs in the code:

After saving the images, update these files:

#### File 1: `src/app/data/complete-presentation-slides.ts` (Line 57)
Change:
```typescript
imageUrl: 'https://media.giphy.com/media/BpGWitbFZflfSUYuZ9/giphy.gif',
```
To:
```typescript
imageUrl: 'assets/images/excited-developer.gif',
```

#### File 2: `src/app/slides/part2-zone-js/justangular-dirty-marking-slides.ts` (Line 323)
Change:
```typescript
imageUrl: 'https://i.imgur.com/placeholder-traditional-cd.png',
```
To:
```typescript
imageUrl: 'assets/images/traditional-cd-tree.png',
```

#### File 3: `src/app/slides/part3-onpush/part3-slides.ts` (Line 1082)
Change:
```typescript
imageUrl: 'https://i.imgur.com/placeholder-onpush-tree.png',
```
To:
```typescript
imageUrl: 'assets/images/onpush-tree-stars.png',
```

## What I've Done:

✅ Added `image` type to SlideContent interface
✅ Added image rendering support in slide template
✅ Added CSS styling for images
✅ Added three new slides with image placeholders:
   - Intro slide: Excited developer meme
   - After "Traditional Change Detection Flow": Component tree diagram
   - End of OnPush section: OnPush tree with stars

## Quick Command to Update URLs:

You can use these sed commands after saving the images:

```bash
cd /home/abdelrahman/Desktop/Presentation/CD\ Project/angular-cd-presentation

# Update intro slide
sed -i "s|https://media.giphy.com/media/BpGWitbFZflfSUYuZ9/giphy.gif|assets/images/excited-developer.gif|g" src/app/data/complete-presentation-slides.ts

# Update traditional CD slide
sed -i "s|https://i.imgur.com/placeholder-traditional-cd.png|assets/images/traditional-cd-tree.png|g" src/app/slides/part2-zone-js/justangular-dirty-marking-slides.ts

# Update OnPush slide
sed -i "s|https://i.imgur.com/placeholder-onpush-tree.png|assets/images/onpush-tree-stars.png|g" src/app/slides/part3-onpush/part3-slides.ts
```
