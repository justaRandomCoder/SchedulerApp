const Utils = require('./modules/utils');

const Session = require('./modules/session');
const Batch = require('./modules/batch');
const Teacher = require('./modules/teacher');
const Routine = require('./modules/routine');

var sessions = [];
var slots = [];
var teachers = [];
var batches = {};
var routines = {
    1 : new Routine(1), 
    2 : new Routine(2), 
    3 : new Routine(3)
};

function schedule(index) {
    if(index == sessions.length) {
        return true;
    }

    if(sessions[index].count == 0) {
        return schedule(index+1);
    }

    
    let session = sessions[index];
    let batch = batches[session.batch];
    let isValid = false;

    if(session.type == "Lab") {
        let group = session.group;
        let teacher1 = Utils.findTeacher(session.teachers[0], teachers);
        let teacher2 = Utils.findTeacher(session.teachers[1], teachers);

        for(let day=0; day<5 && !isValid; day++) {
            for(let slot=0; slot<5 && !isValid; slot++) {
                if(slot<2 || slot==3) {
                    if((!teacher1 || teacher1.isFree(day, slot) && teacher1.isFree(day, slot+1)) && (!teacher2 || teacher2.isFree(day, slot) && teacher2.isFree(day, slot+1))) {
                        if(batch.isFree(group, day, slot) && batch.isFree(group, day, slot+1) ) {
                            batch.occupy(group, day, slot);
                            batch.occupy(group, day, slot+1);
                            if(teacher1) {
                                teacher1.occupy(day, slot);
                                teacher1.occupy(day, slot+1);
                            }
                            if(teacher2) {
                                teacher2.occupy(day, slot);
                                teacher2.occupy(day, slot+1);
                            }
                            routines[session.batch].set(day, slot, index);
                            routines[session.batch].set(day, slot+1, index);
                            sessions[index].count--;

                            isValid = schedule(index+1);

                            if(!isValid) {
                                batch.free(group, day, slot);
                                batch.free(group, day, slot+1);
                                if(teacher1) {
                                    teacher1.free(day, slot);
                                    teacher1.free(day, slot+1);
                                }
                                if(teacher2) {
                                    teacher2.free(day, slot);
                                    teacher2.free(day, slot+1);
                                }
                                routines[session.batch].remove(day, slot, index);
                                routines[session.batch].remove(day, slot+1, index);
                                sessions[index].count++;
                            }
                        }
                    }
                }
            }
        }
    }

    else if(session.type == "Theory") {

        let group = null;
        let teacher = Utils.findTeacher(session.teachers[0], teachers);

        for(let day=0; day<5 && !isValid; day++) {
            if(session.count == 1) {
                if(routines[session.batch].isAssignedAlready(day, index)) {
                    continue;
                }
            }

            for(let slot=0; slot<5 && !isValid; slot++) {
                if(teacher.isFree(day, slot) && batch.isFree(group, day, slot)) {
                    batch.occupy(group, day, slot);
                    teacher.occupy(day, slot);
                    routines[session.batch].set(day, slot, index);
                    sessions[index].count--;

                    isValid = schedule(index+1);

                    if(!isValid) {
                        batch.free(group, day, slot);
                        teacher.free(day, slot);
                        routines[session.batch].remove(day, slot, index);
                        sessions[index].count++;
                    }
                }
            }
        }
    }

    return isValid;
}

function app() {
    Utils.init('./data/input.xlsx', sessions, batches, slots, teachers);

    var status = schedule(0);
    if(status) {
        status = schedule(0);
    }

    if(status) {
        Utils.display(routines, sessions);
    }
    else {
        console.log("Try Different Input.");
    }
}

app();