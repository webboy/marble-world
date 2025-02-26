<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Marblify
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// MainLayout component using script setup
</script>

<style>
.q-toolbar {
  min-height: 50px;
}

.q-toolbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.q-page-container {
  height: calc(100vh - 50px);
  overflow: hidden;
}
</style>
