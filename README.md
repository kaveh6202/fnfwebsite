# Armita Yogalates Website

A beautiful, modern website for Feather & Flow Yogalates featuring sophisticated wave animations, responsive design, and modular architecture.

## Project Structure

```
fnfwebsite/
├── index.html              # Main HTML file (clean and organized)
├── css/                    # Stylesheets (modular CSS architecture)
│   ├── main.css           # Core styles, variables, and base elements
│   ├── navigation.css     # Navigation bar and burger menu styles
│   ├── sections.css       # Section layouts and hero styling
│   ├── components.css     # Cards, testimonials, footer, and interactive components
│   └── responsive.css     # Mobile and responsive design rules
├── js/                     # JavaScript modules (organized by functionality)
│   ├── animations.js      # Motion One animations and micro-interactions
│   ├── wave-system.js     # Sophisticated wave background system
│   ├── navigation.js      # Navigation and scrolling management
│   ├── testimonials.js    # Testimonial cycling system
│   └── effects.js         # Visual effects and interactions
├── images/                 # All website assets
│   ├── Logo_Single.svg    # Main logo
│   ├── Icon_.svg          # Brand icon
│   ├── armita-pose*.jpeg  # Portrait images
│   ├── Banner*.png        # Hero banners
│   └── *.png             # Feature thumbnails
└── README.md              # This documentation
```

## Features

### Visual Design
- **Sophisticated Wave System**: Custom canvas-based wave animations with lifecycle management
- **Motion One Animations**: Lightweight, performant entrance animations and micro-interactions
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Modern UI Components**: Glass-morphism cards, flip interactions, and smooth transitions

### Technical Architecture
- **Modular CSS**: Separated concerns with dedicated stylesheets for different aspects
- **JavaScript Modules**: Clean separation of functionality into logical modules
- **Performance Optimized**: Adaptive quality system for wave animations based on device performance
- **Accessibility**: Proper ARIA labels, reduced motion support, and semantic HTML

### Sections
1. **Hero**: Brand introduction with animated logo and call-to-action
2. **Biography**: Professional background with elegant text-image layout
3. **Classes**: Service offerings with interactive cards (Yoga, Yogalates, Pilates)
4. **Testimonials**: Rotating client testimonials
5. **Newsletter**: Email signup with styled form
6. **Ask Armita**: Contact section with direct email link
7. **Enhanced Practices**: Premium services with flip-card interactions

## Development

### CSS Architecture
The stylesheet architecture follows a modular approach:

- **main.css**: CSS variables, reset, base styles, and core layout elements
- **navigation.css**: All navigation-related styles including burger menu
- **sections.css**: Section layouts, hero styling, and content organization
- **components.css**: Reusable components like cards, testimonials, and footer
- **responsive.css**: Mobile responsiveness and adaptive layouts

### JavaScript Modules

#### AnimationManager (`animations.js`)
- Handles Motion One integration
- Entrance animations for sections
- Hero logo rotation based on scroll
- Micro-physics interactions for buttons and cards

#### WaveSystem (`wave-system.js`)
- Canvas-based wave background
- Performance-adaptive rendering
- Click ripple effects
- Lifecycle management for wave regeneration

#### NavigationManager (`navigation.js`)
- Smooth scrolling navigation
- Active section tracking
- Burger menu interactions
- Flip card behaviors

#### TestimonialManager (`testimonials.js`)
- Automatic testimonial cycling
- Smooth content transitions

#### EffectsManager (`effects.js`)
- Click ripple effects
- Visual feedback systems

## Browser Support

- Modern browsers with ES6+ support
- Canvas 2D API support for wave animations
- CSS Grid and Flexbox support
- Intersection Observer API for scroll tracking

## Performance Considerations

- **Adaptive Quality**: Wave system automatically reduces quality on slower devices
- **Efficient Animations**: Uses Motion One for hardware-accelerated animations
- **Optimized Images**: Properly sized images with appropriate formats
- **Modular Loading**: CSS and JS separated for efficient caching

## Customization

### Colors
Edit CSS variables in `css/main.css` to change the color scheme:
```css
:root {
    --earthy-olive: #6F7640;
    --golden-warmth: #BB9743;
    --soft-sage: #C9D5B5;
    /* ... etc */
}
```

### Wave System
Modify wave parameters in `js/wave-system.js`:
```javascript
this.waveCount = 7;           // Number of waves
this.baseColors = [...];      // Color palette
```

### Content
Update content directly in `index.html` - the clean structure makes it easy to modify text, images, and sections.

## Deployment

1. Ensure all files are uploaded to your web server
2. Verify that image paths are accessible
3. Test all interactive features across devices
4. Check that external CDN resources load properly (Motion One)

The website is designed to work without any build process - simply upload all files and it's ready to serve.
