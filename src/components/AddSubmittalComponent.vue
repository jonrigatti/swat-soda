<template>
    <div>
        <v-fab icon="mdi-plus" :absolute="true" location="top end"></v-fab>
        <v-sheet class="pa-4 mx-auto" max-width="70%" width="100%">
            <v-form @submit.prevent>
                <v-container class="pa-0 ma-0">
                    <v-row align-content="start">
                        <v-col cols="3">
                            <v-text-field v-model="submittal.submittalID" :rules="rules.submittalID"
                                label="Submittal ID"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field v-model.lazy="submittal.description" label="Description"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
                <v-container class="pa-0 ma-0">
                    <v-row>
                        <v-col cols="3">
                            <v-text-field v-model.lazy="submittal.owner" label="Owner"></v-text-field>
                            <v-card-title class="pa-2">Projects</v-card-title>
                            <v-btn-toggle color="primary" multiple v-model="submittalProjects">
                                <v-btn v-for="project in _.sortBy(projectsStore.projects,['name'])" :key="project.name" :value="project.name">
                                    {{ project.name }}
                                </v-btn>
                            </v-btn-toggle>
                            <!-- <PriorityMenuComponent :submittalProp="submittal" color="green" :showLabel="true" /> -->
                        </v-col>
                        <v-col cols="3">
                            <!-- <v-date-input v-model="submittal.receivedDate" dense width="300" label="Received Date"
                                prepend-icon="mdi-calendar-today"></v-date-input>
                            <v-date-input v-model="submittal.needDate" dense width="300" label="Need Date"
                                prepend-icon="mdi-calendar-clock"></v-date-input>
                            <v-date-input v-model="submittal.dispositionDate" dense width="300" label="Disposition Date"
                                prepend-icon="mdi-calendar-check"></v-date-input> -->
                            <DatepickerComponent :dateProp="submittal.receivedDate" labelProp="Received Date"
                                iconProp="mdi-calendar-today" @update-date="(date) => submittal.receivedDate = date" />
                            <DatepickerComponent :dateProp="submittal.needDate" labelProp="Need Date"
                                iconProp="mdi-calendar-clock" @update-date="(date) => submittal.needDate = date" />
                            <DatepickerComponent :dateProp="submittal.dispositionDate" labelProp="Disposition Date"
                                iconProp="mdi-calendar-check" @update-date="(date) => submittal.dispositionDate = date" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-card-title class="pa-2">Stakeholders</v-card-title>
                        </v-col>
                    </v-row>
                    <v-row>
                        <StakeholdersComponent :stakeholders="submittal.stakeholders" />

                    </v-row>
                    <v-row>
                        <v-card-title class="pa-2">
                            Violations
                        </v-card-title></v-row>
                    <v-row>
                        <ViolationsComponent :violations="submittal.violations"
                            @add-violation="addViolation($event, index)" />
                    </v-row>
                </v-container>
                <v-btn class="mt-2" type="submit" block>Save submittal</v-btn>
            </v-form>
        </v-sheet>

    </div>
</template>

<script setup>
import { useSubmittalsStore } from '../stores/SubmittalsStore';
import { useProjectsStore } from '../stores/ProjectsStore';
import ServerDataService from '../services/ServerDataService';
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import _ from 'lodash';

// const props = defineProps({
//     submittal: {},
//     color: {
//         type: String,
//         default: function () {
//             return 'cyan'
//         }
//     }
// });

const submittalsStore = useSubmittalsStore();

const projectsStore = useProjectsStore();

// Data
const expanded = ref(false);
const drag = ref(false);
const submittal = ref({
    submittalID: '',
    description: '',
    receivedDate: dayjs().toString(),
    needDate: '',
    dispositionDate: '',
    owner: '',
    violations: [

    ],
    stakeholders: [

    ]
});
const submittalProjects = ref([])
const rules = {
    submittalID: [
        value => {
            if (value) return true
            return 'You must enter a submittal ID.'
        },
    ]
};

// Methods
const saveSubmittal = (submittal) => {
    // console.log('Submittals: ' + JSON.stringify(submittal));
    submittalsStore.updateSubmittal(submittal);
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