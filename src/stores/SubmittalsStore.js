import { defineStore } from 'pinia';
import SubmittalDataService from '@/services/SubmittalDataService';

// https://github.com/BayBreezy/nuxt-3-server-api

export const useSubmittalsStore = defineStore('SubmittalsStore', {
    // state
    state: () => {
        return {
            submittals: []
        }
    },

    // actions
    actions: {
        addSubmittal(submittal) {
            SubmittalDataService.add(submittal)
            .then(response => {
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            })
        },
        // deleteSubmittal(id) {
        //     if(confirm('Delete submittal?')) {
        //     this.submittals = this.submittals.filter((submittal) => submittal.id !== id)
        //     }
        // },
        async getSubmittals() {
            SubmittalDataService.getAll()
            .then(response => {
                this.submittals = response.data;
                // console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        },
        async getOpenSubmittals() {
            SubmittalDataService.getOpen()
            .then(response => {
                this.submittals = response.data;
                // console.log(response.data);
            })
            .catch(e => {
            console.log(e);
            })
        },
        async getClosedSubmittals() {
            SubmittalDataService.getClosed()
            .then(response => {
                this.submittals = response.data;
                // console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            })
        },
        async getSubmittalsByViolation(cat) {
            SubmittalDataService.findByViolationCategory(cat)
            .then(response => {
                this.submittals = response.data;
                // console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        },      
        async getSubmittalsByOwner(owner) {
            SubmittalDataService.findByOwner(owner)
            .then(response => {
                this.submittals = response.data;
                // console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        },
        async updateSubmittal(submittal) {
            SubmittalDataService.update(submittal._id, submittal)
            .catch(function (error) {
                if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                    console.log(error.config);
            });
            // console.log(submittal._id)
        },
        async getDynamicQuery(query)
        {
            SubmittalDataService.findDynamic(query)
            .then(response => {
                this.submittals = response.data;
                console.log('Response data:');
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    // getters
})