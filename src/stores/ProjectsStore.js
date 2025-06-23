import { defineStore } from 'pinia';
import ProjectDataService from '@/services/ProjectDataService';

// https://github.com/BayBreezy/nuxt-3-server-api

export const useProjectsStore = defineStore('ProjectsStore', {
    // state
    state: () => {
        return {
            projects: []
        }
    },

    // actions
    actions: {
        async updateSubmittalPriorities(project) {
            ProjectDataService.update(project._id, project)
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
            // console.log(project._id)
        },
        async updateContracts(project) {
            ProjectDataService.update(project._id, project)
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
            // console.log(project._id)
        },
        async getProjects() {
            ProjectDataService.getAll()
                .then((response) => {
                    this.projects = response.data;
                })
                .catch(e => {
                    console.log(e.message);
                    console.log(e.response.data);
                });
        }
    }

    // getters
})