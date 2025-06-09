<template>
    <div>        
        <v-card>
            <v-card-title class="pink pa-1 ma-0">
                <v-icon x-large color="pink lighten-4">mdi-magnify</v-icon>
                Submittal Query
            </v-card-title>
        
            <v-card-text>
                <v-container fluid>
                    <v-row>
                        <v-col>
                            <v-container fluid>
                                <v-row
                                    v-for="qf in queryFields"
                                    :key="qf.id"
                                    no-gutters
                                >
                                    <v-col>
                                        <v-select v-model="qf.andOr" :items="['and', 'or']" class="fit pa-1 ma-1"></v-select>
                                    </v-col>
                                    <v-col>
                                        <v-select v-model="qf.operator" item-title="text" item-value="value" :items="queryOperatorOptions" class="fit pa-1 ma-1"></v-select>    
                                    </v-col>
                                    <v-col cols="4">
                                        <v-select v-model="qf.key" label="Search field" item-title="text" item-value="value" :items="queryKeyOptions" class="pa-1 ma-1"></v-select>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-text-field v-model="qf.value" label="Value" class="pa-1 ma-1" v-show="qf.key.type != 'Date'"></v-text-field>
                                        <DatepickerComponent v-show="qf.key.type == 'Date'" :dateProp="qf.value" labelProp="Value" iconProp="mdi-calendar" @update-date="(date) => qf.value = date"/>
                                    </v-col>
                                    <v-col>
                                        <v-btn @click="deleteQueryField(queryFields.indexOf(qf))">
                                        <v-icon>mdi-minus</v-icon>
                                    </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-btn class="ma-2" @click="addQueryField">Add field</v-btn>
                                    <v-btn class="ma-2 green darken-1" @click="getDynamicQuery" v-show="fieldsComplete">Search!</v-btn>
                                </v-row>
                            </v-container>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
    import { computed, defineEmits, ref } from 'vue';
    import { useSubmittalsStore } from '../stores/SubmittalsStore';

    const submittals = useSubmittalsStore();

    // Data
    const expanded = ref(true);
    const keys = [
        { text: 'Submittal ID', value: 'submittalID' },
        { text: 'Need Date', value: 'needDate' },
        { text: 'Owner', value: 'owner' },
        { text: 'Contract', value: 'contract' }
    ];
    const queryFields = ref([{ id: Math.random() * 10000, key: '', value: '', andOr: 'and', operator: '$eq' }]);
    const queryKeyOptions = [        
        {
        text: 'Submittal ID',
        value: {
            name: 'submittalID',
            type: 'String'
            }
        },
        {
        text: 'Submittal description',
        value: {
            name: 'description',
            type: 'String'
            }
        },
        {
        text: 'Submittal need date',
        value: {
            name: 'needDate',
            type: 'Date'
            }
        },
        {
        text: 'Submittal received date',
        value: {
            name: 'receivedDate',
            type: 'Date'
            }
        },
        {
        text: 'Submittal disposition date',
        value: {
            name: 'dispositionDate',
            type: 'Date'
            }
        },
        {
        text: 'Submittal owner',
        value: {
            name: 'owner',
            type: 'String'
            }
        },
        {
        text: 'Violation category',
        value: {
            name: 'violations.category',
            type: 'String'
            }
        },
        {
        text: 'Violation limit',
        value: {
            name: 'violations.limit',
            type: 'Number'
            }
        },
        {
        text: 'Violation actual',
        value: {
            name: 'violations.actual',
            type: 'Number'
            }
        },
        {
        text: 'Violation reference',
        value: {
            name: 'violations.reference',
            type: 'String'
            }
        }
    ];
    const queryOperatorOptions = [        
        {
        text: '=',
        value: '$eq'
        },
        {
        text: '>',
        value: '$gt'
        },
        {
        text: '>=',
        value: '$gte'
        },
        {
        text: '<',
        value: '$lt'
        },
        {
        text: '<=',
        value: '$lte'
        },
        {
        text: '!=',
        value: '$ne'
        }
    ];
    const fieldsComplete = computed(() => {
        if(queryFields.value.length == 0 || queryFields.value[queryFields.value.length - 1].value != ''){
            return true;
        }
        else{
            return false;
        }
    });

    const addQueryField = () => {
        if(fieldsComplete.value){
            queryFields.value.push({ id: Math.random() * 10000, key: '', value: '', andOr: 'and', operator: '$eq' })
        }
        console.log(JSON.stringify(queryFields));
    }

    const deleteQueryField = (index) => {
        queryFields.value.splice(index, 1)     
    }

    const getDynamicQuery = () => {
        console.log('Search: ' + JSON.stringify(queryFields.value));
        submittals.getDynamicQuery(queryFields.value);
    }
</script>

<style scoped>
.toggleUpDown {
    transition: transform .3s ease-in-out !important;  
}
.toggleUpDown.rotate {
    transform: rotate(180deg);
}
</style>