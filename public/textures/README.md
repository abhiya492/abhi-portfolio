# Textures Directory

This directory contains texture files used in the 3D components of the project.

## Texture Loading Strategy

The project implements a robust fallback system for texture loading:

1. First tries to load the requested texture from file
2. If loading fails, falls back to a programmatically generated canvas texture
3. These fallbacks are categorized by type (noise, particle, default)

## Generated Fallbacks

For missing texture files, the system will generate appropriate fallbacks:

- **Noise Texture**: Random grayscale pixels creating a noise pattern
- **Particle Texture**: A circular gradient for particle effects
- **Default Texture**: A simple white texture

## Adding New Textures

When adding new textures:

1. Place them in this directory
2. Use descriptive names that indicate their purpose (e.g., `noise.jpg`, `particle.png`)
3. Consider including the texture type in the filename for automatic fallback type detection

## Troubleshooting

If textures aren't loading properly:

1. Check that the file exists and is a valid image format
2. Verify the path is correct in your components
3. Look for console warnings about fallback textures being used
4. If you see "Error loading texture", check the network tab for 404 errors 