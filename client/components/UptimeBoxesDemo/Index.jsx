import React, { Component } from 'react';

class ExponentialMovingAverage {
  constructor(alpha) {
    this.alpha = alpha;
    this.lastValue = null;
  }

  value() {
    return this.lastValue;
  }

  push(dataPoint) {
    let { alpha, lastValue } = this;

    if (lastValue) {
      return this.lastValue = lastValue + alpha * (dataPoint - lastValue);
    } else {
      return this.lastValue = dataPoint;
    }
  }
}

class IndexComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { isPlaying: false, servers: generateServers(), fps: null };
    this.raf = null;
  }

  onFrame() {
    this.setState({ servers: generateServers() });
  }

  play() {
    this.setState({ isPlaying: true });

    let lastFrame = null;
    let fpsMeter = new ExponentialMovingAverage(2/121);

    let callback = () => {
      let thisFrame = window.performance.now();

      this.onFrame();

      if (lastFrame) {
        this.setState({ fps: Math.round(fpsMeter.push(1000 / (thisFrame - lastFrame))) });
      }

      this.raf = requestAnimationFrame(callback);

      lastFrame = thisFrame;
    };

    callback();

    lastFrame = null;
  }

  pause() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
    this.setState({ isPlaying: false });
  }

  componentWillUnmount() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
  }

  render() {
    let label = this.state.isPlaying ? 'Pause' : 'Play';
    let action = this.state.isPlaying ? this.pause.bind(this) : this.play.bind(this);
    let servers = this.state.servers.map(server => {
      return <ServerUptime key={server.name} name={server.name} days={server.days} />
    });

    let fps = null;

    if (this.state.fps) {
      fps = <div id="fps">{this.state.fps} FPS</div>;
    }

    return (
      <div>
        <p><button onClick={action}>{label}</button></p>

        {fps}

        <div>{servers}</div>
      </div>
    );
  }
}

export default IndexComponent;

class ServerUptime extends Component {
  render() {
    let upDays = this.props.days.reduce((upDays, day) => {
      return upDays += (day.up ? 1 : 0);
    }, 0);

    let [streak] = this.props.days.reduce(([max, streak], day) => {
      if (day.up && streak + 1 > max) {
        return [streak + 1, streak + 1];
      } else if (day.up) {
        return [max, streak + 1];
      } else {
        return [max, 0];
      }
    }, [0, 0]);

    let days = this.props.days.map((day, i) => {
      return <UptimeDay key={i} day={day} />
    });

    return (
      <server-uptime>
        <h1>{this.props.name}</h1>
        <h2>{upDays} Days Up</h2>
        <h2>Biggest Streak: {streak}</h2>
        <div className="days">{days}</div>
      </server-uptime>
    );
  }
}

class UptimeDay extends Component {
  render() {
    let day = this.props.day;
    let color = day.up ? '#8cc665' : '#ccc';
    let memo = day.up ? 'Servers operational!' : 'Red alert!';

    return (
      <uptime-day>
        <span className="uptime-day" style={{ backgroundColor: color }} />
        <span className="hover">{day.number}<span>:{ " " }{memo}</span></span>
      </uptime-day>
    );
  }
}

function generateServer(name) {
  let days = [];

  for (let i=0; i<=364; i++) {
    let up = Math.random() > 0.2;
    days.push({ number: i, up });
  }

  return { name, days };
}

function generateServers() {
  return [
    generateServer("Stefan's Server"),
    generateServer("Godfrey's Server"),
    generateServer("Yehuda's Server"),

    // generateServer("Chad's Server"),
    // generateServer("Robert's Server")
  ];
}
