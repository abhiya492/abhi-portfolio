# Fonts Directory

This directory contains font files used in the project's 3D components.

## Font Loading Strategy

The project has implemented a multi-layered fallback approach for fonts:

1. **Primary Option**: Load Three.js JSON fonts from CDN (helvetiker_regular)
2. **Secondary Option**: Load web fonts (.woff2) from Google Fonts CDN
3. **Tertiary Option**: Use system fonts (Arial, sans-serif) through HTML fallback

## Error Handling

All font loading includes error handling to gracefully degrade the experience while maintaining functionality. If a font fails to load, the system will automatically try the next fallback option.

## Adding New Fonts

To add a new Three.js compatible font:

1. Convert your font to Three.js JSON format using the [facetype.js](https://gero3.github.io/facetype.js/) converter
2. Place the JSON file in this directory
3. Update the font paths in your components

For web fonts, you can use Google Fonts or other CDN-hosted fonts with the correct CORS headers.

## Included Fonts

- inter-bold.json - Used for 3D text (if available)
- inter-medium.json - Alternative 3D font

## Troubleshooting

If you encounter font loading issues:

1. Verify the font files exist and are properly formatted
2. Check network requests for any CORS issues
3. Try using one of the CDN-hosted fallback fonts
4. Ensure the ThreeProvider is properly initializing the font context 