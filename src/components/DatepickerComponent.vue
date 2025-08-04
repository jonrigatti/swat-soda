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
                    :model-value="dateConst"
                    class="my-2"
                    density="compact"
                    min-width="200"
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
                hide-header
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
    const dateConst = ref(dayjs(props.dateProp).isValid() ? dayjs(props.dateProp).format('M/D/YYYY').toString() : '');
    
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
        dateConst.value = dayjs(date).format('M/D/YYYY').toString()
        console.log(props.dateProp);
        console.log(dateConst.value);
        emit('update-date', props.returnISODate ? dayjs(date).toISOString() : dayjs(date).format('MM/DD/YYYY'));
    }
    const emit = defineEmits(['update-date']);
</script>

<style scoped>

</style>