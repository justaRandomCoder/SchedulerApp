class Session {
    constructor(semester, course, type, group, credit, teachers) {
        this.semester = semester;
        this.course = course;
        this.type = type;
        this.batch = course.split(" ")[1][0];
        if(group) {
            this.group = group;
        }
        this.credit = credit;
        if(this.type == "Theory"){
           this.count = 2;
        }
        else this.count = 1;
        if(this.type == "Lab") {
            if(this.credit==0.75){
                this.isAlternate = true;
            }
            else this.isAlternate = false;
        }
        if(this.type =="theory"){
            this.duration = 1;
        }
        else this.duration = 2;
        this.teachers = (teachers) ? teachers.split(";") : [];    
    }
};

module.exports = Session;