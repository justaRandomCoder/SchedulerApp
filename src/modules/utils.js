const Xlsx = require('xlsx');
const Session = require('./session');
const Batch = require('./batch');
const Teacher = require('./teacher');
const Routine = require('./routine');

const compare = (a, b)=>{
    if(a.type.length == b.type.length) {
        if(a.semester == b.semester) {
            if(a.course.substring(3) == b.course.substring(3) && a.type == "Lab") {
                if(a.group > b.group) return 1;
                else return -1;
            }
            else{
                if(a.course.substring(3) > b.course.substring(3)) return 1;
                else return -1;
            }
        }
        else{
            return (a.semester > b.semester) ? 1 : -1;
        }
    }
    return (a.type.length > b.type.length) ? 1 : -1;
}

function init(path, sessions, batches , slots, teachers ) {
    const data = Xlsx.readFile(path);
    const sheetLen = data.SheetNames.length;
    for(let i = 0; i < sheetLen; i++) {
        const entries = Xlsx.utils.sheet_to_json(data.Sheets[data.SheetNames[i]]);
        let index = 0;
        entries.forEach((entry) => {
            if(data.SheetNames[i] == "sessions") {
                if(entry.teachers && entry.teachers.length>0) {
                    sessions.push(new Session(entry.semester, entry.course, entry.type, entry.group, entry.credit, entry.teachers));
                }
            }
            else if(data.SheetNames[i] == "timeSlots") {
                slots.push(entry);
            }
            else if(data.SheetNames[i] == "teachers") {
                delete slots[index].teacher;
                teachers.push(new Teacher(entry.id, entry.name, entry.designation, entry.courses, slots[index]));
            }
            index++;
        });
    }

    for(let id=1; id<4; id++) {
        batches[id] = new Batch(id);
    }

    sessions.sort(compare);
}

function findTeacher(id, teachers) {
    if(id) {
        for(let index=0; index<teachers.length; index++) {
            if(teachers[index].id == id) {
                return teachers[index];
            }
        }
    } 
    return false;
}


function display(routines, sessions) {

    var data, output;
    let years = ["First Year", "Second Year", "Third Year", "Fourth Year"];

    console.log("Routines");
    for(let batch=1; batch<=3; batch++) {
        console.log();
        console.log(years[batch-1]);

        data = [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ];

        for(let day=0; day<5; day++) {
            for(let slot=0; slot<5; slot++) {
                var sessionIndices = routines[batch].get(day, slot);
                if(sessionIndices.length>0) {
                    sessionIndices.forEach(index => {
                        let session = sessions[index];
                        let sessionName = session.course;
                        if(session.type == "Lab") {
                            sessionName += " " + session.group;
                            if(session.isAlternate) {
                                sessionName += " (*)";
                            }
                        }
                        if(data[day][slot].length>0) {
                            data[day][slot] += '; ';
                        }
                        data[day][slot] += sessionName;
                    });
                }
            }
        }
        
        output = [
            { 'Day/Time': 'Sunday', '08:30 AM': data[0][0], '10:00 AM': data[0][1], '11:30 AM': data[0][2], '02:00 PM': data[0][3], '03:30 PM': data[0][4] }, 
            { 'Day/Time': 'Monday', '08:30 AM': data[1][0], '10:00 AM': data[1][1], '11:30 AM': data[1][2], '02:00 PM': data[1][3], '03:30 PM': data[1][4] }, 
            { 'Day/Time': 'Tuesday', '08:30 AM': data[2][0], '10:00 AM': data[2][1], '11:30 AM': data[2][2], '02:00 PM': data[2][3], '03:30 PM': data[2][4] }, 
            { 'Day/Time': 'Wednesday', '08:30 AM': data[3][0], '10:00 AM': data[3][1], '11:30 AM': data[3][2], '02:00 PM': data[3][3], '03:30 PM': data[3][4] }, 
            { 'Day/Time': 'Thursday', '08:30 AM': data[4][0], '10:00 AM': data[4][1], '11:30 AM': data[4][2], '02:00 PM': data[4][3], '03:30 PM': data[4][4] }];

        console.table(output);
    }
}

module.exports.findTeacher = findTeacher;
module.exports.init = init;
module.exports.display = display;