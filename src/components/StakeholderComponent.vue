<template>
    <div>
        <v-card class="pa-0 ma-2" width="250">
            <v-card-title class="cyan pa-2 ma-0">
                <v-text-field v-model="stakeholder.organization" placeholder="Organization" class="pa-0 ma-0" style="font-size: 1.5em;" dense></v-text-field>
            </v-card-title>
            <v-card-text class="px-2 py-0">
                <v-text-field
                    v-model="stakeholder.name"
                    placeholder="Name"
                    class="my-2"
                    dense
                ></v-text-field>
                <v-select
                    v-model="stakeholder.reviewType"
                    :items="['Information', 'Independent', 'Manager', 'Peer']"
                    label="Review type"
                    dense
                ></v-select>
                <DatepickerComponent :date-prop="stakeholder.requestedDate" labelProp="Requested Date" iconProp="mdi-calendar-start" @update-date="(date) => stakeholder.requestedDate = date" />
                <DatepickerComponent :date-prop="stakeholder.completedDate" labelProp="Completed Date" iconProp="mdi-calendar-check" @update-date="(date) => stakeholder.completedDate = date" />
            </v-card-text>
            <v-card-actions class="grey darken-4 py-0">
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    @click="deleteDialog = true"
                >
                    <v-icon>mdi-trash-can</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog
            v-model="deleteDialog"
            width="240"
            >
            <v-card>
                <v-card-title class="pa-2 red darken-2">
                    Delete Stakeholder
                </v-card-title>

                <v-card-text class="pa-3">
                    This will permanently delete the stakeholder after saving the submittal.
                </v-card-text>

                <v-card-actions class="pa-1">
                    <v-btn
                        color="primary"
                        text
                        @click="deleteDialog = false"
                    >
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn
                        color="red"
                        text
                        @click="deleteStakeholder"
                    >
                        <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import dayjs from 'dayjs';    
    // import Datepicker from './Datepicker.vue';

    const props = defineProps({
        stakeholder: {}
    });

    // Data
    const dateMenus = ref({
        requestedDate: false,
        completedDate: false
    });
    
    const requestedDate = ref(dayjs(props.stakeholder.requestedDate).isValid() ? dayjs(props.stakeholder.requestedDate).format('YYYY-MM-DD').toString() : '');
    const completedDate = ref(dayjs(props.stakeholder.completedDate).isValid() ? dayjs(props.stakeholder.completedDate).format('YYYY-MM-DD').toString() : '');

    const deleteDialog = ref(false);

    // Computed

    const formattedDate = (date) => {
        return computed(() => dayjs(date).isValid() ? dayjs(date).format('M/D/YYYY').toString() : '');
        // return computed(() => '');
    }

    const selectDate = (date, dateProp) => {
        dateMenus.value[dateProp] = false;
        deleteDialog.value = false;
        props.stakeholder[dateProp] = dayjs(date).toISOString();
    }

    const deleteStakeholder = () => {
        emit('delete-stakeholder');
    }

    const emit = defineEmits(['delete-stakeholder']);
</script>

<style scoped>

</style>