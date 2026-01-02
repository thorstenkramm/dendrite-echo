<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

defineProps<{
  title: string
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-muted-foreground" data-cy="coming-soon">coming soon</p>
    </CardContent>
  </Card>
</template>
