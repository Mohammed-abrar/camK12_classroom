import React from 'react';
import { DisplayClassRoom } from '../display/display';


export class Student extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.isClassEnded) {
            return (<div><center> <h1>Class ended</h1></center></div>)
        }
        
        if (this.props.isClassStarted) {

            return (
                <div>
                    <center><h1>Student component</h1></center>
                    <DisplayClassRoom classroom={this.props.classroomDetails} />
                </div>
            );
        } else {

            return (
                <div> permission denied. please wait untill teacher starts the session </div>
            )
        }
    }
}