class Batch {
    constructor(id) {
        this.id = id;
        this.slotsA = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.slotsB = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    }

    occupy(group, day, slot) {
        if(group === "GA") {
            this.slotsA[day][slot] = 1;
        }
        else if(group === "GB") {
            this.slotsB[day][slot] = 1;
        }
        else {
            this.slotsA[day][slot] = 1;
            this.slotsB[day][slot] = 1;
        }
    }

    free(group, day, slot) {
        if(group === "GA") {
            this.slotsA[day][slot] = 0;
        }
        else if(group === "GB") {
            this.slotsB[day][slot] = 0;
        }
        else {
            this.slotsA[day][slot] = 0;
            this.slotsB[day][slot] = 0;
        }
    }
        
    isFree(group, day, slot) {
        if(group === "GA") {
            if(this.slotsA[day][slot]==0) return true;
            else return false;
        }
        else if(group === "GB") {
            if(this.slotsB[day][slot]==0) return true;
            else return false;
        }
        else {
            return (this.slotsA[day][slot]==0 && this.slotsB[day][slot]==0);
        }
    }
};

module.exports = Batch;