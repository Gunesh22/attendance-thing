---
name: mobile_android_design
description: Master Material Design 3 and Jetpack Compose to build modern, adaptive Android applications.
---

# Android Mobile Design

Master Material Design 3 (Material You) and Jetpack Compose to build modern, adaptive Android applications that integrate seamlessly with the Android ecosystem.

## When to Use This Skill
- Designing Android app interfaces following Material Design 3
- Building Jetpack Compose UI and layouts
- Implementing Android navigation patterns (Navigation Compose)
- Creating adaptive layouts for phones, tablets, and foldables
- Using Material 3 theming with dynamic colors
- Building accessible Android interfaces

## Core Concepts

### 1. Material Design 3 Principles
- **Personalization**: Dynamic color adapts UI to user's wallpaper
- **Accessibility**: Tonal palettes ensure sufficient color contrast
- **Large Screens**: Responsive layouts for tablets and foldables

### 2. Jetpack Compose Layout System
Use Column and Row for arrangements.
`kotlin
// Vertical arrangement
Column(
    modifier = Modifier.padding(16.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp)
) {
    Text(text = "Title", style = MaterialTheme.typography.headlineSmall)
}
`

## Best Practices
1. **Use Material Theme**: Access colors via MaterialTheme.colorScheme
2. **Support Dynamic Color**: Enable dynamic color on Android 12+
3. **Adaptive Layouts**: Use WindowSizeClass
4. **Touch Targets**: Minimum 48dp
5. **State Hoisting**: Hoist state to make components reusable

## Common Issues
- **Recomposition**: Avoid unstable lambdas
- **State Loss**: Use ememberSaveable
- **Performance**: Use LazyColumn for lists

## Resources
- [Material Design 3](https://m3.material.io/)
- [Jetpack Compose Documentation](https://developer.android.com/jetpack/compose)
