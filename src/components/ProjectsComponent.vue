<template>
    <div>
        <v-toolbar dark color="grey darken-4" class="mb-1">
            <v-btn-toggle v-model="projectsToggle" dense background-color="primary" dark multiple>
                <v-btn v-for="project in _.sortBy(projectsStore.projects, ['name'])" :key="project.name"
                    :value="project.name">
                    {{ project.name }}
                </v-btn>
            </v-btn-toggle>
        </v-toolbar>

        <v-container fluid>
            <ProjectComponent v-for="project in _.sortBy(projectsStore.projects, ['name'])" :key="project.name" class="ma-2"
                v-show="projectsToggle.includes(project.name)" :project="project"></ProjectComponent>
        </v-container>
    </div>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next';
import { useSubmittalsStore } from '../stores/SubmittalsStore';
import { useProjectsStore } from '../stores/ProjectsStore';
import { ref } from 'vue';
import _ from 'lodash';

const submittalsStore = useSubmittalsStore();

const projectsStore = useProjectsStore();

// console.log('projects: ' + JSON.stringify(projects));

const projectsToggle = ref(projectsStore.projects.map(p => p.name));
</script>

<style scoped>
.v-select.fit {
    width: min-content;
}

.v-select.fit .v-select__selection--comma {
    text-overflow: unset;
}

.handle {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
}

.draggable-item {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
    user-select: none;
}

.nondraggable-item {
    user-select: none;
    cursor: default !important;
}

.ghost {
    opacity: 0.5;
    background: darkcyan;
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}
</style>