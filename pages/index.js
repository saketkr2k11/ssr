import Page from '../components/Page';
import Sidebuttons from '../components/SideButtons';
import axios from 'axios';
import { Row, Col } from 'reactstrap';
import React from 'react';

class Home extends React.Component {
  static async getInitialProps(ctx) {
    const res = await fetch(`https://api.spacexdata.com/v3/launches?limit=100`);
    const data = await res.json();

    //   // Pass data to the page via props
    return { data };
  }
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      data: this.props.data,
      yy: '',
      launch: '',
      land: '',
    };
    this.updateList = this.updateList.bind(this);
  }

  async updateList() {
    let url = 'https://api.spaceXdata.com/v3/launches?limit=100&';
    let durl = '';
    const { yy, launch, land } = this.state;
    if (yy !== '' && land === '' && launch === '') {
      durl = 'launch_year=' + parseInt(yy);
    } else if (yy === '' && land !== '' && launch === '') {
      durl = 'land_success=' + land;
    } else if (yy === '' && land === '' && launch !== '') {
      durl = 'launch_success=' + launch;
    } else if (yy !== '' && land === '' && launch !== '') {
      durl = 'launch_success=' + launch + '&launch_year=' + parseInt(yy);
    } else if (yy !== '' && land !== '' && launch === '') {
      durl = 'land_success=' + land + '&launch_year=' + parseInt(yy);
    } else if (yy === '' && land !== '' && launch !== '') {
      durl = 'land_success=' + land + '&launch_success=' + launch;
    } else if (yy !== '' && land !== '' && launch !== '') {
      durl =
        'land_success=' +
        land +
        '&launch_success=' +
        launch +
        '&launch_year=' +
        parseInt(yy);
    }
    url = url + durl;
    console.log(url);
    let response = await axios.get(url);
    this.setState({ data: response.data, loading: false });
  }

  handler = (val) => {
    this.setState(
      {
        yy: val.yearFilter,
        launch: val.launchFilter,
        land: val.landFilter,
      },
      () => {
        this.setState({ loading: true }, () => this.updateList());
      }
    );
  };
  render() {
    return (
      <div className='App'>
        <h1>SpaceX Launch Programs</h1>

        <div className='maindiv'>
          <Row>
            <Col className='col-12 col-md-4 col-lg-3'>
              <Sidebuttons handler={this.handler} />
            </Col>
            <Col className='col-12 col-md-8 col-lg-9'>
              {this.state.loading ? (
                <div>Loading..</div>
              ) : this.state.data.length == 0 ? (
                <div>No records found</div>
              ) : (
                <Page data={this.state.data} />
              )}
            </Col>
          </Row>
        </div>
        <div className='footer'>
          <h6>Developed by Saket Kumar</h6>
        </div>
      </div>
    );
  }
}

export default Home;
