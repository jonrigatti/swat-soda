<template>
  <div>
    <SubmittalSearchComponent v-show="appStore.submittalSearch" />
    <v-container fluid>
      <v-row>
        <v-col>
          <v-toolbar dark color="purple-darken-2" class="mb-0 d-flex justify-start"
            v-if="appStore.submittalView === 'cards'">
            <v-text-field v-model="search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify"
              label="Filter" class="pr-1" density="compact"></v-text-field>
            <template>
              <v-spacer></v-spacer>
              <v-select v-model="sortBy" flat solo-inverted hide-details :items="keys" prepend-inner-icon="mdi-sort"
                label="Sort by"></v-select>
              <v-spacer></v-spacer>
              <v-btn-toggle v-model="sortDesc" mandatory>
                <v-btn large depressed color="blue" :value="false">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn large depressed color="blue" :value="true">
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
          <v-sheet color="purple-darken-2" class="d-flex flex-wrap justify-start pa-2 mb-1" style="width: 100%;">
            <div class="pa-1">
              <v-btn-toggle v-model="projectFilter" dense background-color="primary" dark multiple>
                <v-btn color="purple" v-for="project in _.sortBy(projectsStore.projects, ['name'])" :key="project.name"
                  :value="project.name">
                  {{ project.name }}
                </v-btn>
              </v-btn-toggle>
              <v-btn dense color="red darken-3" @click="() => projectFilter = ['A', 'B', 'C', 'D']">
                All
              </v-btn>
              <v-btn dense color="red darken-3" @click="() => projectFilter = []">
                None
              </v-btn>
            </div>
            <div class="pa-1">
              <v-container>
                <v-row>
                  <v-btn-toggle v-model="unitSelect" multiple dense background-color="primary" dark>
                    <v-btn color="yellow darken-3" v-for="unit in units.sort()" :key="unit" :value="unit">
                      {{ unit }}
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn dense color="red darken-3" @click="() => submittalFilter.owner = filteredOwners.map(o => o.name)"
                    v-show="unitSelect != ''">
                    All
                  </v-btn>
                  <v-btn dense color="red darken-3" @click="() => submittalFilter.owner = []" v-show="unitSelect != ''">
                    None
                  </v-btn>
                  <!-- {{ submittalFilter.owner }} -->
                </v-row>
                <v-row class="d-inline-flex flex-wrap">
                  <v-item-group v-model="submittalFilter.owner" dense background-color="primary" multiple dark>
                    <v-item
                      v-for="owner in filteredOwners.sort(function (o1, o2) { return o1.name.substring(o1.name.indexOf(' ') + 1).localeCompare(o2.name.substring(o2.name.indexOf(' ') + 1)) })"
                      :key="owner.name" :value="owner.name">
                      <template v-slot:default="{ toggle }">
                        <v-btn color="grey-darken-3" class="pa-1 ma-1 text-capitalize" active-color="green"
                          :active="submittalFilter.owner.includes(owner.name)" small @click="toggle">
                          {{ owner.name.substring(owner.name.indexOf(' ') + 1) }}
                        </v-btn>
                      </template>
                    </v-item>
                  </v-item-group>
                </v-row>
              </v-container>
            </div>
            <div class="d-flex">
              <div class="pa-1">
                <v-btn-toggle dense background-color="primary" exclusive v-model="submittalFilter.peerReviewNeeded">
                  <v-btn dense color="red darken-3" :value="true">
                    Peer Needed
                  </v-btn>
                  <v-btn dense color="red darken-3" :value="false">
                    Peer Assigned
                  </v-btn>
                </v-btn-toggle>
              </div>
              <div class="pa-1">
                <v-btn-toggle dense background-color="primary" exclusive v-model="submittalFilter.nrInformed">
                  <v-btn dense color="blue darken-3" :value="true">
                    NR Informed
                  </v-btn>
                  <v-btn dense color="blue darken-3" :value="false">
                    NR Uninformed
                  </v-btn>
                </v-btn-toggle>
              </div>
              <div class="pa-1">
                <v-btn-toggle dense background-color="primary" exclusive v-model="submittalFilter.open">
                  <v-btn dense color="orange darken-3" :value="true">
                    Open
                  </v-btn>
                  <v-btn dense color="orange darken-3" :value="false">
                    Closed
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
            <!-- {{ submittalsStore.submittals.map(function(s) { u = Math.floor(Math.random()*units.length); n = {name: s.owner, unit: units[u], subdivision: subdivisions[Math.round(u/2)]}; return n;}) }} -->
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-iterator :items="filteredSubmittals" item-key="_id" :items-per-page="itemsPerPage" :page="page"
            :search="search" :sort-by="sortBy" :sort-desc="sortDesc" hide-default-footer
            v-if="appStore.submittalView === 'cards'">
            <template v-slot:default="{ items }">
              <v-row>
                <v-col v-for="(item) in items" :key="item._id" cols="12" sm="6" md="4" lg="3">
                  <SubmittalComponent :submittal="item.raw"
                    :color="submittalColor(item.raw.needDate, item.raw.dispositionDate)" />
                </v-col>
              </v-row>
            </template>
            <template v-slot:footer>
              <v-row class="mt-2" align="center" justify="center">
                <span class="grey--text">Submittals per page</span>
                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-btn dark text color="primary" class="ml-2" v-bind="props">
                      {{ itemsPerPage }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index"
                      @click="updateItemsPerPage(number)">
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-spacer></v-spacer>

                <span class="mr-4
                    grey--text">
                  Page {{ page }} of {{ numberOfPages === 0 ? 1 : numberOfPages }}
                </span>
                <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
            </template>
          </v-data-iterator>
        </v-col>
      </v-row>
    </v-container>


    <v-container fluid class="py-0 my-0" v-if="appStore.submittalView === 'table'">
      <v-data-table :headers="tableHeaders" :items="filteredSubmittals" item-key="submittalID"
        :sort-by="['submittalID', 'owner']" :sort-desc="[false, true]" multi-sort show-expand v-model:expanded="expanded">
        <template v-slot:[`item.submittalID`]="{ item }">
          <v-sheet :color="submittalColor(item.needDate, item.dispositionDate)" rounded
            class="d-flex justify-center pa-1 ma-0">{{ item.submittalID
            }}</v-sheet>
        </template>

        <template v-slot:[`item.description`]="props">
          <!-- <v-confirm-edit v-model="props.item.description"> -->
          <!--             
            {{ props.item.description }}
            <template v-slot:text>
              <v-text-field v-model="props.item.description" :rules="[maxchars]" label="Edit" single-line
                counter></v-text-field>
            </template> -->
          <!-- <template v-slot:default="{ model: proxyModel, actions }">

                  <v-text-field v-model="proxyModel.value" variant="plain" :rules="[maxchars]" single-line counter></v-text-field>

                  <component :is="actions"></component>
            </template>
          </v-confirm-edit> -->
          <v-text-field v-model="props.item.description" density="compact" variant="plain" :rules="[maxchars]" label="Edit"
            single-line counter></v-text-field>
        </template>

        <template v-slot:[`item.receivedDate`]="{ item }">
          <DatepickerComponent :dateProp="item.receivedDate" iconProp="mdi-calendar-today"
            @update-date="(date) => item.receivedDate = date" />
        </template>

        <template v-slot:[`item.needDate`]="{ item }">
          <DatepickerComponent :dateProp="item.needDate" iconProp="mdi-calendar-clock"
            @update-date="(date) => item.needDate = date" />
        </template>

        <template v-slot:[`item.dispositionDate`]="{ item }">
          <DatepickerComponent :dateProp="item.dispositionDate" iconProp="mdi-calendar-check"
            @update-date="(date) => item.dispositionDate = date" />
        </template>

        <template v-slot:[`item.priority`]="{ item }">
          <PriorityMenuComponent :submittalProp="item" :color="submittalColor(item.needDate, item.dispositionDate)" />
        </template>

        <template v-slot:[`item.save`]="{ item }">
          <v-btn icon @click="saveSubmittal(item)">
            <v-icon>mdi-content-save-edit</v-icon>
          </v-btn>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
          <td :colspan="columns.length" class="pa-0 ma-0">
            <v-card-title class="pa-2">Stakeholders</v-card-title>
            <StakeholdersComponent :stakeholders="item.stakeholders" view="table" />
            <v-card-title class="pa-2">Violations</v-card-title>
            <ViolationsComponent :violations="item.violations" />
          </td>
        </template>
      </v-data-table>
    </v-container>

    <v-container fluid class="py-0 my-0" v-if="appStore.submittalView === 'calendar'">
      <template>
        <v-row class="fill-height">
          <v-col>
            <v-sheet height="64">
              <v-toolbar flat>
                <v-btn fab text small color="grey darken-2" @click="calendar.prev()">
                  <v-icon>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <h1 style="user-select: none;">{{ dayjs(calendarDate).format('MMMM YYYY') }}</h1>
                <v-btn fab text small color="grey darken-2" @click="calendar.next()">
                  <v-icon>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </v-toolbar>
            </v-sheet>
            <v-sheet>
              <v-calendar ref="calendar" v-model="calendarDate" color="primary" type="month" :show-month-on-first="false"
                :events="submittalEvents" :event-more="false" :event-color="eventColor"
                @click:event="showEvent"></v-calendar>
              <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-y
                offset-overflow max-width="600">
                <SubmittalComponent :submittal="selectedEvent.submittal.raw" :color="eventColor(selectedEvent)" />
              </v-menu>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<!-- https://terabytetiger.com/lessons/moving-from-vue-2-to-vue-3-composition-api -->
<script setup>
import { useSubmittalsStore } from '@/stores/SubmittalsStore';
import { useProjectsStore } from '@/stores/ProjectsStore';
import { useAppStore } from '@/stores/AppStore';
import { ref, computed } from 'vue';
// import filter from 'lodash/filter';
import { filter } from 'smart-array-filter';
import { useDate } from 'vuetify';
import dayjs from 'dayjs';
import _ from 'lodash';

const submittalsStore = useSubmittalsStore();

const projectsStore = useProjectsStore();

const appStore = useAppStore();

// console.log(JSON.stringify(submittalsStore.submittals));
// console.log(JSON.stringify(projects.projects));

// Data
const calendar = ref(null);
// const calendarDate = ref([dayjs().format('YYYY-MM-DD').toString()]);
const calendarDate = ref([new Date()]);
const itemsPerPageArray = [5, 10, 20, 100];
const search = ref('');
const unitSelect = ref([]);
const submittalFilter = ref({
  peerReviewNeeded: null,
  nrInformed: null,
  owner: [],
  open: null
});
const projectFilter = ref(['A', 'B', 'C', 'D']);
const sortDesc = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = [{ key: ref('submittalID'), order: 'asc' }];
const keys = [
  { text: 'Submittal ID', value: 'submittalID' },
  { text: 'Need Date', value: 'needDate' },
  { text: 'Owner', value: 'owner' },
  // { text: 'Contract', value: 'contract' }
];
const expanded = ref([]);
const singleExpand = ref(false);
const maxchars = v => v.length <= 200 || 'Input too long!';
const pagination = ref({});
const tableHeaders = [
  { title: 'Submittal', align: 'start', key: 'submittalID', width: '180px' },
  { title: 'Description', key: 'description', width: '40%' },
  { title: 'Received Date', key: 'receivedDate', width: '205px' },
  { title: 'Need Date', key: 'needDate', width: '205px' },
  { title: 'Disposition Date', key: 'dispositionDate', width: '205px' },
  { title: 'Priority', key: 'priority' },
  { title: 'Owner', key: 'owner' },
  { title: '', key: 'save', width: '1px', sortable: false },
  { title: '', key: 'data-table-expand', width: '1px' },
];
const units = [
  'AA',
  'BB',
  'FF',
  'DD',
  'EE',
  'CC'
];
const subdivisions = [
  'AAA',
  'BBB',
  'CCC',
];
const owners = [{ "name": "Shirley Clemas", "unit": "BB", "subdivision": "BBB" }, { "name": "Aubrey Meenehan", "unit": "FF" }, { "name": "Nikolia Dulson", "unit": "AA", "subdivision": "AAA" }, { "name": "Claretta Enns", "unit": "DD", "subdivision": "CCC" }, { "name": "Ninnetta Kamiyama", "unit": "AA", "subdivision": "AAA" }, { "name": "Brenna Pettet", "unit": "DD", "subdivision": "CCC" }, { "name": "Clementina Burnham", "unit": "BB", "subdivision": "BBB" }, { "name": "Shara Willeson", "unit": "DD", "subdivision": "CCC" }, { "name": "Salome Bernardo", "unit": "DD", "subdivision": "CCC" }, { "name": "Conrade Dines", "unit": "DD", "subdivision": "CCC" }, { "name": "Marillin Foister", "unit": "EE", "subdivision": "CCC" }, { "name": "Maggee Silvester", "unit": "FF" }, { "name": "Chery Barhims", "unit": "DD", "subdivision": "CCC" }, { "name": "Spence Grishinov", "unit": "CC", "subdivision": "BBB" }, { "name": "Dulciana Saberton", "unit": "AA", "subdivision": "AAA" }, { "name": "Valina Cleaver", "unit": "FF" }, { "name": "Kenna Hadgkiss", "unit": "AA", "subdivision": "AAA" }, { "name": "Shay Rennie", "unit": "FF" }, { "name": "Colin Van der Beek", "unit": "EE", "subdivision": "CCC" }, { "name": "Westbrook Rumens", "unit": "CC", "subdivision": "BBB" }, { "name": "Renee Schwanden", "unit": "FF" }, { "name": "Euphemia Ciraldo", "unit": "EE", "subdivision": "CCC" }, { "name": "Michel Mewett", "unit": "FF" }, { "name": "Aymer Aland", "unit": "FF" }, { "name": "Dennison Corbould", "unit": "EE", "subdivision": "CCC" }, { "name": "Christoffer Kryska", "unit": "BB", "subdivision": "BBB" }, { "name": "Odo Dykins", "unit": "CC", "subdivision": "BBB" }, { "name": "Maurizio Wrates", "unit": "DD", "subdivision": "CCC" }, { "name": "Leia Swinburn", "unit": "BB", "subdivision": "BBB" }, { "name": "Noam Ewbanck", "unit": "DD", "subdivision": "CCC" }, { "name": "Carmine Stuther", "unit": "CC", "subdivision": "BBB" }, { "name": "Caesar Jeppensen", "unit": "CC", "subdivision": "BBB" }, { "name": "Phillipe Huckle", "unit": "CC", "subdivision": "BBB" }, { "name": "Edi Rentelll", "unit": "CC", "subdivision": "BBB" }, { "name": "Audi Moughtin", "unit": "EE", "subdivision": "CCC" }, { "name": "Gwenora Peascod", "unit": "AA", "subdivision": "AAA" }, { "name": "Rockey Colam", "unit": "EE", "subdivision": "CCC" }, { "name": "Margie Truggian", "unit": "AA", "subdivision": "AAA" }, { "name": "Frederica Siney", "unit": "FF" }, { "name": "Cary Lindwasser", "unit": "DD", "subdivision": "CCC" }, { "name": "Robinet Pettiward", "unit": "DD", "subdivision": "CCC" }, { "name": "Durand Godspede", "unit": "AA", "subdivision": "AAA" }, { "name": "Tommie Dunmuir", "unit": "DD", "subdivision": "CCC" }, { "name": "Raimundo Rylatt", "unit": "EE", "subdivision": "CCC" }, { "name": "Verney McKechnie", "unit": "AA", "subdivision": "AAA" }, { "name": "Ray Binding", "unit": "BB", "subdivision": "BBB" }, { "name": "Valery Vedishchev", "unit": "FF" }, { "name": "Trevar Faber", "unit": "AA", "subdivision": "AAA" }, { "name": "Allyce O'Giany", "unit": "DD", "subdivision": "CCC" }, { "name": "Armstrong Androlli", "unit": "FF" }, { "name": "Kingsly Clymo", "unit": "EE", "subdivision": "CCC" }, { "name": "Chris Simister", "unit": "CC", "subdivision": "BBB" }, { "name": "Sloan Breagan", "unit": "FF" }, { "name": "Valentina Alston", "unit": "CC", "subdivision": "BBB" }, { "name": "Shae Hadfield", "unit": "FF" }, { "name": "Gardie Latta", "unit": "CC", "subdivision": "BBB" }, { "name": "Kermit Odney", "unit": "BB", "subdivision": "BBB" }, { "name": "Vina Cowpertwait", "unit": "BB", "subdivision": "BBB" }, { "name": "Tirrell Nanninini", "unit": "BB", "subdivision": "BBB" }, { "name": "Taylor Bench", "unit": "FF" }, { "name": "Cornela Philson", "unit": "AA", "subdivision": "AAA" }, { "name": "Rutger Vesque", "unit": "CC", "subdivision": "BBB" }, { "name": "Deane Mityakov", "unit": "CC", "subdivision": "BBB" }, { "name": "Alexander Bradwell", "unit": "EE", "subdivision": "CCC" }, { "name": "Padget Alsobrook", "unit": "EE", "subdivision": "CCC" }, { "name": "Gaynor Steart", "unit": "EE", "subdivision": "CCC" }, { "name": "Findley Laba", "unit": "CC", "subdivision": "BBB" }, { "name": "Benedikt Gothliff", "unit": "CC", "subdivision": "BBB" }, { "name": "Fernandina Alcoran", "unit": "CC", "subdivision": "BBB" }, { "name": "Stearn Cahalan", "unit": "DD", "subdivision": "CCC" }, { "name": "Felicio Rubinfeld", "unit": "BB", "subdivision": "BBB" }, { "name": "Remus Alderson", "unit": "FF" }, { "name": "Carrol Kohen", "unit": "CC", "subdivision": "BBB" }, { "name": "Jud McParland", "unit": "DD", "subdivision": "CCC" }, { "name": "Moore Casetta", "unit": "DD", "subdivision": "CCC" }, { "name": "Aileen Cartner", "unit": "EE", "subdivision": "CCC" }, { "name": "Lisbeth Melledy", "unit": "CC", "subdivision": "BBB" }, { "name": "Andra Kubiak", "unit": "EE", "subdivision": "CCC" }, { "name": "Tony Aggs", "unit": "CC", "subdivision": "BBB" }, { "name": "Erma Pennycock", "unit": "CC", "subdivision": "BBB" }, { "name": "Ailis Sutterby", "unit": "CC", "subdivision": "BBB" }, { "name": "Krissy Hayhoe", "unit": "DD", "subdivision": "CCC" }, { "name": "Cecil Jarmain", "unit": "BB", "subdivision": "BBB" }, { "name": "Datha Gooda", "unit": "BB", "subdivision": "BBB" }, { "name": "Donna Dukes", "unit": "CC", "subdivision": "BBB" }, { "name": "Cyril Gulc", "unit": "CC", "subdivision": "BBB" }, { "name": "Joice Hrynczyk", "unit": "BB", "subdivision": "BBB" }, { "name": "Jessie Vogl", "unit": "FF" }, { "name": "Bary Lethbrig", "unit": "AA", "subdivision": "AAA" }, { "name": "Nelle Groucock", "unit": "BB", "subdivision": "BBB" }, { "name": "Winne Cowthard", "unit": "CC", "subdivision": "BBB" }, { "name": "Woodie Beckmann", "unit": "AA", "subdivision": "AAA" }, { "name": "Ker Bugg", "unit": "CC", "subdivision": "BBB" }, { "name": "Newton Biddlestone", "unit": "DD", "subdivision": "CCC" }, { "name": "Emily Bernadot", "unit": "DD", "subdivision": "CCC" }, { "name": "Walt Girault", "unit": "FF" }, { "name": "Karole Vlasenkov", "unit": "AA", "subdivision": "AAA" }, { "name": "Matt Postans", "unit": "DD", "subdivision": "CCC" }, { "name": "Chickie Gisbey", "unit": "BB", "subdivision": "BBB" }, { "name": "Mason Roobottom", "unit": "DD", "subdivision": "CCC" }, { "name": "Bradan Karle", "unit": "FF" }, { "name": "Paulette Suter", "unit": "AA", "subdivision": "AAA" }, { "name": "Riobard Roj", "unit": "DD", "subdivision": "CCC" }, { "name": "Fae Farlowe", "unit": "BB", "subdivision": "BBB" }, { "name": "Geoffrey Kemmett", "unit": "EE", "subdivision": "CCC" }, { "name": "Cristine Littlepage", "unit": "AA", "subdivision": "AAA" }, { "name": "Hollyanne Takkos", "unit": "DD", "subdivision": "CCC" }, { "name": "Glenden Hulcoop", "unit": "BB", "subdivision": "BBB" }, { "name": "Kenon Vasyushkhin", "unit": "FF" }, { "name": "Konstance Georgiades", "unit": "DD", "subdivision": "CCC" }, { "name": "Karly Humbles", "unit": "EE", "subdivision": "CCC" }, { "name": "Joane Marfield", "unit": "BB", "subdivision": "BBB" }, { "name": "Fannie Hens", "unit": "BB", "subdivision": "BBB" }, { "name": "Fred Padwick", "unit": "EE", "subdivision": "CCC" }, { "name": "Riki Laughtisse", "unit": "FF" }, { "name": "Crissy Craw", "unit": "FF" }, { "name": "Nessy Streets", "unit": "FF" }, { "name": "Bartel Catterill", "unit": "AA", "subdivision": "AAA" }, { "name": "Aldin Pentony", "unit": "EE", "subdivision": "CCC" }, { "name": "Amandy Lorentzen", "unit": "DD", "subdivision": "CCC" }, { "name": "Trisha Antoinet", "unit": "DD", "subdivision": "CCC" }, { "name": "Gustavo Liley", "unit": "DD", "subdivision": "CCC" }, { "name": "Thornie Maly", "unit": "DD", "subdivision": "CCC" }, { "name": "Eleni Gutowski", "unit": "FF" }, { "name": "Marcelle Hyam", "unit": "EE", "subdivision": "CCC" }, { "name": "Lynna MacNockater", "unit": "CC", "subdivision": "BBB" }, { "name": "Othilie Vergo", "unit": "CC", "subdivision": "BBB" }, { "name": "Javier Sikorski", "unit": "FF" }, { "name": "Corbet Camber", "unit": "FF" }, { "name": "Marylee Sneath", "unit": "DD", "subdivision": "CCC" }, { "name": "Walker Ost", "unit": "EE", "subdivision": "CCC" }, { "name": "Aleen Gorman", "unit": "BB", "subdivision": "BBB" }, { "name": "Pembroke Kleinzweig", "unit": "FF" }, { "name": "Lavinia Thaxter", "unit": "DD", "subdivision": "CCC" }, { "name": "Bette-ann Pepys", "unit": "DD", "subdivision": "CCC" }, { "name": "Sharai MacVean", "unit": "AA", "subdivision": "AAA" }, { "name": "Natal Tilmouth", "unit": "DD", "subdivision": "CCC" }, { "name": "Harrietta Hentzer", "unit": "FF" }, { "name": "Derward Blackaller", "unit": "AA", "subdivision": "AAA" }, { "name": "Caspar Driuzzi", "unit": "CC", "subdivision": "BBB" }, { "name": "Angeline Nannizzi", "unit": "CC", "subdivision": "BBB" }, { "name": "Mauricio Blackley", "unit": "FF" }, { "name": "Jessi Tramel", "unit": "EE", "subdivision": "CCC" }, { "name": "Gilligan Butterley", "unit": "BB", "subdivision": "BBB" }, { "name": "Earvin Ellingford", "unit": "BB", "subdivision": "BBB" }, { "name": "Jeanine Moyce", "unit": "DD", "subdivision": "CCC" }, { "name": "Jessie Arangy", "unit": "EE", "subdivision": "CCC" }, { "name": "Morley Goady", "unit": "AA", "subdivision": "AAA" }, { "name": "Michal Hucks", "unit": "BB", "subdivision": "BBB" }, { "name": "Augusto Husthwaite", "unit": "AA", "subdivision": "AAA" }, { "name": "Teddy Punt", "unit": "BB", "subdivision": "BBB" }, { "name": "Brenden Stockney", "unit": "BB", "subdivision": "BBB" }, { "name": "Agathe Smitheram", "unit": "FF" }, { "name": "Robbyn Morrid", "unit": "CC", "subdivision": "BBB" }, { "name": "Sheeree Berresford", "unit": "CC", "subdivision": "BBB" }, { "name": "Mimi Wallentin", "unit": "FF" }, { "name": "Doralynne Konerding", "unit": "BB", "subdivision": "BBB" }, { "name": "Kipper Kegan", "unit": "FF" }, { "name": "Drusilla Hassin", "unit": "DD", "subdivision": "CCC" }, { "name": "Lindon Hearne", "unit": "DD", "subdivision": "CCC" }, { "name": "Cory Hanna", "unit": "EE", "subdivision": "CCC" }, { "name": "Nussy Streets", "unit": "DD", "subdivision": "CCC" }, { "name": "Stefano O' Cuolahan", "unit": "DD", "subdivision": "CCC" }, { "name": "Sebastiano Janes", "unit": "FF" }, { "name": "Johanna Lilloe", "unit": "BB", "subdivision": "BBB" }, { "name": "Walsh Binestead", "unit": "CC", "subdivision": "BBB" }, { "name": "Marcel Beatson", "unit": "AA", "subdivision": "AAA" }, { "name": "Eduardo Olenchikov", "unit": "DD", "subdivision": "CCC" }, { "name": "Tremain Polak", "unit": "EE", "subdivision": "CCC" }, { "name": "Barb Sheach", "unit": "BB", "subdivision": "BBB" }, { "name": "Constantina Oganesian", "unit": "BB", "subdivision": "BBB" }, { "name": "Wynn Gorgen", "unit": "EE", "subdivision": "CCC" }, { "name": "Ulysses Harmar", "unit": "BB", "subdivision": "BBB" }, { "name": "Tiffy Pitkeathley", "unit": "FF" }, { "name": "Mathilda Mc Cahey", "unit": "BB", "subdivision": "BBB" }, { "name": "Benedicto Durn", "unit": "AA", "subdivision": "AAA" }, { "name": "Minna Bartczak", "unit": "FF" }, { "name": "Evangeline Stoak", "unit": "AA", "subdivision": "AAA" }, { "name": "Germayne Wannop", "unit": "EE", "subdivision": "CCC" }, { "name": "Monty Ivie", "unit": "DD", "subdivision": "CCC" }, { "name": "Myrtie Swait", "unit": "CC", "subdivision": "BBB" }, { "name": "Susanne Hargreaves", "unit": "CC", "subdivision": "BBB" }, { "name": "Maura Burhill", "unit": "FF" }, { "name": "Lora Woodford", "unit": "EE", "subdivision": "CCC" }, { "name": "Floyd Salvage", "unit": "DD", "subdivision": "CCC" }, { "name": "Claudian Martinot", "unit": "BB", "subdivision": "BBB" }, { "name": "Dedie Blumer", "unit": "AA", "subdivision": "AAA" }, { "name": "Daloris Roskell", "unit": "FF" }, { "name": "Nerty Harmant", "unit": "AA", "subdivision": "AAA" }, { "name": "Celinda Lowensohn", "unit": "FF" }, { "name": "Glenn Bearns", "unit": "EE", "subdivision": "CCC" }, { "name": "Gwenora Candey", "unit": "CC", "subdivision": "BBB" }, { "name": "Waldo Locke", "unit": "DD", "subdivision": "CCC" }, { "name": "Kendell Drable", "unit": "FF" }, { "name": "Marchelle Clewer", "unit": "CC", "subdivision": "BBB" }, { "name": "Richmound Vinick", "unit": "DD", "subdivision": "CCC" }, { "name": "Corbin Milne", "unit": "AA", "subdivision": "AAA" }, { "name": "Georgina Cadagan", "unit": "DD", "subdivision": "CCC" }, { "name": "Tripp Kingdom", "unit": "AA", "subdivision": "AAA" }, { "name": "Ramon D'Souza", "unit": "FF" }, { "name": "Hettie Gluyas", "unit": "AA", "subdivision": "AAA" }, { "name": "Valentina Sandle", "unit": "EE", "subdivision": "CCC" }, { "name": "Marchelle Haker", "unit": "CC", "subdivision": "BBB" }, { "name": "Harlene Lynnett", "unit": "FF" }, { "name": "Joaquin Plumtree", "unit": "BB", "subdivision": "BBB" }, { "name": "Carilyn Yate", "unit": "EE", "subdivision": "CCC" }, { "name": "Alberta Beswetherick", "unit": "EE", "subdivision": "CCC" }, { "name": "Lawry Eyckelbeck", "unit": "BB", "subdivision": "BBB" }, { "name": "Kathie Latliff", "unit": "FF" }, { "name": "Batholomew Huyge", "unit": "CC", "subdivision": "BBB" }, { "name": "Lucias Graeser", "unit": "AA", "subdivision": "AAA" }, { "name": "Herman Levay", "unit": "FF" }, { "name": "Sibel Peterffy", "unit": "AA", "subdivision": "AAA" }, { "name": "Urban Lars", "unit": "FF" }, { "name": "Annmaria Ferenczy", "unit": "DD", "subdivision": "CCC" }, { "name": "Grethel Sage", "unit": "FF" }, { "name": "Emerson Elsdon", "unit": "BB", "subdivision": "BBB" }, { "name": "Melany Noddles", "unit": "AA", "subdivision": "AAA" }, { "name": "Angelique Bethell", "unit": "FF" }, { "name": "Tani Yoskowitz", "unit": "BB", "subdivision": "BBB" }, { "name": "Clive Sartain", "unit": "AA", "subdivision": "AAA" }, { "name": "Cristin Yurkin", "unit": "FF" }, { "name": "Maurie Birkmyre", "unit": "AA", "subdivision": "AAA" }, { "name": "Martie Marrows", "unit": "EE", "subdivision": "CCC" }, { "name": "Josephine Riddell", "unit": "DD", "subdivision": "CCC" }, { "name": "Catherin Brockton", "unit": "EE", "subdivision": "CCC" }, { "name": "Marthena Brierley", "unit": "EE", "subdivision": "CCC" }, { "name": "Lorianne MacDermand", "unit": "BB", "subdivision": "BBB" }, { "name": "Aloin Tisor", "unit": "BB", "subdivision": "BBB" }, { "name": "Kennett Ducker", "unit": "CC", "subdivision": "BBB" }, { "name": "Zach Baiss", "unit": "FF" }, { "name": "Ronica Sivess", "unit": "AA", "subdivision": "AAA" }, { "name": "Concettina Syalvester", "unit": "AA", "subdivision": "AAA" }, { "name": "Iorgos Jovanovic", "unit": "BB", "subdivision": "BBB" }, { "name": "Susana Dowsey", "unit": "BB", "subdivision": "BBB" }, { "name": "Jeromy Yakunikov", "unit": "FF" }, { "name": "Vonny Callendar", "unit": "BB", "subdivision": "BBB" }, { "name": "Bill Huggons", "unit": "BB", "subdivision": "BBB" }, { "name": "Dacie Klimowicz", "unit": "CC", "subdivision": "BBB" }, { "name": "Joline Butt", "unit": "FF" }]
const selectedEvent = ref({});
const selectedElement = ref(null);
const selectedOpen = ref(false);

// Methods
const saveSubmittal = (submittal) => {
  // console.log('Submittals: ' + JSON.stringify(submittal));
  submittalsStore.updateSubmittal(submittal);
}

const nextPage = () => {
  if (page.value + 1 <= numberOfPages.value) page.value += 1
};
const formerPage = () => {
  if (page.value - 1 >= 1) page.value -= 1
};
const updateItemsPerPage = (number) => {
  itemsPerPage.value = number
};

const showEvent = ({ nativeEvent, event }) => {
  const open = () => {
    selectedEvent.value = event
    selectedElement.value = nativeEvent.target
    requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
  }

  if (selectedOpen.value) {
    selectedOpen.value = false
    requestAnimationFrame(() => requestAnimationFrame(() => open()))
  } else {
    open()
  }

  nativeEvent.stopPropagation()
};

const eventColor = (event) => {
  if (JSON.stringify(event) === '{}') {
    return '';
  } else {
    return submittalColor(event.submittal);
  }
}

const submittalColor = (needDate, dispositionDate) => {
  // console.log(JSON.stringify(submittal));
  const nD = dayjs(needDate);
  const diff = nD.diff(dayjs(), 'day');
  var color;

  if (diff < 0) {
    color = 'red-darken-1';
  } else if (diff < 7) {
    color = 'deep-orange-darken-1';
  } else if (diff < 14) {
    color = 'orange-darken-1';
  } else if (diff < 21) {
    color = 'amber-darken-1';
  } else if (diff < 28) {
    color = 'light-green-darken-1';
  } else {
    color = 'green-darken-1'
  }

  (dispositionDate != null) && (color = 'grey-darken-2');

  return color;
}


// Computed

const numberOfPages = computed(() => {
  return Math.ceil(filteredSubmittals.value.length / itemsPerPage.value)
});

const contracts = computed(() => {
  console.log('projects:' + JSON.stringify(projectsStore.projects));
  var fP = projectsStore.projects.filter(function (e) {
    return projectFilter.value.includes(e.name)
  });

  // var fP = [];

  var contracts = []
  fP.forEach(project => {
    project.contracts.forEach(contract => {
      !contracts.includes(contract.contractID) && contracts.push(contract.contractID);
    });
  });

  // console.log('contracts: ' + JSON.stringify(contracts));

  return contracts;
})

const filteredSubmittals = computed(() => {
  var fS = [];

  contracts.value.forEach(contract => {
    fS.push.apply(fS, filter(submittalsStore.submittals, {
      keywords: `submittalID:-${contract}-`
    }));
  });

  console.log(`Contracts filter: ${JSON.stringify(contracts.value)}`);

  Object.entries(submittalFilter.value).forEach(entry => {
    const [key, value] = entry;
    if (value != null) {
      if (Array.isArray(value)) {
        fS = filter(fS, {
          // Check if the array is empty, and if not, filter by "key: value" with brackets removed from the value array (["blah", "blah2"] --> "blah", "blah2")
          keywords: `${value.length > 0 ? key + ':' : ''}${JSON.stringify(value).replace('[', '').replace(']', '')}`,
          predicate: 'OR'
        })
        console.log(`${value.length > 0 ? key + ':' : ''}${JSON.stringify(value).replace('[', '').replace(']', '')}`);
      } else {
        fS = fS.filter(submittal => submittal[key] === value);
      }
    }
  }
  );

  console.log('Filtered submittals:');
  console.log(fS);
  return fS;
});

const filteredOwners = computed(() => {
  return filter(owners, {
    keywords: `unit:${unitSelect.value}`,
    predicate: 'OR'
  })
});

const submittalEvents = computed(() => {
  const sE = filteredSubmittals.value.map(submittal => {
    const event = {};

    event.name = `${submittal.submittalID} ${submittal.description != '' ? '-' : ''} ${submittal.description}`;
    event.start = dayjs(submittal.receivedDate).format('YYYY-MM-DD');
    event.end = dayjs(submittal.needDate).format('YYYY-MM-DD');
    event.submittal = submittal;

    return event;
  });

  return _.sortBy(sE, ['name', 'start', 'end']);
});

  // const eventMoreArray = ref({
  //   weeklyDayOverflowY: 'clip;',
  //   weeklyDisplay: 'grid;',
  //   weeklyTableLayout: 'initial;',
  //   weeklyWeekDisplay: 'grid;',
  //   weeklyWeekHeight: 'initial;',
  // });
</script>

<style scoped>
.v-select.fit {
  width: min-content;
}

.v-select.fit .v-select__selection--comma {
  text-overflow: unset;
}

.v-calendar-weekly {
  display: table;
  table-layout: fixed;
}</style>