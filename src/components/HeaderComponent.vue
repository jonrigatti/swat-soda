<template>
  <v-app-bar app fixed color="pink darken-4" dark dense rounded>
    <template v-slot:img="{ props }">
      <v-img v-bind="props" gradient="to top right, rgba(57, 17, 68,.7), rgba(172, 88, 166,.7)"></v-img>
    </template>

    <v-app-bar-title class="title">
      Submittal Workflow and Tracking
      <v-icon>mdi-bug-outline</v-icon>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="appStore.submittalSearch = true" v-show="appStore.submittalSearch == false">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon @click="appStore.submittalSearch = false" v-show="appStore.submittalSearch == true">
      <v-icon>mdi-magnify-close</v-icon>
    </v-btn>

    <v-btn-toggle v-model="appStore.submittalView" rounded mandatory>
      <v-btn icon value="cards">
        <v-icon>mdi-cards</v-icon>
      </v-btn>
      <v-btn icon value="table">
        <v-icon>mdi-table</v-icon>
      </v-btn>
      <v-btn icon value="calendar">
        <v-icon>mdi-calendar</v-icon>
      </v-btn>
    </v-btn-toggle>

    <v-btn icon>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item prepend-icon="mdi-plus" to="/addsubmittal">
            <v-list-item-title>Add submittal</v-list-item-title> 
          </v-list-item>
          <v-list-item prepend-icon="mdi-baguette">
            <v-list-item-title>This is a baguette</v-list-item-title> 
          </v-list-item>
          <v-list-item prepend-icon="mdi-candy">
            <v-list-item-title>This is candy</v-list-item-title> 
          </v-list-item>
          <v-list-item prepend-icon="mdi-cog">
            <v-list-item-title>Settings</v-list-item-title> 
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <template v-slot:extension>
      <v-tabs>
        <v-tab to="/">Home</v-tab>
        <v-tab to="/submittals">Submittals</v-tab>
        <v-tab to="/projects">Projects</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useAppStore } from '../stores/AppStore';

const appStore = useAppStore();
</script>

<style scoped>
.title {
  flex-grow: 10;
  color: var(--text-reverse);
  text-overflow: show;
  user-select: none;
}
</style>
