class Teacher {
    constructor(id, name, designation, courses, inputSlots) {
        this.id = id;
        this.name = name;
        this.designation = designation;
        this.courses = (courses) ? courses.split(";") : []; 
        this.slots = this.parse(inputSlots);
    }

    occupy(day, slot) {
        this.slots[day][slot] = 1;
    }

    free(day, slot) {
        this.slots[day][slot] = 0;
    }
    
    isFree(day, slot) {
        return this.slots[day][slot] == 0;
    }

    parse(inputSlots) {
        var slots = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];
        var key = Object.keys(inputSlots);
        for (var day of key) {
            let dayTimeSlots = inputSlots[day].split(";");

            for(let i=0; i<dayTimeSlots.length; i++) {
                let times = dayTimeSlots[i].split("-");                

                for(let j=0; j<2; j++) {
                    let time = times[j].split(":");                        
                    let hour = time[0];
                    let minute = time[1].substring(0, 2);
                    let pm = (time[1][2] == "p");
                    if(pm) { 
                        hour = (12+parseInt(hour)).toString();
                    }
                    times[j] = hour + ":" + minute;    
                }

                let start = 0;
                switch(times[0]) {
                    case "8:30":
                        start = 0;
                        break;
                    case "08:30":
                        start = 0;
                        break;
                    case "10:00":
                        start = 1;
                        break;
                    case "11:30":
                        start = 2;
                        break;
                    case "13:00":
                        start = 3;
                        break;
                    case "15:30":
                        start = 4;
                        break;
                    case "17:00":
                        start = 5;
                        break;
                    default:
                        start = 0;
                }

                let end = 0;
                switch(times[1]) {
                    case "8:30":
                        end = 0;
                        break;
                    case "08:30":
                        end = 0;
                        break;
                    case "10:00":
                        end = 1;
                        break;
                    case "11:30":
                        end = 2;
                        break;
                    case "13:00":
                        end = 3;
                        break;
                    case "15:30":
                        end = 4;
                        break;
                    case "17:00":
                        end = 5;
                        break;
                    default:
                        end = 0;
                }


                let dayIndex = 0;
                switch(day) {
                    case "sunday":
                        dayIndex = 0;
                        break;
                    case "monday":
                        dayIndex = 1;
                        break;
                    case "tuesday":
                        dayIndex = 2;
                        break;
                    case "wednesday":
                        dayIndex = 3;
                        break;
                    case "thursday":
                        dayIndex = 4;
                        break;
                    default:
                }

                for(let i=start; i<end; i++) {
                    slots[dayIndex][i] = 0;
                }
            }
        }
        return slots;
    }
};

module.exports = Teacher;