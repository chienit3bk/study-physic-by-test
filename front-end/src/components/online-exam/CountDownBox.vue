<template lang="pug">
VueCountdown.qsc2-countdown-timer(
  v-if="time && time > 0",
  :time="time",
  :key="resetTimeKey",
  :transform="timeTransform",
  v-slot="{ hours, minutes, seconds }",
  @end="$emit('end-countdown')",
  @abort="emit('submit')",
)
  TextStyle(variation="strong") {{ $t('online_exam.time_remaining')}}{{ hours }}{{ minutes }}:{{ seconds }}
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueCountdown from '@chenfengyuan/vue-countdown';

defineProps({
  message: {
    type: String,
    default: '',
  },
  time: {
    type: Number,
    default: 0,
  },
  action: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['submit', 'end-countdown']);

const resetTimeKey = ref(1);

const timeTransform = (props: Record<string, any>) => {
  const formattedProps: Record<string, any> = {};
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'hours') {
      if (value) {
        formattedProps.hours = value < 10 ? `0${value}:` : `${value}:`;
      } else {
        formattedProps.hours = '';
      }
    } else {
      formattedProps[key] = value < 10 ? `0${value}` : value.toString();
    }
  });
  return formattedProps;
};

</script>
