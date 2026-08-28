<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const appConfig = useAppConfig()
const liturgicalToday = useState('liturgicalToday', () => null)

// Fetch today's liturgical state
const { data } = await useApiFetch('/Liturgical/today')
if (data.value) {
  liturgicalToday.value = data.value

  const colorMap = {
    green: 'emerald',
    red: 'rose',
    white: 'amber', // Gold-amber fits white liturgical feast perfectly and looks beautiful
    purple: 'violet',
    black: 'stone'
  }

  const themeColor = colorMap[data.value.liturgicalColor] || 'rose'
  appConfig.ui.colors.primary = themeColor
}
</script>
