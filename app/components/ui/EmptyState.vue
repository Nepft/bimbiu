<script setup lang="ts">
interface Props {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

defineProps<Props>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <AppCard variant="tint" padding="lg" class="state-card">
    <BimbiuIllustration name="telescope" />
    <h2 class="state-card__title">
      {{ title }}
    </h2>
    <p class="state-card__desc">
      {{ description }}
    </p>
    <div v-if="actionLabel" class="state-card__action">
      <AppButton v-if="actionTo" variant="accent" :to="actionTo">
        {{ actionLabel }}
      </AppButton>
      <AppButton v-else variant="accent" @click="emit('action')">
        {{ actionLabel }}
      </AppButton>
    </div>
  </AppCard>
</template>

<style scoped>
.state-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.state-card__title {
  font-size: var(--text-h2);
}

.state-card__desc {
  color: var(--text-secondary);
  max-width: 60ch;
}

.state-card__action {
  padding-top: var(--space-1);
}
</style>
