<template>
	<div>
		<v-expansion-panels
			flat
			multiple
			class="condensed"
		>
			<v-expansion-panel
				v-for="violation in violations" :key="violation._id"
			>
				<v-expansion-panel-title class="red darken-4">
					Violation #{{ violations.indexOf(violation) + 1 }}
				</v-expansion-panel-title>
				<v-expansion-panel-text>
					<v-form>
						<div class="subtitle-1 py-0">Category</div>
						<v-autocomplete
							:items="violationCategories"
							multiple
							required
							v-model="violation.category"
							class="body-2 px-2 py-0"
						></v-autocomplete>
						<v-container>
							<v-row>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Limit</div>
									<v-text-field
										v-model.number="violation.limit"
										density="compact"
										class="body-2 px-2 py-0"
									>
									</v-text-field>
								</v-col>      
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Actual</div>
									<v-text-field
										v-model.number="violation.actual"
										density="compact"
										class="body-2 px-2 py-0"
									>
							</v-text-field>
								</v-col>
							</v-row>
						</v-container>

						<div class="subtitle-1 py-2">Reference</div>
						<v-container
							v-if="violation.reference.drawing != null"
							class="pl-6 py-2"
						>
							<v-row>
								<v-col class="pa-0 ma-0">							
									<div class="subtitle-1 py-0">Drawing</div>
									<v-text-field
										v-model="violation.reference.drawing"
										density="compact"
										class="body-2 px-2 py-0"
									>
									</v-text-field>
								</v-col>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Coordinates</div>
										<v-text-field
											v-model="violation.reference.coordinates"
											density="compact"
											class="body-2 px-2 py-0"
										>
										</v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Revision</div>
										<v-text-field
											v-model="violation.reference.revision"
											density="compact"
											class="body-2 px-2 py-0"
										>
										</v-text-field>
								</v-col>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Date</div>
										<v-text-field
											v-model="violation.reference.date"
											density="compact"
											class="body-2 px-2 py-0"
										>
										</v-text-field>
								</v-col>
							</v-row>
						</v-container>
						<v-container
							v-if="violation.reference.chapter != null"
							class="pl-6 py-2"
						>						
							<v-row>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Chapter</div>
									<v-text-field
										v-model="violation.reference.chapter"
										density="compact"
										class="body-2 px-2 py-0"
									>
									</v-text-field>
								</v-col>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Paragraph</div>
									<v-text-field
										v-model="violation.reference.paragraph"
										density="compact"
										class="body-2 px-2 py-0"
									>
									</v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Revision</div>
									<v-text-field
										v-model.number="violation.reference.revision"
										density="compact"
										class="body-2 px-2 py-0"
									>
									</v-text-field>
								</v-col>
								<v-col class="pa-0 ma-0">
									<div class="subtitle-1 py-0">Date</div>
									<v-text-field
										v-model="violation.reference.date"
										density="compact"
										class="body-2 px-2 py-0"
									>
									</v-text-field>									
								</v-col>
							</v-row>
						</v-container>
					</v-form>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
		<v-row justify="center" class="py-6">
			<v-dialog
				v-model="dialog"
				persistent
				max-width="600px"
			>
				<template v-slot:activator="{ props }">
					<v-btn
						icon
						v-bind="props"
						class="ma-3"
					>
						<v-icon>mdi-alert-plus</v-icon>
					</v-btn>
				</template>
				<v-card>
					<v-card-title>
						<span class="text-h5">New Violation</span>
					</v-card-title>
					<v-card-text>
					<v-container>
						<v-row dense>
							<v-col cols="12">
								<v-btn-toggle
									v-model="referenceType"
									tile
									group
									mandatory
								>
									<v-btn value="code">Code</v-btn>
									<v-btn value="drawing">Drawing</v-btn>
								</v-btn-toggle>
							</v-col>
							<v-col cols="12">
								<v-autocomplete
									:items="['Skiing', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Foosball']"
									label="Category"
									multiple
									required
									v-model="newViolation.category"
								></v-autocomplete>
							</v-col>
							<v-col cols="12">
								<v-text-field
									label="Limit"
									density="compact"
									required
									v-model.number="newViolation.limit"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field
									label="Actual"
									density="compact"
									required
									v-model.number="newViolation.actual"
								></v-text-field>
							</v-col>         
							<v-col cols="12" v-if="referenceType==='code'">
								<v-text-field
									label="Chapter"
									density="compact"
									required
									v-model="newViolation.reference.chapter"
								></v-text-field>
							</v-col>               
							<v-col cols="12" v-if="referenceType==='code'">
								<v-text-field
									label="Paragraph"
									density="compact"
									required                                
									v-model="newViolation.reference.paragraph"
								></v-text-field>
							</v-col>
							<v-col cols="12" v-if="referenceType==='drawing'">
								<v-text-field
									label="Drawing"
									density="compact"
									required
									v-model="newViolation.reference.drawing"
								></v-text-field>
							</v-col>
							<v-col cols="12" v-if="referenceType==='drawing'">
								<v-text-field
									label="Coordinates"
									density="compact"
									required                                
									v-model="newViolation.reference.coordinates"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field
									label="Revision"
									density="compact"
									required                                
									v-model.number="newViolation.reference.revision"
								></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field
									label="Date"
									density="compact"
									required                                
									v-model="newViolation.reference.date"
								></v-text-field>
							</v-col>
						</v-row>
					</v-container>
					<small>*indicates required field</small>
					</v-card-text>
					<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="red darken-1"
						text
						@click="dialog = false"
					>
						Close
					</v-btn>
					<v-btn
						color="green darken-1"
						text
						@click="addViolation()"
					>
						Save
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
	</div>
</template>

<script setup>	
	// import { useSubmittalsStore } from '../stores/SubmittalsStore'
	import { ref, computed } from 'vue'

	const props = defineProps({
		violations: Array
	});
	
	const emit = defineEmits(['add-violation']);

	// Data
	const selectedItem = ref([]);
	const dialog = ref(false);
	const referenceType = ref('code');
	const newViolation = ref({
		category: '',
		limit: '',
		actual: '',
		reference: {
			chapter: '',
			paragraph: '',
			drawing: '',
			coordinates: '',
			revision: '',
			date: ''
		}
	});
	const violationCategories = ['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump'];

	// Methods

	const addViolation = () => {
		dialog.value = false
		var nv = newViolation.value
		switch(referenceType.value) {
			case 'code':
				// console.log('Hey it be a code boye')
				delete nv.reference.drawing;
				delete nv.reference.coordinates;
				break;
			case 'drawing':                        
				// console.log('Hey it be a draw boye')
				delete nv.reference.chapter;
				delete nv.reference.paragraph;
				break;
		}
		
		emit('add-violation', nv)
	}

	// export default {
	// 	name: "Violations",
	// 	data: () => ({
	// 		selectedItem: [],
	// 		dialog: false,
	// 		referenceType: 'code',
	// 		newViolation: {
	// 			category: '',
	// 			limit: '',
	// 			actual: '',
	// 			reference: {
	// 				chapter: '',
	// 				paragraph: '',
	// 				drawing: '',
	// 				coordinates: '',
	// 				revision: '',
	// 				date: ''
	// 			}
	// 		},
	// 	}),
	// 	methods: {
	// 		addViolation () {
	// 			this.dialog = false
	// 			var nv = this.newViolation
	// 			switch(this.referenceType) {
	// 				case 'code':
	// 					console.log('Hey it be a code boye')
	// 					delete nv.reference.drawing;
	// 					delete nv.reference.coordinates;
	// 					break;
	// 				case 'drawing':                        
	// 					console.log('Hey it be a draw boye')
	// 					delete nv.reference.chapter;
	// 					delete nv.reference.paragraph;
	// 					break;
	// 			}
				
	// 			this.$emit('add-violation', nv)
	// 		}
	// 	},
	// 	props: {
	// 		violations: Array,
	// 	},
	// 	emits: ['add-violation']
	// }
</script>

<style scoped>
	.v-expansion-panels.condensed .v-expansion-panel-header {
	padding-top: 4px;
	padding-bottom: 4px;
	min-height: auto;
	}
	.v-expansion-panels.condensed
	.v-expansion-panel--active
	.v-expansion-panel-header {
	padding-top: 12px;
	padding-bottom: 12px;
	}
	.v-expansion-panels.condensed .v-expansion-panel--active:not(:first-child),
	.v-expansion-panels.condensed .v-expansion-panel--active + .v-expansion-panel {
	margin-top: 4px;
	}
</style>