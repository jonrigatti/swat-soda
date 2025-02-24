<template>
    <div>
        <div class="d-flex flex-wrap justify-center" v-if="view == 'cards'">
            <div v-for="(stakeholder, index) in stakeholders" :key="stakeholder._id">
                <StakeholderComponent :stakeholder="stakeholder" @delete-stakeholder="deleteStakeholder(index)" />
            </div>
            <v-btn rounded width="200" height="100" class="align-self-center ma-2"
                @click="addingStakeholder = !addingStakeholder" v-show="!addingStakeholder">
                <v-icon x-large>mdi-plus</v-icon>
            </v-btn>
            <v-card v-if="addingStakeholder" class="pa-0 ma-0">
                <StakeholderComponent :stakeholder="newStakeholder" />
                <v-card-actions>
                    <v-btn @click="cancelNewStakeholder">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="addNewStakeholder">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>

        <div v-if="view == 'table'">
            <v-container fluid class="my-1">
                <v-data-table :headers="[
                    { title: 'Organization', align: 'start', key: 'organization' },
                    { title: 'Name', key: 'name' },
                    { title: 'Review Type', key: 'reviewType' },
                    { title: 'Requested Date', key: 'requestedDate'},
                    { title: 'Completed Date', key: 'completedDate'},
                    { title: '', key: 'deleteStakeholder', sortable: false }
                ]" :items="stakeholders" :sort-by="['organization', 'reviewType']" :sort-desc="[false, true]"
                    multi-sort disable-pagination hide-default-footer dense>
                    <template v-slot:[`item.organization`]="{ item }">
                        <v-text-field v-model="item.organization" compact variant="plain"></v-text-field>
                    </template>

                    <template v-slot:[`item.name`]="{ item }">
                        <v-text-field v-model="item.name" compact variant="plain"></v-text-field>
                    </template>
                    
                    <template v-slot:[`item.reviewType`]="{ item }">
                        <v-select
                            v-model="item.reviewType"
                            :items="['Information', 'Independent', 'Manager', 'Peer']"
                            compact variant="plain"
                        ></v-select>
                    </template>

                    <template v-slot:[`item.requestedDate`]="{ item }">
                        <DatepickerComponent :dateProp="item.requestedDate" iconProp="mdi-calendar-start"
                            @update-date="(date) => item.requestedDate = date" />
                    </template>

                    <template v-slot:[`item.completedDate`]="{ item }">
                        <DatepickerComponent :dateProp="item.completedDate" iconProp="mdi-calendar-check"
                            @update-date="(date) => item.completedDate = date" />
                    </template>

                    <template v-slot:[`item.deleteStakeholder`]="{ item }">
                        <v-btn icon @click="deleteTableStakeholder(item)">
                            <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:footer>
                        <v-divider></v-divider>
                        <div class="pa-2 d-flex justify-end">
                            <v-spacer></v-spacer>
                            <v-btn rounded @click="addingStakeholder = !addingStakeholder" v-show="!addingStakeholder">
                                Add stakeholder
                            </v-btn>

                            <v-card v-if="addingStakeholder" class="pa-0 ma-0">
                                <StakeholderComponent :stakeholder="newStakeholder" />
                                <v-card-actions>
                                    <v-btn @click="cancelNewStakeholder">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="addNewStakeholder">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </div>
                    </template>
                </v-data-table>
            </v-container>
        </div>

        <v-dialog v-model="deleteDialog" width="240">
            <v-card>
                <v-card-title class="pa-2 red darken-2">
                    Delete Stakeholder
                </v-card-title>

                <v-card-text class="pa-3">
                    This will permanently delete the stakeholder after saving the submittal.
                </v-card-text>

                <v-card-actions class="pa-1">
                    <v-btn color="primary" text @click="deleteDialog = false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn color="red" text @click="deleteTableStakeholderConfirm">
                        <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// For some reason setting newStakeholder to blankStakeholder pushes all the changes from newStakeholder to blankStakeholder
// const blankStakeholder = {
//     name: "",
//     organization: "",
//     requestedDate: "",
//     completedDate: ""
// };

const newStakeholder = ref({
    name: "",
    organization: "",
    requestedDate: "",
    completedDate: ""
});

const addingStakeholder = ref(false);

const props = defineProps({
    stakeholders: Array,
    view: {
        type: String,
        default: "cards"
    }
});

const addNewStakeholder = () => {
    props.stakeholders.push(newStakeholder.value);
    addingStakeholder.value = false;
    // console.log(blankStakeholder);
    newStakeholder.value = {
        name: "",
        organization: "",
        requestedDate: "",
        completedDate: ""
    };
}

const cancelNewStakeholder = () => {
    addingStakeholder.value = false;
    newStakeholder.value = {
        name: "",
        organization: "",
        requestedDate: "",
        completedDate: ""
    };
}

const deletingStakeholder = ref(-1);

const deleteTableStakeholderConfirm = () => {
    props.stakeholders.splice(deletingStakeholder.value, 1);
    deleteDialog.value = false;
    deletingStakeholder.value = -1;
}

const deleteTableStakeholder = (item) => {
    deletingStakeholder.value = props.stakeholders.indexOf(item);
    deleteDialog.value = true;
}

const deleteStakeholder = (index) => {
    props.stakeholders.splice(index, 1);
}

const deleteDialog = ref(false);

</script>

<style scoped></style>