<template>
    <div>
        <v-card class="rounded-t-xl">
            <v-toolbar :color="color">
                <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

                <v-toolbar-title>{{ submittal.submittalID }}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon @click="(v) => expanded = !expanded">
                    <v-icon class="toggleUpDown" :class='{ "rotate": !expanded }'>mdi-chevron-up</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- <v-card-title :color="color" :class="`${color} pa-2`">
                <h2>{{ submittal.submittalID }}</h2>
                <v-spacer></v-spacer>

            </v-card-title> -->
            <v-card-text>
                <v-text-field v-model.lazy="submittal.description" label="Description"></v-text-field>
                <v-container class="pa-0 ma-0">
                    <v-row>
                        <v-col>
                            <v-text-field v-model.lazy="submittal.owner" label="Owner"></v-text-field>
                            <PriorityMenuComponent :submittalProp="submittal" :color="color" :showLabel="true" />
                        </v-col>
                        <v-col>
                            <v-date-input v-model="submittal.receivedDate" dense clearable label="Received Date" prepend-icon="mdi-calendar-today"></v-date-input>
                            <v-date-input v-model="submittal.needDate" dense clearable label="Need Date" prepend-icon="mdi-calendar-clock"></v-date-input>
                            <v-date-input v-model="submittal.dispositionDate" dense clearable label="Disposition Date" prepend-icon="mdi-calendar-check"></v-date-input>
                            <!-- <DatepickerComponent :dateProp="submittal.receivedDate" labelProp="Received Date"
                                iconProp="mdi-calendar-today" @update-date="(date) => submittal.receivedDate = date" />
                            <DatepickerComponent :dateProp="submittal.needDate" labelProp="Need Date"
                                iconProp="mdi-calendar-clock" @update-date="(date) => submittal.needDate = date" />
                            <DatepickerComponent :dateProp="submittal.dispositionDate" labelProp="Disposition Date"
                                iconProp="mdi-calendar-check" @update-date="(date) => submittal.dispositionDate = date" /> -->
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card class="py-1" v-if="expanded">
                <v-card-title class="pa-2">Stakeholders</v-card-title>
                <v-card-text>
                    <StakeholdersComponent :stakeholders="submittal.stakeholders" />
                </v-card-text>
            </v-card>
            <v-card class="py-1" v-if="expanded">
                <v-card-title class="pa-2">
                    <ViolationsComponent :violations="submittal.violations" />
                </v-card-title>
                <v-card-text>
                    <ViolationsComponent :violations="submittal.violations" @add-violation="addViolation($event, index)" />
                </v-card-text>
            </v-card>
            <v-card-actions class="grey darken-4">
                <v-spacer></v-spacer>
                <v-btn icon @click="saveSubmittal(submittal)">
                    <v-icon>mdi-content-save-edit</v-icon>
                </v-btn>
                <v-btn icon @click="createSDF(submittal)">
                    <v-icon>mdi-archive-plus</v-icon>
                </v-btn>
                <v-btn icon @click="createPDF(submittal)">
                    <v-icon>mdi-file-pdf-box</v-icon>
                </v-btn>
                <v-btn icon @click="mergePDF(submittal)">
                    <v-icon>mdi-vector-combine</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { useSubmittalsStore } from '../stores/SubmittalsStore';
import { useProjectsStore } from '../stores/ProjectsStore';
import ServerDataService from '../services/ServerDataService';
import { ref, computed } from 'vue';

const props = defineProps({
    submittal: {},
    color: {
        type: String,
        default: function () {
            return 'cyan'
        }
    }
});

const submittalsStore = useSubmittalsStore();

const projectsStore = useProjectsStore();

// Data
const expanded = ref(false);
const drag = ref(false);

// Methods
const saveSubmittal = (submittal) => {
    // console.log('Submittals: ' + JSON.stringify(submittal));
    submittalsStore.updateSubmittal(submittal);
}

const addViolation = (violation, index) => {
    submittalsStore.submittals.find(submittal => submittal._id === filteredSubmittals.value[index]._id).violations.push(violation);
}

const createSDF = (submittal) => {
    // console.log('Submittals: ' + JSON.stringify(submittal))
    // emit('create-SDF', submittal)

    ServerDataService.createSDF(submittal._id, submittal)
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
}

const createPDF = (submittal) => {
    ServerDataService.createPDF(submittal._id, submittal)
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    // emit('create-PDF', submittal)
}

const mergePDF = (submittal) => {
    ServerDataService.mergePDF(submittal._id, submittal)
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    // emit('merge-PDF', submittal)
}

const testDirectory = () => {
    ServerDataService.testDir()
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
}
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
}

.nondraggable-item {
    user-select: none;
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

.toggleUpDown {
    transition: transform .3s ease-in-out !important;
}

.toggleUpDown.rotate {
    transform: rotate(180deg);
}
</style>