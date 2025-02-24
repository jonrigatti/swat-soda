import http from "../http-common";

class ServerDataService {
    testDir() {
        return http.get("/server/testdir");
    }

    createSDF(id, data) {
        console.log('SDF creation: ' + JSON.stringify(data));
        return http.put(`/server/createSDF/${id}`, data)
        .then(function (response) {
            console.log('Then: ' + JSON.stringify(data));
            console.log(response);
        });
    }
    
    createPDF(id, data) {
        console.log('PDF creation: ' + JSON.stringify(data));
        return http.put(`/server/createPDF/${id}`, data)
        .then(function (response) {
            console.log('Then: ' + JSON.stringify(data));
            console.log(response);
        });
    }
        
    mergePDF(id, data) {
        console.log('PDF merging: ' + JSON.stringify(data));
        return http.put(`/server/mergePDF/${id}`, data)
        .then(function (response) {
            console.log('Then: ' + JSON.stringify(data));
            console.log(response);
        });
    }
}

export default new ServerDataService();