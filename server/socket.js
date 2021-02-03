let io = require('socket.io');
const { NoSQLDatabase } = require('./dbConnection');

class Socket {
    io;
    // Classroom can be array of object for multiple classes
    classroom = {
        // class room can have multiple classes where classname as key 
    };

    createSocketConnection(server) {

        //socket connection 
        this.io = io(server, {
            cors: {
                methods: ["GET", "POST"]
            },
            pingInterval: 3000,
            pingTimeout: 3000
        })

        this.io.on('connection', (socket) => {
            console.log("connected to the socket", socket.id);

            // joinClassRoom event for student to join the class
            socket.on('joinClassRoom', (data, callback) => {

                console.log('check class room for teacher', data.id);

                if (this.classroom[data.className]) {
                    const isTeacherJoined = Object.keys(this.classroom[data.className].teachers).length >= 1 ? true : false;

                    if (isTeacherJoined) {

                        const studentCount = Object.keys(this.classroom[data.className].students).length + 1;

                        // adding student to the class
                        this.classroom[data.className].students[socket.id] = {
                            name: `Student ${studentCount}`,
                            id: socket.id,
                            startTime: new Date().toUTCString(),
                            endTime: null
                        }

                        socket.join(data.className);
                       
                        const displayData = {
                            teachers: Object.values(this.classroom[data.className].teachers),
                            students: Object.values(this.classroom[data.className].students)
                        }
                       
                        this.io.to(data.className).emit('displayData', displayData);
                        callback(true);
                    } else {
                        callback(false);
                    }
                } else {
                    callback(false);
                }

            });


            /***
             * startClass event is for teacher to start the class.
             * - ${data} - Contains className, socketid
             * we can read the name of teacher from authentication. for now added them as manully in the backend
             */

            socket.on('startClass', (data, callback) => {

                console.log("Start the class")
                socket.join(data.className);

                if (!this.classroom[data.className]) {
                    this.classroom[data.className] = { teachers: {}, students: {}, startTime: new Date().toUTCString() }
                }

                const teacherCount = Object.keys(this.classroom[data.className].teachers).length + 1;

                // To avoid duplicate entry in the object using socketid as a key
                if (this.classroom[data.className].teachers[socket.id]) {
                    console.log("Class already started");
                } else {

                    // adding teacher to the class
                    this.classroom[data.className].teachers[socket.id] = {
                        name: `Teacher ${teacherCount}`,
                        id: socket.id,
                        startTime: new Date().toUTCString(),
                        endTime: null
                    }
                }

                /**
                 * sending the class data. if we want to display multiple class data 
                 * we can send entire classroom
                 */
                const displayData = {
                    teachers: Object.values(this.classroom[data.className].teachers),
                    students: this.classroom[data.className].students ? Object.values(this.classroom[data.className].students) : []
                }

                this.io.to(data.className).emit('displayData', displayData);
                callback();
            });

            socket.on('endClass', async (data, callback) => {

                if (this.classroom[data.className].teachers[socket.id]) {
                    
                    this.classroom[data.className].teachers[socket.id]['endTime'] = new Date().toUTCString();
                   
                    let studentKeys = Object.keys(this.classroom[data.className].students);

                    this.io.to(data.className).emit('displayData', {});

                    for (let student of studentKeys) {

                        if (this.classroom[data.className].students[student]['endTime'] == null) {
                            this.classroom[data.className]
                                .students[student]['endTime'] = new Date().toUTCString();

                            this.io.to(data.className).emit('closeConnection', true);
                        }
                    }

                    const classroomDB = new NoSQLDatabase('classroom');

                    const document = {
                        className: data.className,
                        teachers: Object.values(this.classroom[data.className].teachers),
                        students: Object.values(this.classroom[data.className].students),
                        startTime: this.classroom[data.className].startTime,
                        endTime: new Date().toUTCString()
                    }

                    try {
                        await classroomDB.insert(document);
                        console.log("document stored in the db");
                        this.classroom[data.className] = { teachers: {}, students: {} };
                    } catch (err) {
                        console.log(err);
                    }
                    callback(true);
                }
            });

            socket.on('disconnecting', () => {

                for (let className of socket.rooms) {

                    if (this.classroom[className]) {

                        if (this.classroom[className].teachers[socket.id]) {
                            // teacher disconnected from the socket.
                        } else if (
                            this.classroom[className].students &&
                            this.classroom[className].students[socket.id]) {
                            this.classroom[className].students[socket.id].endTime = new Date().toUTCString();
                        }
                    }
                }


            });
            socket.on('disconnect', () => {
                console.log("socket disconnected " + socket.id);
            });
        });
    }
}

module.exports.socket = new Socket();