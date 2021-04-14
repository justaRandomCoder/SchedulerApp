class Routine {
    constructor(batch) {
        this.batch = batch;
        this.sessions = [
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []]
        ]
    }

    set(day, slot, sessionIndex) {
        this.sessions[day][slot].push(sessionIndex);    
    }

    remove(day, slot, sessionIndex) {
        for(let index=0; index<this.sessions[day][slot].length; index++){ 
            if (this.sessions[day][slot][index] == sessionIndex) { 
                this.sessions[day][slot].splice(index, 1); 
            }
        }         
    }

    get(day, slot) {
        return this.sessions[day][slot];
    }

    isAssignedAlready(day, sessionIndex) {
        let assignedAlready = false;
        Object.keys(this.sessions[day]).forEach((slot) => {
            let index = 0;
            this.sessions[day][slot].forEach(session => {
                if(sessionIndex == session) {
                    assignedAlready = true;
                }
                index++;
            });
        });
        return assignedAlready;
    }
};

module.exports = Routine;