import http from "../http-common";
import dayjs from 'dayjs';

class SubmittalDataService {
    getAll() {
        return http.get("/submittals");
    }

    getOpen() {
        return http.get("/submittals/open");
    }
    
    getClosed() {
        return http.get("/submittals/closed");
    }

    get(id) {
        return http.get(`/submittals/${id}`);
    }

    create(data) {
        return http.post("/submittals", data);
    }

    update(id, data) {        
        console.log('Update beginning: ' + JSON.stringify(data));
        return http.put(`/submittals/${id}`, data)
        .then(function (response) {
            console.log('Then: ' + JSON.stringify(data));
            console.log(response);
        });
    }

    delete(id) {
        return http.delete(`/submittals/${id}`);
    }

    // deleteAll() {
    //     return http.delete(`/submittals`);
    // }

    findDynamic(q) {
        console.log('q: ' + JSON.stringify(q));
        var queryString = "?";
        var j = 0;
        q.forEach(i => {
            switch(i.key.type) {
                case "String":
                    queryString += `&$${i.andOr}[${j}][${i.key.name}][%24regex]=${i.value}`;
                    queryString += `&$${i.andOr}[${j}][${i.key.name}][%24options]=i}`
                    break;
                case "Date":
                    // Have to search as a range because of timestamps
                    if(i.operator == "$eq") {
                        var nextDay = dayjs(i.value).add(1, 'day').startOf('day');
                        queryString += `&$${i.andOr}[${j}][${i.key.name}][$gte]=${i.value}`;
                        queryString += `&$${i.andOr}[${j}][${i.key.name}][$lt]=${nextDay.toISOString()}`;
                    }
                    else {
                        queryString += `&$${i.andOr}[${j}][${i.key.name}][${i.operator}]=${i.value}`;
                    }
                    break;
                case "Number":
                    // This is the same as string handling at the moment
                    if(/^(\d+|\d*\.\d+)$/.test(i.value)) {
                        queryString += `&$${i.andOr}[${j}][${i.key.name}][${i.operator}]=${i.value}`;
                    }
                    else {
                        queryString += `&$${i.andOr}[${j}][${i.key.name}][%24regex]=${i.value}`;
                        queryString += `&$${i.andOr}[${j}][${i.key.name}][%24options]=i}`
                    }
                    break;
                default:
                    break;
            }
            j++;
        });

        console.log('queryString: ' + queryString);

        return http.get(`submittals/query/${queryString}`);
    }

    findBySubmittalID(submittalID) {
        return http.get(`/submittals?submittalID=${submittalID}`);
    }

    findByOwner(owner) {
        console.log('Owner from Data Service: ' + owner);
        return http.get(`/submittals/owners/${owner}`);
    }

    findByViolationCategory(cat) {
        console.log('Category from Data Service: ' + cat);
        return http.get(`/submittals/violations/${cat}`);
    }
}

export default new SubmittalDataService();