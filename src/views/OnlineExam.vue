<template lang="pug">
.online-exam
  Page(
    :full-width="true"
    title="Online Exam"
    subtitle="50 minutes"
    :breadcrumbs="[{content: 'DashBoard', url: '/'}]"
  )
    Layout
      LayoutSection(:one-third="true")
        Card() ABC
      LayoutSection()
        Card
          template(#title)
            Text(
              as="h3"
              variant="heading2xl"
              alignment="center"
            ) Đề thi
</template>
<script setup lang="ts">

</script>