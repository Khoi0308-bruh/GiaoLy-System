<template>
  <div>Redirecting...</div>
</template>

<script setup>
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/login')
    }
  ]
})
</script>
