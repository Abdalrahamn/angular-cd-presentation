#!/bin/bash

# Script to update image URLs after you've saved the images

echo "Updating image URLs in presentation slides..."

# Update intro slide
sed -i "s|https://media.giphy.com/media/BpGWitbFZflfSUYuZ9/giphy.gif|assets/images/excited-developer.gif|g" src/app/data/complete-presentation-slides.ts
echo "✅ Updated intro slide image URL"

# Update traditional CD slide
sed -i "s|https://i.imgur.com/placeholder-traditional-cd.png|assets/images/traditional-cd-tree.png|g" src/app/slides/part2-zone-js/justangular-dirty-marking-slides.ts
echo "✅ Updated traditional CD slide image URL"

# Update OnPush slide
sed -i "s|https://i.imgur.com/placeholder-onpush-tree.png|assets/images/onpush-tree-stars.png|g" src/app/slides/part3-onpush/part3-slides.ts
echo "✅ Updated OnPush slide image URL"

echo ""
echo "All image URLs updated! Make sure you've saved the images to:"
echo "  - src/assets/images/excited-developer.gif"
echo "  - src/assets/images/traditional-cd-tree.png"
echo "  - src/assets/images/onpush-tree-stars.png"
