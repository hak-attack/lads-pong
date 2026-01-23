# Theme Guide for shadcn/ui

This project uses **shadcn/ui** with Tailwind CSS and CSS variables for theming. Here's how to explore and integrate pre-made themes.

## 🎨 Where to Find Pre-made Themes

### 1. **Official shadcn/ui Theme Generator**
- **URL**: https://ui.shadcn.com/themes
- **Features**: 
  - Visual theme editor
  - Live preview
  - Copy CSS variables directly
  - Multiple color schemes (slate, gray, zinc, neutral, stone, red, rose, orange, green, blue, yellow, violet)

### 2. **Colors UI** (Community Tool)
- **URL**: https://colorsui.com/
- **Features**:
  - Additional theme variations
  - Export as CSS variables
  - Compatible with shadcn/ui

### 3. **GitHub Community Themes**
- Search for "shadcn ui themes" on GitHub
- Many developers share their custom theme configurations

## 🔄 How to Apply a New Theme

### Step 1: Generate or Find a Theme
1. Visit https://ui.shadcn.com/themes
2. Choose a color scheme (e.g., "Blue", "Green", "Violet")
3. Adjust colors using the visual editor
4. Click "Copy code" to get the CSS variables

### Step 2: Replace Theme Variables
1. Open `/src/index.css`
2. Replace the `:root` section (light mode) with the new theme's light mode variables
3. Replace the `.dark` section (dark mode) with the new theme's dark mode variables

### Step 3: Test Your Theme
```bash
npm run dev
```
Toggle between light and dark modes to see how it looks!

## 📋 Example: Popular Theme Configurations

### Blue Theme (Default shadcn/ui)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... rest of variables */
}
```

### Green Theme
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
  /* ... rest of variables */
}
```

### Violet Theme
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
  /* ... rest of variables */
}
```

## 🛠️ Quick Theme Switcher Script

You can create multiple theme files and switch between them. Here's a suggested structure:

```
src/
  themes/
    blue.css
    green.css
    violet.css
    rose.css
```

Then import the desired theme in your `index.css` or dynamically load it.

## 💡 Tips

1. **Test in Both Modes**: Always check how your theme looks in both light and dark modes
2. **Accessibility**: Ensure sufficient contrast ratios for text readability
3. **Consistency**: Keep the same color scheme across light and dark modes for brand consistency
4. **Chart Colors**: Don't forget to update chart colors if you use data visualizations

## 🔗 Useful Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [HSL Color Picker](https://hslpicker.com/) - For custom color adjustments
