<template>
    <div>        
        <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
            <template v-slot:activator="{ props }">
                <v-text-field
                    :value="dateConst"
                    class="my-2"
                    dense
                    clearable
                    :label="labelProp"
                    :prepend-icon="iconProp"
                    readonly
                    v-bind="props"
                    @click:clear="deleteDate"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="dateConst"
                @update:modelValue="selectDate($event)"
            ></v-date-picker>
        </v-menu>
        
        <!-- <v-date-picker v-model="dateConst"></v-date-picker> -->
        <!-- {{ df }} -->
        <!-- <v-date-input
            v-model="dateConst"
            clearable
            :label="labelProp"
            :prepend-icon="iconProp"
        ></v-date-input> -->
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useDate } from 'vuetify';
    import dayjs from 'dayjs';

    const props = defineProps({
        dateProp: String,
        labelProp: String,
        iconProp: {
            type: String,
            default: 'mdi-calendar-blank'
        },
        returnISODate: {
            type: Boolean,
            default: true
        }
    });

    // Data
    const dateMenu = ref(false);
    
    // const date = useDate();
    // const df = dayjs(props.dateProp).format('YY-MM-DD').toString();
    const dateConst = ref(dayjs(props.dateProp).isValid() ? dayjs(props.dateProp).format('YYYY-MM-DD').toString() : '');
    
    // const d = useDate();
    // const dateConst = ref([d.format(props.dateProp, 'keyboardDate')]);

    const deleteDialog = ref(false);

    // Computed

    const formattedDate = (date) => {
        return computed(() => dayjs(date).isValid() ? dayjs(date).format('M/D/YYYY').toString() : '');
    }

    const deleteDate = () => {
        // props.dateProp = null;
        emit('update-date', null);
    }

    const selectDate = (date) => {
        dateMenu.value = false;
        deleteDialog.value = false;
        props.dateProp = dayjs(date).toISOString();
        console.log(props.dateProp);
        emit('update-date', props.returnISODate ? dayjs(date).toISOString() : dayjs(date).format('MM/DD/YYYY'));
    }
    const emit = defineEmits(['update-date']);
</script>

<style scoped>

</style>