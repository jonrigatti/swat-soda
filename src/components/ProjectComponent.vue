<template>
    <div>
        <v-container fluid>
            <v-card rounded>
                <v-card-title class="purple darken-3 pa-4 ma-0">
                    <h1>{{ project.name }}</h1>
                </v-card-title>
                <v-card-subtitle class="pa-2 ma-2">
                    {{ project.prioritySubmittals.length + project.unrankedSubmittals.length }} submittals
                </v-card-subtitle>
                <v-container fluid>
                    <v-row>
                        <v-col cols="6" align-self="start">

                            <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
                            <v-card-subtitle class="py-0">Priority Submittals</v-card-subtitle>
                            <VueDraggableNext v-model="project.prioritySubmittals" :group="project.name + 'Submittals'"
                                draggable=".item" handle=".handle" sort="true" @change="sortUpdate(project)" animation="250"
                                easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                                <v-card v-for="(s, index) in project.prioritySubmittals" :key="s._id"
                                    class="item draggable-item mb-2">
                                    <v-card-title class="py-1 handle">{{ index + 1 }}. {{ s.submittal.submittalID
                                    }}</v-card-title>
                                    <v-card-subtitle class="pt-5 pb-1 nondraggable-item">{{ s.submittal.description
                                    }}</v-card-subtitle>
                                    <v-card-text class="py-0 my-0 nondraggable-item">
                                        <v-text-field single-line v-model="s.driver" cols="8" label="Priority driver"
                                            class="mx-6" @change="sortUpdate(project)"></v-text-field>
                                    </v-card-text>
                                </v-card>
                                <!-- </transition-group> -->
                            </VueDraggableNext>
                        </v-col>
                        <v-col cols="6" align-self="start">
                            <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
                            <v-card-subtitle class="py-0">Unranked Submittals</v-card-subtitle>
                            <!-- <draggable v-model="project.unrankedSubmittals" :group="project.name + 'Submittals'" draggable=".item" sort="true" @change="sortUpdate(project)" animation="250" easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                            <v-card v-for="s in project.unrankedSubmittals" :key="s.driver" class="item draggable-item mb-2">
                                <v-card-title class="py-1 handle">{{s.submittal.submittalID }}</v-card-title>
                                <v-card-subtitle class="pt-5 pb-1 nondraggable-item">{{ s.submittal.description }}</v-card-subtitle>
                            </v-card>
                        </draggable> -->
                            <VueDraggableNext v-model="project.unrankedSubmittals" :group="project.name + 'Submittals'"
                                draggable=".item" handle=".handle" sort="true" @change="sortUpdate(project)" animation="250"
                                easing="cubic-bezier(1, 0, 0, 1)" ghostClass="ghost">
                                <v-card v-for="(s, index) in project.unrankedSubmittals" :key="s._id"
                                    class="item draggable-item mb-2">
                                    <v-card-title class="py-1 handle">{{ index + 1 }}. {{ s.submittal.submittalID
                                    }}</v-card-title>
                                    <v-card-subtitle class="pt-5 pb-1 nondraggable-item">{{ s.submittal.description
                                    }}</v-card-subtitle>
                                    <v-card-text class="py-0 my-0 nondraggable-item">
                                        <v-text-field single-line v-model="s.driver" cols="8" label="Priority driver"
                                            class="mx-6" @change="sortUpdate(project)"></v-text-field>
                                    </v-card-text>
                                </v-card>
                                <!-- </transition-group> -->
                            </VueDraggableNext>
                        </v-col>
                        <v-col cols="12">
                            <v-card-subtitle class="pa-2 ma-2">
                                {{ project.contracts.length }} contracts
                            </v-card-subtitle>
                            <!-- <div v-for="contract in project.contracts" :key="contract.contractID">
                                {{ contract.contractID }}
                            </div> -->
                            <!-- <v-list lines="true" density="compact" item-title="contractID" max-width="200">
                                <v-list-item v-for="(item, i) in project.contracts" :key="i" :value="item" color="primary"
                                    rounded="xl">
                                    <v-list-item-title v-text="item.contractID"></v-list-item-title>
                                    <template v-slot:append>
                                        <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn>
                                    </template>
                                </v-list-item>
                            </v-list> -->
                            <v-sheet max-width="300">
                                <v-expansion-panels class="my-4" variant="popout">
                                    <v-expansion-panel v-for="contract in project.contracts" :key="contract.contractID"
                                        :title="contract.contractID">
                                        <v-expansion-panel-text>
                                            Lorem ipsum stuff and things and all that Latin jazz 'n'at.
                                            <v-card>
                                                <v-card-actions class="grey darken-4">
                                                    <v-spacer></v-spacer>
                                                    <v-btn icon @click="saveContract(contract)">
                                                        <v-icon>mdi-content-save-edit</v-icon>
                                                    </v-btn>
                                                    <v-btn icon>
                                                        <v-icon>mdi-archive-plus</v-icon>
                                                    </v-btn>
                                                    <v-btn icon>
                                                        <v-icon>mdi-file-pdf-box</v-icon>
                                                    </v-btn>
                                                    <v-btn icon>
                                                        <v-icon>mdi-delete</v-icon>
                                                        <v-menu activator="parent" location="center">
                                                            <v-list>
                                                                <v-list-item>
                                                                    <v-btn icon
                                                                        @click="deleteContract(contract.contractID)"><v-icon>mdi-check</v-icon></v-btn>
                                                                </v-list-item>
                                                                <v-list-item>
                                                                    <v-btn icon><v-icon>mdi-cancel</v-icon></v-btn>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>

                                <v-expansion-panels class="my-4" variant="popout" v-model="newContractPanels">
                                    <v-expansion-panel value="addContract">
                                        <v-expansion-panel-title collapse-icon="mdi-minus" expand-icon="mdi-plus">Add
                                            contract</v-expansion-panel-title>
                                        <v-expansion-panel-text>
                                            <v-form @submit.prevent v-model="addContractForm">
                                                <v-text-field v-model="newContract" label="Contract ID" max-width="150"
                                                    :rules="rules.contractID"></v-text-field>
                                                <v-btn type="submit"
                                                    @click="project.contracts.push({ contractID: newContract }); projectsStore.updateSubmittalPriorities(project); addContractForm ? newContractPanels = [] : newContractPanels = newContractPanels;"><v-icon>mdi-check</v-icon>
                                                </v-btn>
                                            </v-form>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next';
import { useSubmittalsStore } from '../stores/SubmittalsStore';
import { useProjectsStore } from '../stores/ProjectsStore';
import { ref } from 'vue';
import _ from 'lodash';

const props = defineProps({
    project: {},
});

const project = ref(props.project);
// console.log(JSON.stringify(props.project));
// console.log(JSON.stringify(project._rawValue));

const submittalsStore = useSubmittalsStore();

const projectsStore = useProjectsStore();

const sortUpdate = (project) => {
    // console.log('priority: ' + JSON.stringify(project.prioritySubmittals));
    // console.log('unranked: ' + JSON.stringify(project.unrankedSubmittals));

    projectsStore.updateSubmittalPriorities(project);
    // emit('update-submittal-priorities', project)
}

const deleteContract = (contractID) => {
    console.log(`Try to delete ${contractID} contract`);
    console.log('Contracts: ' + JSON.stringify(project._rawValue.contracts));
    project._rawValue.contracts = _.reject(project._rawValue.contracts, contract => {
        return contract.contractID == contractID;
    });
    project._value.contracts = _.reject(project._value.contracts, contract => {
        return contract.contractID == contractID;
    });

    // console.log('New rawValue contract list: ' + JSON.stringify(project._rawValue.contracts));
    // console.log('New value contract list: ' + JSON.stringify(project._value.contracts));
    // console.log('New contract list: ' + JSON.stringify(project.contracts));
    
    projectsStore.updateContracts(project);
}

const addContractForm = ref(false);
const newContract = ref('');
const newContractPanels = ref([]);

const rules = {
    contractID: [
        value => {
            if (value) return true
            return 'You must enter a contract ID.'
        },
    ]
};
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