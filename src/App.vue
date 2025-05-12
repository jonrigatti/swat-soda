<template>
  <v-app dark>
    <HeaderComponent></HeaderComponent>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import { useSubmittalsStore } from './stores/SubmittalsStore';
  import { useProjectsStore } from './stores/ProjectsStore';

  const submittals = useSubmittalsStore();
  submittals.getSubmittals();

  const projects = useProjectsStore();
  projects.getProjects();
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
  }

  .v-card__title {
    background: linear-gradient(74deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25))
  }

  .v-toolbar {
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25))
  }

  .v-expansion-panel-header {
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.25))
  }
</style>
