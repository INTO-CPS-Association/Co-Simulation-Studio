import React, { Component } from 'react';
//import { Subject } from 'rxjs';
//import MaestroApiService, { maestroVersions } from 'src/app/modules/shared/services/maestro-api.service';

class CoeLaunchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      online: false,
      correctCoeVersion: false,
      required_coe_version: "1.0.0", //FIXME dummy variable
      IsMonoriting: false, //FIXME dummy variable
      coeLaunchClick: 0, //FIXME dummy variable
      _coeIsOnlineSub: null,
      coeVersions: "1.0.0" //FIXME dummy variable 
    };
    };

  onCoeLaunchClick = () => {
    this.coeLaunchClick = this.coeLaunchClick+1;
    console.log("Cosimulation Launched")

    if(this.required_coe_version === this.coeVersions)
    {
    this.setState({online: true,
                  IsMonoriting: true,
                  correctCoeVersion: true})
    }
    else 
    {
      this.ngDestroy()
    }
  };
  ngDestroy = () => {
    this.setState({online: false,
      IsMonoriting: false,
      correctCoeVersion: false,})
      console.log("Cosimulation destroyed")
  }

  render() {
    const { online, correctCoeVersion } = this.state;
    return (
      <div>
        {/* Render your component content here */}
        <p>Online: {online.toString()}</p>
        <p>Correct COE Version: {correctCoeVersion.toString()}</p>
        <button onClick={this.onCoeLaunchClick}>Launch COE</button>
      </div>
    );
  }
}

export default CoeLaunchComponent;